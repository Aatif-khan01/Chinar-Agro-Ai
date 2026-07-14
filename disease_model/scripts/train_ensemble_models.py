"""
Secondary Model Fine-Tuner — Ensemble Training Script
=======================================================
Trains ResNet-50 and EfficientNet-B1 on the same 52-class plant disease
dataset used for the primary EfficientNet-B0 model.

Transfer Learning Strategy
--------------------------
Phase 1 — Head Training (5–10 epochs):
  • Freeze the entire backbone
  • Train only the new classification head
  • High LR for fast convergence: 1e-3

Phase 2 — Partial Fine-Tuning (10–15 epochs):
  • Unfreeze last N backbone layers
  • Lower LR for subtle feature adaptation: 1e-4 to 1e-5
  • Use cosine annealing LR schedule

Usage
-----
Run from project root:
  python -m disease_model.scripts.train_ensemble_models

Or call individual training functions programmatically:
  from disease_model.scripts.train_ensemble_models import train_model
  train_model("resnet50", data_dir, output_dir, epochs=25)

Outputs
-------
  disease_model/models/ensemble_resnet50.pth
  disease_model/models/ensemble_efficientnet_b1.pth

Author  : Chinar Agro AI Team
Version : 3.0.0
"""

from __future__ import annotations

import os
import sys
import json
import time
import logging
import torch
from pathlib import Path
from typing import Optional

# ── Make the project importable ───────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(PROJECT_ROOT))

logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s] %(asctime)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("train_ensemble")


# ═══════════════════════════════════════════════════════════════
# TRAINING CONFIGURATION
# ═══════════════════════════════════════════════════════════════

TRAIN_CONFIG = {
    "image_size":    224,
    "batch_size":    32,
    "num_workers":   0,     # 0 on Windows (avoid multiprocessing issues)
    "phase1_epochs": 8,     # Head-only training
    "phase2_epochs": 12,    # Partial fine-tuning
    "phase1_lr":     1e-3,
    "phase2_lr":     1e-4,
    "weight_decay":  1e-4,
    "label_smoothing": 0.1,
    "imagenet_mean": [0.485, 0.456, 0.406],
    "imagenet_std":  [0.229, 0.224, 0.225],
}


def get_data_transforms():
    """Return training and validation torchvision transforms."""
    from torchvision import transforms

    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(TRAIN_CONFIG["image_size"], scale=(0.7, 1.0)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(p=0.2),
        transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.3, hue=0.05),
        transforms.RandomRotation(20),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=TRAIN_CONFIG["imagenet_mean"],
            std=TRAIN_CONFIG["imagenet_std"],
        ),
    ])

    val_transform = transforms.Compose([
        transforms.Resize((TRAIN_CONFIG["image_size"], TRAIN_CONFIG["image_size"])),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=TRAIN_CONFIG["imagenet_mean"],
            std=TRAIN_CONFIG["imagenet_std"],
        ),
    ])

    return train_transform, val_transform


def load_datasets(data_dir: str):
    """
    Load ImageFolder datasets from data_dir.

    Expected directory structure:
        data_dir/
          train/
            Apple___Apple_scab/
            Apple___Black_rot/
            ...
          val/
            Apple___Apple_scab/
            ...

    Parameters
    ----------
    data_dir : str
        Root directory containing train/ and val/ subdirectories.

    Returns
    -------
    tuple
        (train_loader, val_loader, class_names, num_classes)
    """
    import torch
    from torchvision import datasets
    from torch.utils.data import DataLoader

    train_transform, val_transform = get_data_transforms()

    train_dir = os.path.join(data_dir, "train")
    val_dir   = os.path.join(data_dir, "val")

    if not os.path.isdir(train_dir):
        raise FileNotFoundError(f"Training directory not found: {train_dir}")
    if not os.path.isdir(val_dir):
        raise FileNotFoundError(f"Validation directory not found: {val_dir}")

    train_dataset = datasets.ImageFolder(train_dir, transform=train_transform)
    val_dataset   = datasets.ImageFolder(val_dir,   transform=val_transform)

    train_loader = DataLoader(
        train_dataset,
        batch_size=TRAIN_CONFIG["batch_size"],
        shuffle=True,
        num_workers=TRAIN_CONFIG["num_workers"],
        pin_memory=True,
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=TRAIN_CONFIG["batch_size"],
        shuffle=False,
        num_workers=TRAIN_CONFIG["num_workers"],
        pin_memory=True,
    )

    logger.info(
        f"Dataset loaded: {len(train_dataset)} train | "
        f"{len(val_dataset)} val | "
        f"{len(train_dataset.classes)} classes"
    )

    return train_loader, val_loader, train_dataset.classes, len(train_dataset.classes)


