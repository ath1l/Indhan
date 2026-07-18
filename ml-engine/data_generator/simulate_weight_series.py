from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List


def simulate_weight_series(start_time: datetime | None = None, period_hours: int = 6, points: int = 10, base_weight_kg: float = 12.0, decay_rate_kg_per_day: float = 0.3) -> List[Dict[str, Any]]:
    """Generate a synthetic weight series that decays over time."""
    if start_time is None:
        start_time = datetime.now(timezone.utc)

    series: List[Dict[str, Any]] = []
    for index in range(points):
        timestamp = start_time + timedelta(hours=index * period_hours)
        weight = max(base_weight_kg - (decay_rate_kg_per_day * (index * period_hours / 24.0)), 0.0)
        series.append({
            "timestamp": timestamp.isoformat().replace("+00:00", "Z"),
            "weight_kg": round(weight, 2),
        })
    return series
