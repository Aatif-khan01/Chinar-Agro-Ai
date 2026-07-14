"""
Dataset Download & Preparation — Ensemble Training
=====================================================
Downloads PlantVillage, Rice Leaf Disease, and Cassava Leaf Disease
datasets, then combines and splits them into train/val for ensemble
model training.

Requirements:
  pip install kagglehub

Usage:
  python -m disease_model.scripts.download_dataset
"""

import os
import sys
import shutil
import random
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
logger = logging.getLogger("download_dataset")

PROJECT_ROOT = Path(__file__).resolve().parents[2]
COMBINED_DIR = PROJECT_ROOT / "disease_model" / "data" / "combined"
TRAIN_DIR = COMBINED_DIR / "train"
VAL_DIR   = COMBINED_DIR / "val"

TRAIN_SPLIT = 0.8
RANDOM_SEED = 42

# Expected class names (must match class_names.json exactly)
EXPECTED_CLASSES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust",
    "Apple___healthy", "Blueberry___healthy",
    "Cassava___Bacterial_Blight", "Cassava___Brown_Streak",
    "Cassava___Green_Mottle", "Cassava___Healthy", "Cassava___Mosaic",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy", "Corn___Common_rust",
    "Grape___Black_rot", "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy",
    "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Raspberry___healthy",
    "Rice___Bacterial_Leaf_Blight", "Rice___Brown_Spot",
    "Rice___Healthy_Rice_Leaf", "Rice___Leaf_Blast", "Rice___Leaf_scald",
    "Rice___Narrow_Brown_Leaf_Spot", "Rice___Rice_Hispa",
    "Rice___Sheath_Blight",
    "Soybean___healthy", "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch", "Strawberry___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight",
    "Tomato___Late_blight", "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus", "Tomato___healthy",
]

VALID_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp', '.JPG', '.JPEG', '.PNG'}


def download_plantvillage():
    """Download PlantVillage dataset via kagglehub."""
    try:
        import kagglehub
    except ImportError:
        logger.error("kagglehub not installed. Run: pip install kagglehub")
        sys.exit(1)

    logger.info("Downloading PlantVillage dataset from Kaggle...")
    path = kagglehub.dataset_download("abdallahalidev/plantvillage-dataset")
    logger.info(f"PlantVillage downloaded to: {path}")
    return path


def download_rice_disease():
    """Download Rice Leaf Disease dataset via kagglehub."""
    import kagglehub
    logger.info("Downloading Rice Leaf Disease dataset from Kaggle...")
    path = kagglehub.dataset_download("vbookshelf/rice-leaf-diseases")
    logger.info(f"Rice disease downloaded to: {path}")
    return path


def download_cassava_disease():
    """Download Cassava Leaf Disease dataset via kagglehub."""
    import kagglehub
    logger.info("Downloading Cassava Leaf Disease dataset from Kaggle...")
    path = kagglehub.dataset_download("nirmalsankalana/cassava-leaf-disease-classification")
    logger.info(f"Cassava disease downloaded to: {path}")
    return path


def find_class_dirs(base_path: str, expected_prefix: str = None):
    """Recursively find directories that match expected class names."""
    base = Path(base_path)
    found = {}
    
    for d in base.rglob("*"):
        if d.is_dir():
            name = d.name
            if name in EXPECTED_CLASSES:
                # Check if this directory actually has images
                images = [f for f in d.iterdir() if f.suffix.lower() in {'.jpg', '.jpeg', '.png', '.bmp', '.webp'}]
                if len(images) > 0:
                    found[name] = d
                    logger.info(f"  Found class: {name} ({len(images)} images)")
    
    return found


def copy_class_images(src_dir: Path, class_name: str, dest_train: Path, dest_val: Path):
    """Copy images from a class directory to train/val splits."""
    images = sorted([
        f for f in src_dir.iterdir()
        if f.is_file() and f.suffix.lower() in {'.jpg', '.jpeg', '.png', '.bmp', '.webp', '.tiff'}
    ])
    
    if not images:
        logger.warning(f"  {class_name}: no images found!")
        return 0, 0
    
    random.seed(RANDOM_SEED)
    random.shuffle(images)
    
    split_idx = int(len(images) * TRAIN_SPLIT)
    train_images = images[:split_idx]
    val_images = images[split_idx:]
    
    train_class_dir = dest_train / class_name
    val_class_dir = dest_val / class_name
    train_class_dir.mkdir(parents=True, exist_ok=True)
    val_class_dir.mkdir(parents=True, exist_ok=True)
    
    for img in train_images:
        shutil.copy2(img, train_class_dir / img.name)
    for img in val_images:
        shutil.copy2(img, val_class_dir / img.name)
    
    return len(train_images), len(val_images)


def main():
    logger.info("=" * 60)
    logger.info("  DATASET DOWNLOAD & PREPARATION")
    logger.info("=" * 60)
    
    if TRAIN_DIR.exists() and VAL_DIR.exists():
        # Check if data already exists
        existing_train = len(list(TRAIN_DIR.iterdir()))
        existing_val = len(list(VAL_DIR.iterdir()))
        if existing_train >= 50 and existing_val >= 50:
            logger.info(f"Dataset already exists: {existing_train} train classes, {existing_val} val classes")
            logger.info("Delete disease_model/data/combined/ to re-download.")
            return
    
    # Download datasets
    plantvillage_path = download_plantvillage()
    rice_path = download_rice_disease()
    cassava_path = download_cassava_disease()
    
    # Find class directories in downloaded data
    logger.info("\nScanning PlantVillage for classes...")
    pv_classes = find_class_dirs(plantvillage_path)
    
    logger.info("\nScanning Rice disease dataset for classes...")
    rice_classes = find_class_dirs(rice_path)
    
    logger.info("\nScanning Cassava disease dataset for classes...")
    cassava_classes = find_class_dirs(cassava_path)
    
    # Merge all found classes
    all_classes = {}
    all_classes.update(pv_classes)
    all_classes.update(rice_classes)
    all_classes.update(cassava_classes)
    
    # Check which expected classes are missing
    missing = set(EXPECTED_CLASSES) - set(all_classes.keys())
    if missing:
        logger.warning(f"\nMissing {len(missing)} classes: {missing}")
        logger.warning("These classes won't have data. The model may have reduced accuracy for them.")
    
    found_count = len(all_classes)
    logger.info(f"\nFound {found_count}/{len(EXPECTED_CLASSES)} expected classes")
    
    # Create train/val splits
    logger.info("\nCreating train/val splits...")
    TRAIN_DIR.mkdir(parents=True, exist_ok=True)
    VAL_DIR.mkdir(parents=True, exist_ok=True)
    
    total_train = 0
    total_val = 0
    
    for class_name, src_dir in sorted(all_classes.items()):
        n_train, n_val = copy_class_images(src_dir, class_name, TRAIN_DIR, VAL_DIR)
        total_train += n_train
        total_val += n_val
        logger.info(f"  {class_name}: {n_train} train, {n_val} val")
    
    logger.info(f"\n{'=' * 60}")
    logger.info(f"Dataset ready!")
    logger.info(f"  Train: {total_train:,} images in {found_count} classes")
    logger.info(f"  Val:   {total_val:,} images")
    logger.info(f"  Path:  {COMBINED_DIR}")
    logger.info(f"{'=' * 60}")


if __name__ == "__main__":
    main()
