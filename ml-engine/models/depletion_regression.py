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
        projected_burn_rate = 0.0
        instantaneous_burn_rate = 0.0
        confidence = 0.4
    else:
        last_ts = timestamps[-1].timestamp()
        
        # 1. 7-Day Sliding Window for Stable Projections
        window_start = last_ts - (7 * 86400)
        recent_indices = [i for i, ts in enumerate(timestamps) if ts.timestamp() >= window_start]
        
        first_idx = recent_indices[0] if len(recent_indices) >= 2 else 0
        proj_first_ts = timestamps[first_idx].timestamp()
        
        # Implement a Time Floor (Minimum Denominator) of 1 hour
        proj_duration_days = max((last_ts - proj_first_ts) / 86400.0, 1.0 / 24.0)
        proj_delta_weight = weights[first_idx] - weights[-1]
        
        # Smoothing Logic (ignore sensor jitter)
        if abs(proj_delta_weight) < 0.05:
            proj_delta_weight = 0.0
            
        projected_burn_rate = max(proj_delta_weight / proj_duration_days, 0.01)
        
        # Implement a Physical Sanity Ceiling
        MAX_BURN_RATE = 50.0
        projected_burn_rate = min(projected_burn_rate, MAX_BURN_RATE)
            
        # 2. Instantaneous Burn Rate for Anomaly Tracking
        inst_first_ts = timestamps[-2].timestamp()
        
        # Implement a Time Floor (Minimum Denominator) of 1 hour
        inst_duration_days = max((last_ts - inst_first_ts) / 86400.0, 1.0 / 24.0)
        inst_delta_weight = weights[-2] - weights[-1]
        
        # Smoothing Logic (ignore sensor jitter)
        if abs(inst_delta_weight) < 0.05:
            inst_delta_weight = 0.0
            
        instantaneous_burn_rate = max(inst_delta_weight / inst_duration_days, 0.01)
        
        # Implement a Physical Sanity Ceiling
        instantaneous_burn_rate = min(instantaneous_burn_rate, MAX_BURN_RATE)

        confidence = min(0.99, max(0.5, 1.0 - (abs(proj_delta_weight) / max(capacity_kg, 1.0)) * 0.2))

    usable_weight = max(capacity_kg - tare_weight_kg, 0.1)
    current_weight = max(weights[-1] - tare_weight_kg, 0.0)
    days_remaining = max(current_weight / projected_burn_rate, 0.1) if projected_burn_rate > 0 else 0.1

    est_empty_at = (datetime.now(timezone.utc) + timedelta(days=days_remaining)).replace(microsecond=0)
    return {
        "cylinder_id": "unknown",
        "current_weight_kg": round(weights[-1], 2),
        "days_remaining": round(days_remaining, 2),
        "est_empty_at": est_empty_at.isoformat().replace("+00:00", "Z"),
        "burn_rate_kg_per_day": round(projected_burn_rate, 2),
        "rolling_avg_burn_rate": round(projected_burn_rate if projected_burn_rate >= 0.001 else 0.0, 2),
        "instantaneous_burn_rate": round(instantaneous_burn_rate, 2),
        "confidence": round(confidence, 2),
    }
