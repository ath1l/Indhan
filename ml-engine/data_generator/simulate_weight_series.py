from __future__ import annotations

import json
import random
import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List

def simulate_weight_series(start_time: datetime | None = None, period_hours: int = 6, points: int = 40, base_weight_kg: float = 29.5, decay_rate_kg_per_day: float = 0.3) -> List[Dict[str, Any]]:
    """Generate a synthetic weight series that decays over time."""
    if start_time is None:
        start_time = datetime.now(timezone.utc) - timedelta(days=points * period_hours / 24.0)

    series: List[Dict[str, Any]] = []
    for index in range(points):
        timestamp = start_time + timedelta(hours=index * period_hours)
        weight = max(base_weight_kg - (decay_rate_kg_per_day * (index * period_hours / 24.0)), 0.0)
        
        # Inject anomalies for Isolation Forest / Z-score detection
        if index in [15, 28]:
            weight += random.uniform(-1.0, 1.5)
            
        series.append({
            "timestamp": timestamp.isoformat().replace("+00:00", "Z"),
            "weight_kg": round(weight, 2),
        })
    return series

if __name__ == '__main__':
    readings = simulate_weight_series()
    
    seed_data = {
        "cylinders": [
            {
                "id": "60c72b2f9b1d8b001c8e4d3a", 
                "name": "Kitchen Main",
                "tare_weight_kg": 15.3,
                "capacity_kg": 14.2
            }
        ],
        "readings": []
    }
    
    for r in readings:
        seed_data["readings"].append({
            "cylinder_id": "60c72b2f9b1d8b001c8e4d3a",
            "timestamp": r["timestamp"],
            "weight_kg": r["weight_kg"]
        })
        
    out_path = os.path.join(os.path.dirname(__file__), 'seed_data.json')
    with open(out_path, 'w') as f:
        json.dump(seed_data, f, indent=2)
    print(f"Generated {len(readings)} readings to {out_path}")
