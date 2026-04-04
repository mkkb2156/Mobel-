"""Main AI pipeline orchestrator - 6 stages with quality gate."""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Dict, Optional

from app.services.scraper.models import ProductDetail
from app.services.ai.translator import translate_product, TranslationResult
from app.services.ai.classifier import classify_product, ClassificationResult
from app.services.ai.dimensions import estimate_dimensions, DimensionResult
from app.services.ai.pricing import calculate_pricing, PricingStageResult
from app.services.ai.grading import grade_product, GradingResult
from app.services.ai.embeddings import generate_embedding, EmbeddingResult

logger = logging.getLogger(__name__)

QUALITY_GATE_THRESHOLD = 0.7


@dataclass
class PipelineResult:
    success: bool = False
    translation: Optional[TranslationResult] = None
    classification: Optional[ClassificationResult] = None
    dimensions: Optional[DimensionResult] = None
    pricing: Optional[PricingStageResult] = None
    grading: Optional[GradingResult] = None
    embedding: Optional[EmbeddingResult] = None
    overall_confidence: float = 0.0
    passed_quality_gate: bool = False
    errors: list[str] = field(default_factory=list)
    stage_confidences: Dict[str, float] = field(default_factory=dict)


async def run_pipeline(product: ProductDetail) -> PipelineResult:
    """Run all 6 AI stages on a scraped product, with quality gate."""
    result = PipelineResult()
    confidences: list[float] = []

    # Stage 1: Translation
    try:
        result.translation = await translate_product(
            title=product.title,
            description=product.description,
            condition=product.condition,
        )
        result.stage_confidences["translation"] = result.translation.confidence
        confidences.append(result.translation.confidence)
    except Exception as exc:
        result.errors.append(f"Translation: {exc}")
        logger.error(f"Pipeline stage 1 (translation) failed: {exc}")

    # Stage 2: Classification
    try:
        result.classification = await classify_product(
            title=product.title,
            description=product.description,
            materials_hint=product.materials or None,
        )
        result.stage_confidences["classification"] = result.classification.confidence
        confidences.append(result.classification.confidence)
    except Exception as exc:
        result.errors.append(f"Classification: {exc}")
        logger.error(f"Pipeline stage 2 (classification) failed: {exc}")

    # Stage 3: Dimensions
    try:
        category = (
            result.classification.category if result.classification else "other"
        )
        result.dimensions = await estimate_dimensions(
            scraped_width=product.width_cm,
            scraped_depth=product.depth_cm,
            scraped_height=product.height_cm,
            title=product.title,
            description=product.description,
            category=category,
        )
        result.stage_confidences["dimensions"] = result.dimensions.confidence
        confidences.append(result.dimensions.confidence)
    except Exception as exc:
        result.errors.append(f"Dimensions: {exc}")
        logger.error(f"Pipeline stage 3 (dimensions) failed: {exc}")

    # Stage 4: Pricing (only if we have EUR price and dimensions)
    if product.price_eur and result.dimensions:
        try:
            designer = product.designer
            hs_code = (
                result.classification.hs_code
                if result.classification
                else "9403.60"
            )
            category = (
                result.classification.category if result.classification else "other"
            )
            result.pricing = await calculate_pricing(
                price_eur=product.price_eur,
                volume_cbm=result.dimensions.volume_cbm,
                category=category,
                designer=designer,
                hs_code=hs_code,
            )
            result.stage_confidences["pricing"] = result.pricing.confidence
            confidences.append(result.pricing.confidence)
        except Exception as exc:
            result.errors.append(f"Pricing: {exc}")
            logger.error(f"Pipeline stage 4 (pricing) failed: {exc}")

    # Stage 5: Quality grading
    try:
        result.grading = await grade_product(
            condition_text=product.condition,
            description=product.description,
            image_count=len(product.images),
            has_dimensions=bool(
                product.width_cm and product.depth_cm and product.height_cm
            ),
            has_designer=bool(product.designer),
        )
        result.stage_confidences["grading"] = result.grading.confidence
        confidences.append(result.grading.confidence)
    except Exception as exc:
        result.errors.append(f"Grading: {exc}")
        logger.error(f"Pipeline stage 5 (grading) failed: {exc}")

    # Stage 6: Embeddings
    try:
        title_zh = result.translation.title_zh if result.translation else ""
        desc_zh = result.translation.description_zh if result.translation else ""
        category = (
            result.classification.category if result.classification else ""
        )
        style = result.classification.style if result.classification else ""
        materials = (
            result.classification.materials if result.classification else []
        )
        result.embedding = await generate_embedding(
            title_zh=title_zh,
            description_zh=desc_zh,
            category=category,
            style=style,
            materials=materials,
            designer=product.designer or "",
        )
        result.stage_confidences["embedding"] = result.embedding.confidence
        confidences.append(result.embedding.confidence)
    except Exception as exc:
        result.errors.append(f"Embedding: {exc}")
        logger.error(f"Pipeline stage 6 (embedding) failed: {exc}")

    # Quality gate
    if confidences:
        result.overall_confidence = sum(confidences) / len(confidences)
    result.passed_quality_gate = result.overall_confidence >= QUALITY_GATE_THRESHOLD
    result.success = result.passed_quality_gate and len(result.errors) == 0

    logger.info(
        f"Pipeline complete for {product.source_id}: "
        f"confidence={result.overall_confidence:.2f}, "
        f"passed={result.passed_quality_gate}, "
        f"errors={len(result.errors)}"
    )
    return result
