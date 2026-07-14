import os
import json
import logging
from PIL import Image
from google import genai
from pydantic import BaseModel, Field
from typing import List

logger = logging.getLogger("smart_system.pesticide_engine")


# ═══════════════════════════════════════════════════════════════════════════════
#  Structured Output Schemas (11-Step Pipeline)
# ═══════════════════════════════════════════════════════════════════════════════

class OCRExtraction(BaseModel):
    product_name: str = Field(description="Product name as printed on the label.")
    brand: str = Field(description="Brand name.")
    manufacturer: str = Field(description="Manufacturer or company name.")
    active_ingredient: str = Field(description="Active ingredient(s) listed.")
    concentration: str = Field(description="Concentration/strength if visible.")
    registration_number: str = Field(description="Regulatory registration number if visible.")
    batch_number: str = Field(description="Batch or lot number if visible.")
    manufacturing_date: str = Field(description="Manufacturing date if visible.")
    expiry_date: str = Field(description="Expiry date if visible.")
    net_content: str = Field(description="Net content/volume/weight if visible.")
    qr_code_present: str = Field(description="Yes or No.")
    barcode_present: str = Field(description="Yes or No.")
    hazard_symbols: str = Field(description="Hazard symbols or pictograms observed.")
    safety_instructions: str = Field(description="Safety/PPE instructions if visible.")
    dosage_instructions: str = Field(description="Dosage instructions if visible.")

class ProductIdentification(BaseModel):
    identified_brand: str = Field(description="Identified brand (e.g. Bayer, Syngenta). 'Unknown' if uncertain.")
    identified_product: str = Field(description="Identified product (e.g. Confidor 17.8 SL). 'Unknown' if uncertain.")
    product_category: str = Field(description="Category: Insecticide, Fungicide, Herbicide, etc.")

class OfficialReference(BaseModel):
    source_description: str = Field(description="Description of the official reference used for comparison (e.g. manufacturer website, known product catalog).")
    reference_available: str = Field(description="Yes or No — whether an official reference was found in the model's knowledge.")
    known_active_ingredient: str = Field(description="The known active ingredient for this product from official sources, or 'Unknown'.")
    known_manufacturer: str = Field(description="The known manufacturer for this product from official sources, or 'Unknown'.")
    known_registration_format: str = Field(description="Known registration number format or example, or 'Unknown'.")

class ComparisonField(BaseModel):
    field_name: str = Field(description="Name of the field being compared.")
    status: str = Field(description="Must be exactly MATCH, PARTIAL MATCH, MISMATCH, or UNABLE TO VERIFY.")
    detail: str = Field(description="Brief explanation of the comparison result.")

class PackagingComparison(BaseModel):
    comparisons: List[ComparisonField] = Field(description="List of field-by-field comparisons against official reference.")

class TamperingDetection(BaseModel):
    tampering_detected: str = Field(description="Yes, No, or Inconclusive.")
    issues_found: List[str] = Field(description="List of specific tampering indicators found. Empty if none.")
    print_quality: str = Field(description="Professional, Acceptable, Poor, or Suspicious.")
    label_integrity: str = Field(description="Intact, Partially Damaged, Suspicious, or Tampered.")

class ExpiryValidation(BaseModel):
    status: str = Field(description="Must be exactly Valid, Expired, or Cannot Determine.")
    expiry_date_found: str = Field(description="The expiry date found, or Not Visible.")
    detail: str = Field(description="Brief explanation.")

class RegistrationValidation(BaseModel):
    status: str = Field(description="Must be exactly Verified Format, Suspicious Format, Not Visible, or Unable to Verify.")
    registration_number: str = Field(description="The registration number found, or Not Visible.")
    detail: str = Field(description="Brief explanation of format validity.")

class SimilarityScore(BaseModel):
    packaging_similarity: int = Field(description="Overall packaging similarity percentage 0-100.")
    explanation: str = Field(description="Why the similarity score is this value.")

class RiskAssessment(BaseModel):
    risk: str = Field(description="Must be exactly LOW, MEDIUM, or HIGH.")
    confidence: int = Field(description="AI confidence in this assessment, 0-100.")
    confidence_explanation: str = Field(description="Why confidence is high or low.")

class DecisionCheck(BaseModel):
    check: str = Field(description="What was checked.")
    result: str = Field(description="Must be exactly PASS, WARNING, or FAIL.")
    detail: str = Field(description="Brief explanation.")

class DecisionExplanation(BaseModel):
    checks: List[DecisionCheck] = Field(description="List of every check performed with PASS/WARNING/FAIL.")

class FinalRecommendation(BaseModel):
    conclusion: str = Field(description="Final conclusion statement. Never say 'genuine'. Use 'appears consistent' or 'contains inconsistencies'.")
    recommended_action: str = Field(description="What the user should do next.")
    crop_suitability: str = Field(description="Is this product suitable for the user's target crop/disease if specified?")

class PesticideReport(BaseModel):
    ocr: OCRExtraction
    product_id: ProductIdentification
    official_reference: OfficialReference
    packaging_comparison: PackagingComparison
    tampering: TamperingDetection
    expiry: ExpiryValidation
    registration: RegistrationValidation
    similarity: SimilarityScore
    risk_assessment: RiskAssessment
    decision: DecisionExplanation
    recommendation: FinalRecommendation


