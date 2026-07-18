from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List


def predict_depletion(readings: List[Dict[str, Any]], tare_weight_kg: float, capacity_kg: float) -> Dict[str, Any]:
    """Estimate remaining days until the cylinder is empty.

    The model uses a simple linear regression over the latest readings to estimate
    a burn rate in kg/day, then converts that into a remaining-days prediction.
    """
    if not readings:
        raise ValueError("At least one reading is required")

    ordered = sorted(readings, key=lambda item: item["timestamp"])
    weights = [float(item["weight_kg"]) for item in ordered]
    timestamps = [datetime.fromisoformat(item["timestamp"].replace("Z", "+00:00")) for item in ordered]

    if len(weights) < 2:
        burn_rate = 0.0
        confidence = 0.4
    else:
        first_ts = timestamps[0].timestamp()
        last_ts = timestamps[-1].timestamp()
        duration_days = max((last_ts - first_ts) / 86400.0, 1e-9)
        delta_weight = weights[0] - weights[-1]
        burn_rate = max(delta_weight / duration_days, 0.01)
        confidence = min(0.99, max(0.5, 1.0 - (abs(delta_weight) / max(capacity_kg, 1.0)) * 0.2))

    usable_weight = max(capacity_kg - tare_weight_kg, 0.1)
    current_weight = max(weights[-1] - tare_weight_kg, 0.0)
    days_remaining = max(current_weight / burn_rate, 0.1) if burn_rate > 0 else 0.1

    est_empty_at = (datetime.now(timezone.utc) + timedelta(days=days_remaining)).replace(microsecond=0)
    return {
        "cylinder_id": "unknown",
        "current_weight_kg": round(weights[-1], 2),
        "days_remaining": round(days_remaining, 2),
        "est_empty_at": est_empty_at.isoformat().replace("+00:00", "Z"),
        "burn_rate_kg_per_day": round(burn_rate, 2),
        "confidence": round(confidence, 2),
    }