def build_model(model_name: str, num_classes: int):
    """
    Build the secondary model with ImageNet pretrained weights
    and a custom classification head for num_classes output.

    Parameters
    ----------
    model_name : str
        'resnet50' or 'efficientnet_b1'
    num_classes : int
        Number of disease classes.

    Returns
    -------
    torch.nn.Module
        Model with replaced classification head.
    """
    import torch.nn as nn
    from torchvision import models

    if model_name == "resnet50":
        logger.info("Building ResNet-50 with ImageNet V2 pretrained weights...")
        model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2)
        in_features = model.fc.in_features
        # Replace fc with a simple linear layer (52 classes)
        model.fc = nn.Linear(in_features, num_classes)
        logger.info(f"ResNet-50 fc replaced: Linear({in_features}, {num_classes})")

    elif model_name == "efficientnet_b1":
        logger.info("Building EfficientNet-B1 with ImageNet V1 pretrained weights...")
        model = models.efficientnet_b1(weights=models.EfficientNet_B1_Weights.IMAGENET1K_V1)
        in_features = model.classifier[1].in_features
        # Replace classifier head
        model.classifier = nn.Sequential(
            nn.Dropout(p=0.2, inplace=True),
            nn.Linear(in_features, num_classes),
        )
        logger.info(f"EfficientNet-B1 classifier replaced: Linear({in_features}, {num_classes})")

    else:
        raise ValueError(f"Unsupported model: {model_name}. Choose 'resnet50' or 'efficientnet_b1'")

    return model


def set_trainable_layers(model_name: str, model, phase: int):
    """
    Configure which layers are trainable for the given training phase.

    Phase 1: Head Only — Freeze backbone, train only head
    Phase 2: Partial Unfreeze — Unfreeze last blocks + head

    Parameters
    ----------
    model_name : str
        'resnet50' or 'efficientnet_b1'
    model : torch.nn.Module
        The model to configure.
    phase : int
        1 (head only) or 2 (partial unfreeze).
    """
    # Phase 1: Freeze everything
    for param in model.parameters():
        param.requires_grad = False

    if model_name == "resnet50":
        if phase == 1:
            # Unfreeze only fc (classification head)
            for param in model.fc.parameters():
                param.requires_grad = True
        elif phase == 2:
            # Unfreeze layer3, layer4, fc
            for name, param in model.named_parameters():
                if any(name.startswith(p) for p in ["layer3", "layer4", "fc"]):
                    param.requires_grad = True

    elif model_name == "efficientnet_b1":
        if phase == 1:
            # Unfreeze only classifier head
            for param in model.classifier.parameters():
                param.requires_grad = True
        elif phase == 2:
            # Unfreeze last 3 MBConv blocks + classifier
            for name, param in model.named_parameters():
                if any(name.startswith(p) for p in
                       ["features.6", "features.7", "features.8", "classifier"]):
                    param.requires_grad = True

    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    total     = sum(p.numel() for p in model.parameters())
    logger.info(
        f"Phase {phase} | {model_name}: "
        f"{trainable:,} / {total:,} params trainable "
        f"({100 * trainable / total:.1f}%)"
    )


def train_one_epoch(model, loader, optimizer, criterion, device, epoch: int):
    """Run one training epoch. Returns (avg_loss, accuracy)."""
    import torch

    model.train()
    total_loss, correct, total = 0.0, 0, 0

    for batch_idx, (images, labels) in enumerate(loader):
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        total_loss += loss.item() * images.size(0)
        _, predicted = outputs.max(1)
        correct += predicted.eq(labels).sum().item()
        total += images.size(0)

        if (batch_idx + 1) % 50 == 0:
            logger.info(
                f"  Epoch {epoch} [{batch_idx+1}/{len(loader)}] "
                f"Loss: {loss.item():.4f}"
            )

    return total_loss / total, 100.0 * correct / total


