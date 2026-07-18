from __future__ import annotations

from typing import Any, Dict


def calculate_cost_projection(current_weight_kg: float, burn_rate_kg_per_day: float, price_per_kg: float) -> Dict[str, Any]:
    """Estimate daily and monthly cost from the current burn rate."""
    daily_cost = burn_rate_kg_per_day * price_per_kg
    monthly_cost = daily_cost * 30
    return {
        "daily_cost": round(daily_cost, 2),
        "monthly_cost": round(monthly_cost, 2),
        "price_per_kg": round(price_per_kg, 2),
        "current_weight_kg": round(current_weight_kg, 2),
    }
