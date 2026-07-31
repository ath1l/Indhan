from __future__ import annotations

import json
import random
import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List

def simulate_weight_series(start_time: datetime | None = None, period_hours: int = 2, points: int = 150, base_weight_kg: float = 29.5, decay_rate_kg_per_day: float = 2.5) -> List[Dict[str, Any]]:
    """Generate a synthetic weight series with sawtooth refills and off-hours flatlining."""
    if start_time is None:
        start_time = datetime.now(timezone.utc) - timedelta(hours=points * period_hours)

    series: List[Dict[str, Any]] = []
    current_weight = base_weight_kg
    tare_weight = 15.3

    for index in range(points):
        timestamp = start_time + timedelta(hours=index * period_hours)
        hour = timestamp.hour
        
        # 1. Check if we need to refill (Sawtooth snap-up)
        if current_weight < (tare_weight + 0.5):
            current_weight = base_weight_kg # Instant refill!
        else:
            # 2. Check if restaurant is closed (Flat line)
            is_closed = hour >= 23 or hour < 6
            if not is_closed:
                # Burn gas during open hours
                drop_per_period = (decay_rate_kg_per_day / 17.0) * period_hours # 17 open hours
                # Add slight noise to burn rate
                drop_per_period *= random.uniform(0.8, 1.2)
                current_weight -= drop_per_period
                
        # 3. Inject Regulator Leak Anomaly at a specific index
        if index == int(points * 0.75):
            current_weight -= 8.0 # Sudden massive drop!
            
        # Ensure we don't go below tare in normal physics
        current_weight = max(current_weight, tare_weight)

        series.append({
            "timestamp": timestamp.isoformat().replace("+00:00", "Z"),
            "weight_kg": round(current_weight, 2),
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