@torch.no_grad()
def validate(model, loader, criterion, device, class_names=None, detailed=False):
    """Run validation. Returns (avg_loss, accuracy) or (avg_loss, accuracy, per_class_acc) if detailed."""
    import torch
    from collections import defaultdict

    model.eval()
    total_loss, correct, total = 0.0, 0, 0

    # Per-class tracking
    class_correct = defaultdict(int)
    class_total = defaultdict(int)
    confusion_pairs = defaultdict(int)  # (true, pred) -> count

    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        loss = criterion(outputs, labels)

        total_loss += loss.item() * images.size(0)
        _, predicted = outputs.max(1)
        correct += predicted.eq(labels).sum().item()
        total += images.size(0)

        # Track per-class stats
        for true_label, pred_label in zip(labels.cpu().numpy(), predicted.cpu().numpy()):
            class_total[true_label] += 1
            if true_label == pred_label:
                class_correct[true_label] += 1
            else:
                confusion_pairs[(true_label, pred_label)] += 1

    avg_loss = total_loss / total
    accuracy = 100.0 * correct / total

    if detailed and class_names:
        per_class_acc = {}
        worst_classes = []
        for idx in range(len(class_names)):
            if class_total[idx] > 0:
                acc = 100.0 * class_correct[idx] / class_total[idx]
                per_class_acc[class_names[idx]] = round(acc, 1)
                if acc < 80.0:
                    worst_classes.append((class_names[idx], acc, class_total[idx]))

        # Log worst-performing classes
        if worst_classes:
            worst_classes.sort(key=lambda x: x[1])
            logger.info("  Worst-performing classes (< 80% accuracy):")
            for name, acc, count in worst_classes[:10]:
                logger.info(f"    {name}: {acc:.1f}% ({count} samples)")

        # Log most common confusion pairs
        if confusion_pairs:
            top_confusions = sorted(confusion_pairs.items(), key=lambda x: -x[1])[:5]
            logger.info("  Top confusion pairs (true -> predicted):")
            for (true_idx, pred_idx), count in top_confusions:
                true_name = class_names[true_idx] if true_idx < len(class_names) else f"cls_{true_idx}"
                pred_name = class_names[pred_idx] if pred_idx < len(class_names) else f"cls_{pred_idx}"
                logger.info(f"    {true_name} -> {pred_name}: {count} times")

        return avg_loss, accuracy, per_class_acc

    return avg_loss, accuracy


