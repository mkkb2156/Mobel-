"""Tests for the pricing engine."""

from __future__ import annotations

import pytest
from unittest.mock import patch

from app.services.pricing.engine import (
    PricingEngine,
    PricingInput,
    PricingResult,
    PREMIUM_DESIGNERS,
)


@pytest.fixture
def engine():
    return PricingEngine()


@pytest.fixture
def mock_rate():
    """Mock exchange rate to 34.5 TWD/EUR for deterministic tests."""
    with patch(
        "app.services.pricing.engine.get_eur_twd_rate", return_value=34.5
    ) as _mock:
        yield 34.5


class TestMarkupTiers:
    def test_below_500_eur(self, engine):
        assert engine._get_markup_pct(300, None) == 40.0

    def test_500_to_2000_eur(self, engine):
        assert engine._get_markup_pct(1000, None) == 30.0

    def test_2000_to_5000_eur(self, engine):
        assert engine._get_markup_pct(3000, None) == 25.0

    def test_above_5000_eur(self, engine):
        assert engine._get_markup_pct(8000, None) == 20.0

    def test_premium_designer_bonus(self, engine):
        assert engine._get_markup_pct(1000, "Hans Wegner") == 35.0

    def test_premium_designer_case_insensitive(self, engine):
        assert engine._get_markup_pct(1000, "hans wegner CH24") == 35.0

    def test_non_premium_designer(self, engine):
        assert engine._get_markup_pct(1000, "Unknown Maker") == 30.0

    def test_boundary_500(self, engine):
        assert engine._get_markup_pct(500, None) == 30.0

    def test_boundary_2000(self, engine):
        assert engine._get_markup_pct(2000, None) == 25.0

    def test_boundary_5000(self, engine):
        assert engine._get_markup_pct(5000, None) == 20.0


class TestShippingEstimate:
    def test_minimum_shipping(self, engine):
        cost = engine._estimate_shipping_eur(0.01)
        assert cost == 80.0

    def test_volume_based_shipping(self, engine):
        cost = engine._estimate_shipping_eur(1.0)
        assert cost == 250.0

    def test_large_volume(self, engine):
        cost = engine._estimate_shipping_eur(2.5)
        assert cost == 625.0


class TestPackagingEstimate:
    def test_minimum_packaging(self, engine):
        cost = engine._estimate_packaging_twd(0.01)
        assert cost == 1500.0

    def test_volume_based_packaging(self, engine):
        cost = engine._estimate_packaging_twd(1.0)
        assert cost == 5000.0


class TestFullCalculation:
    def test_basic_calculation(self, engine, mock_rate):
        result = engine.calculate(
            PricingInput(
                price_eur=1000,
                volume_cbm=0.5,
                category="tables",
            )
        )
        assert isinstance(result, PricingResult)
        assert result.original_eur == 1000
        assert result.exchange_rate == 34.5
        assert result.markup_pct == 30.0
        assert result.total_twd > 0

        # Base TWD = 1000 * 34.5 * 1.03 = 35,535
        expected_base = 1000 * 34.5 * 1.03
        assert result.base_twd == round(expected_base, 0)

        # Markup = 35,535 * 0.30 = 10,660.5
        expected_markup = expected_base * 0.30
        assert abs(result.markup_twd - round(expected_markup, 0)) <= 1

    def test_total_includes_all_components(self, engine, mock_rate):
        result = engine.calculate(
            PricingInput(price_eur=500, volume_cbm=0.3)
        )
        component_sum = (
            result.base_twd
            + result.markup_twd
            + result.international_shipping_twd
            + result.customs_duty_twd
            + result.vat_twd
            + result.insurance_twd
            + result.packaging_twd
            + result.domestic_shipping_twd
        )
        # Total is rounded up to nearest 100
        assert result.total_twd >= component_sum
        assert result.total_twd % 100 == 0

    def test_premium_designer_increases_total(self, engine, mock_rate):
        base_result = engine.calculate(
            PricingInput(price_eur=2000, volume_cbm=0.5)
        )
        premium_result = engine.calculate(
            PricingInput(price_eur=2000, volume_cbm=0.5, designer="Arne Jacobsen")
        )
        assert premium_result.markup_pct > base_result.markup_pct
        assert premium_result.total_twd > base_result.total_twd

    def test_lighting_customs_duty(self, engine, mock_rate):
        result = engine.calculate(
            PricingInput(
                price_eur=500,
                volume_cbm=0.1,
                hs_code="9405.10",
            )
        )
        assert result.customs_duty_pct == 5.0
        assert result.customs_duty_twd > 0

    def test_furniture_zero_duty(self, engine, mock_rate):
        result = engine.calculate(
            PricingInput(
                price_eur=500,
                volume_cbm=0.1,
                hs_code="9403.60",
            )
        )
        assert result.customs_duty_pct == 0.0
        assert result.customs_duty_twd == 0.0

    def test_vat_calculation(self, engine, mock_rate):
        result = engine.calculate(
            PricingInput(price_eur=1000, volume_cbm=0.5, hs_code="9403.60")
        )
        # VAT = 5% of (base + shipping + duty)
        expected_vat_base = result.base_twd + result.international_shipping_twd + result.customs_duty_twd
        expected_vat = expected_vat_base * 0.05
        assert abs(result.vat_twd - round(expected_vat, 0)) <= 1

    def test_insurance_calculation(self, engine, mock_rate):
        result = engine.calculate(
            PricingInput(price_eur=1000, volume_cbm=0.5)
        )
        expected_insurance = result.base_twd * 0.015
        assert abs(result.insurance_twd - round(expected_insurance, 0)) <= 1


class TestPremiumDesignerList:
    def test_list_not_empty(self):
        assert len(PREMIUM_DESIGNERS) > 0

    def test_known_designers_present(self):
        assert "Hans Wegner" in PREMIUM_DESIGNERS
        assert "Charles Eames" in PREMIUM_DESIGNERS
        assert "Arne Jacobsen" in PREMIUM_DESIGNERS