# ═══════════════════════════════════════════════════════════════════════════════
#  Prompts
# ═══════════════════════════════════════════════════════════════════════════════

SYSTEM_PROMPT = """You are an AI Pesticide Authentication Engine.

Your goal is to determine whether the uploaded pesticide packaging appears visually consistent with the official product packaging.

Do NOT guarantee authenticity.
Instead, collect evidence and assign an authenticity risk.
Never fabricate information.
If any information is unreadable or missing, explicitly state "Not Visible" or "Unable to Determine."
Do not assume information that is not visible.
Return ONLY valid JSON."""


def build_user_prompt(target_crop: str = "", target_disease: str = "") -> str:
    crop_ctx = f"\nTarget Crop: {target_crop}" if target_crop else ""
    disease_ctx = f"\nTarget Disease: {target_disease}" if target_disease else ""

    return f"""Analyze this pesticide package image.{crop_ctx}{disease_ctx}

STEP 1 — OCR
Extract every visible field: Product Name, Brand, Manufacturer, Active Ingredient, Concentration, Registration Number, Batch Number, Manufacturing Date, Expiry Date, Net Content, QR Code (Yes/No), Barcode (Yes/No), Hazard Symbols, Safety Instructions, Dosage. Return "Not Visible" for missing fields.

STEP 2 — Identify Product
Determine the Brand (e.g. Bayer) and Product (e.g. Confidor 17.8 SL). If uncertain, say "Unknown".

STEP 3 — Retrieve Official References
Using the identified brand and product name, retrieve official reference information from your knowledge of trusted sources (manufacturer websites, government pesticide registries, authorized distributors). Report the known active ingredient, known manufacturer, and known registration number format for this product. If no reference is available, state so clearly.

STEP 4 — Packaging Comparison
Compare the uploaded image against official reference data. For each of these fields, return MATCH, PARTIAL MATCH, MISMATCH, or UNABLE TO VERIFY: Logo Design, Logo Position, Font Style, Color Scheme, Bottle/Container Shape, Label Layout, Text Alignment, Hazard Symbols, Registration Number Format, Active Ingredient, Manufacturer Name, Product Name, Barcode Placement, QR Code Placement.

STEP 5 — Tampering Detection
Check for: blurred printing, edited labels, pasted stickers, overwritten expiry, altered batch number, inconsistent fonts, different logo, low-quality print, missing hologram, missing QR code (if official packaging includes one), cropped label, spelling mistakes, incorrect manufacturer, suspicious colors. Report every issue found.

STEP 6 — Expiry Validation
Determine: Expired, Valid, or Cannot Determine.

STEP 7 — Registration Validation
If registration number is visible, evaluate whether its format is consistent with known registration number formats for this type of product and region. Return Verified Format, Suspicious Format, Not Visible, or Unable to Verify.

STEP 8 — Similarity Score
Estimate overall packaging similarity (0-100%) compared to official product references. Explain your reasoning.

STEP 9 — Risk Assessment
Classify as LOW, MEDIUM, or HIGH risk based on all evidence collected above.
LOW: Packaging matches official references, correct branding, correct manufacturer, correct active ingredient, correct layout, readable expiry, no spelling mistakes.
MEDIUM: Minor differences, poor image quality, missing fields, cannot verify registration.
HIGH: Different packaging, different logo, wrong manufacturer, wrong active ingredient, missing registration, edited label, visible tampering, multiple spelling mistakes.
Include a confidence score (0-100) and explain why.

STEP 10 — Decision Checklist
List every comparison check with PASS, WARNING, or FAIL result. Examples: "Logo matches official reference" → PASS, "QR code not visible" → WARNING, "Manufacturer name differs" → FAIL.

STEP 11 — Final Recommendation
Never state "This product is genuine."
Instead use "The packaging appears highly consistent with official product references." or "The packaging contains significant inconsistencies and should be treated as suspicious."
Include a recommended action and crop suitability assessment if target crop was provided.

Return structured JSON only."""


# ═══════════════════════════════════════════════════════════════════════════════
#  Engine
# ═══════════════════════════════════════════════════════════════════════════════

class PesticideEngine:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None
            logger.warning("GEMINI_API_KEY not set. Pesticide engine will not function.")

    def analyze_label(self, image: Image.Image, target_crop: str = "", target_disease: str = "") -> dict:
        if not self.client:
            return {"success": False, "error": "Gemini API key not configured."}

        try:
            # Resize large images to prevent socket aborts (WinError 10053)
            max_size = 1024
            if image.width > max_size or image.height > max_size:
                image = image.copy()
                resample = getattr(Image, "Resampling", Image).LANCZOS
                image.thumbnail((max_size, max_size), resample)

            model_id = "gemini-2.5-flash"
            user_prompt = build_user_prompt(target_crop, target_disease)

            response = self.client.models.generate_content(
                model=model_id,
                contents=[
                    SYSTEM_PROMPT,
                    image,
                    user_prompt
                ],
                config=genai.types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=PesticideReport,
                    temperature=0.15
                ),
            )

            result = json.loads(response.text)
            return {
                "success": True,
                "data": result
            }

        except Exception as e:
            logger.error(f"Failed to analyze pesticide image: {e}", exc_info=True)
            return {"success": False, "error": str(e)}