def train_model(
    model_name: str,
    data_dir: str,
    output_dir: str,
    device_str: Optional[str] = None,
) -> str:
    """
    Full two-phase training pipeline for a secondary ensemble model.

    Phase 1 (Head Only):
      - Freeze backbone
      - Train classifier head for TRAIN_CONFIG['phase1_epochs'] epochs
      - LR = TRAIN_CONFIG['phase1_lr']

    Phase 2 (Partial Unfreeze):
      - Unfreeze last backbone layers
      - Continue training for TRAIN_CONFIG['phase2_epochs'] epochs
      - LR = TRAIN_CONFIG['phase2_lr'] with cosine annealing

    Parameters
    ----------
    model_name : str
        'resnet50' or 'efficientnet_b1'
    data_dir : str
        Root directory with train/ and val/ subdirectories.
    output_dir : str
        Where to save the trained model checkpoint.
    device_str : str or None
        'cuda', 'cpu', or None (auto-detect).

    Returns
    -------
    str
        Path to the saved .pth file.
    """
    import torch
    import torch.nn as nn

    device = torch.device(
        device_str if device_str else ("cuda" if torch.cuda.is_available() else "cpu")
    )
    logger.info(f"Training {model_name} on device: {device}")

    # ── Load datasets ─────────────────────────────────────────
    train_loader, val_loader, class_names, num_classes = load_datasets(data_dir)

    # ── Build model ───────────────────────────────────────────
    model = build_model(model_name, num_classes)
    model = model.to(device)

    # ── Loss function (with label smoothing for regularization) ──
    criterion = nn.CrossEntropyLoss(label_smoothing=TRAIN_CONFIG["label_smoothing"])

    best_val_acc = 0.0
    os.makedirs(output_dir, exist_ok=True)
    save_path = os.path.join(output_dir, f"ensemble_{model_name}.pth")

    # ═══════════════════════════════════════════════════════════
    # PHASE 1: Head-Only Training
    # ═══════════════════════════════════════════════════════════
    logger.info(f"\n{'='*50}")
    logger.info(f"PHASE 1: Head-Only Training — {model_name}")
    logger.info(f"{'='*50}")

    set_trainable_layers(model_name, model, phase=1)
    optimizer = torch.optim.Adam(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=TRAIN_CONFIG["phase1_lr"],
        weight_decay=TRAIN_CONFIG["weight_decay"],
    )

    for epoch in range(1, TRAIN_CONFIG["phase1_epochs"] + 1):
        t0 = time.time()
        tr_loss, tr_acc = train_one_epoch(
            model, train_loader, optimizer, criterion, device, epoch
        )
        vl_loss, vl_acc = validate(model, val_loader, criterion, device)
        elapsed = time.time() - t0

        logger.info(
            f"[P1] Epoch {epoch:02d}/{TRAIN_CONFIG['phase1_epochs']} | "
            f"Train: loss={tr_loss:.4f} acc={tr_acc:.2f}% | "
            f"Val: loss={vl_loss:.4f} acc={vl_acc:.2f}% | "
            f"Time: {elapsed:.1f}s"
        )

        if vl_acc > best_val_acc:
            best_val_acc = vl_acc
            torch.save(model.state_dict(), save_path)
            logger.info(f"  ✓ Best model saved (val_acc={vl_acc:.2f}%)")

    # ═══════════════════════════════════════════════════════════
    # PHASE 2: Partial Fine-Tuning
    # ═══════════════════════════════════════════════════════════
    logger.info(f"\n{'='*50}")
    logger.info(f"PHASE 2: Partial Fine-Tuning — {model_name}")
    logger.info(f"{'='*50}")

    set_trainable_layers(model_name, model, phase=2)
    optimizer = torch.optim.Adam(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=TRAIN_CONFIG["phase2_lr"],
        weight_decay=TRAIN_CONFIG["weight_decay"],
    )
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
        optimizer, T_max=TRAIN_CONFIG["phase2_epochs"], eta_min=1e-6
    )

    for epoch in range(1, TRAIN_CONFIG["phase2_epochs"] + 1):
        t0 = time.time()
        tr_loss, tr_acc = train_one_epoch(
            model, train_loader, optimizer, criterion, device, epoch
        )
        vl_loss, vl_acc = validate(model, val_loader, criterion, device)
        scheduler.step()
        elapsed = time.time() - t0

        logger.info(
            f"[P2] Epoch {epoch:02d}/{TRAIN_CONFIG['phase2_epochs']} | "
            f"Train: loss={tr_loss:.4f} acc={tr_acc:.2f}% | "
            f"Val: loss={vl_loss:.4f} acc={vl_acc:.2f}% | "
            f"LR: {scheduler.get_last_lr()[0]:.2e} | "
            f"Time: {elapsed:.1f}s"
        )

        if vl_acc > best_val_acc:
            best_val_acc = vl_acc
            torch.save(model.state_dict(), save_path)
            logger.info(f"  ✓ Best model saved (val_acc={vl_acc:.2f}%)")

    logger.info(
        f"\n{'='*50}\n"
        f"Training complete: {model_name}\n"
        f"Best Val Accuracy : {best_val_acc:.2f}%\n"
        f"Model saved       : {save_path}\n"
        f"{'='*50}"
    )

    # ── Final per-class accuracy report ────────────────────────
    logger.info(f"\nRunning final per-class accuracy analysis for {model_name}...")
    # Reload best model for final evaluation
    model.load_state_dict(torch.load(save_path, map_location=device, weights_only=True))
    model.eval()
    _, final_acc, per_class = validate(
        model, val_loader, criterion, device,
        class_names=class_names, detailed=True
    )
    logger.info(f"Final validation accuracy: {final_acc:.2f}%")

    # Save per-class accuracy to JSON
    report_path = os.path.join(output_dir, f"per_class_accuracy_{model_name}.json")
    import json
    with open(report_path, "w") as f:
        json.dump({
            "model": model_name,
            "overall_accuracy": round(final_acc, 2),
            "per_class_accuracy": per_class,
        }, f, indent=2)
    logger.info(f"Per-class accuracy saved: {report_path}")

    return save_path


# ═══════════════════════════════════════════════════════════════
# MAIN ENTRY POINT
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import torch  # noqa: F401 — needed for validate() decorator

    DATA_DIR   = os.path.join(PROJECT_ROOT, "disease_model", "data", "combined")
    OUTPUT_DIR = os.path.join(PROJECT_ROOT, "disease_model", "models")

    if not os.path.isdir(DATA_DIR):
        logger.error(f"Data directory not found: {DATA_DIR}")
        logger.error("Expected: disease_model/data/combined/train/ and /val/")
        sys.exit(1)

    logger.info("Starting ensemble model training pipeline...")
    logger.info(f"Dataset: {DATA_DIR}")
    logger.info(f"Output:  {OUTPUT_DIR}")

    # Train ResNet-50
    r50_path = train_model("resnet50", DATA_DIR, OUTPUT_DIR)

    # Train EfficientNet-B1
    b1_path = train_model("efficientnet_b1", DATA_DIR, OUTPUT_DIR)

    logger.info("\n=== ENSEMBLE TRAINING COMPLETE ===")
    logger.info(f"ResNet-50 checkpoint       : {r50_path}")
    logger.info(f"EfficientNet-B1 checkpoint : {b1_path}")
    logger.info("Run the API server to activate the ensemble pipeline.")
