from __future__ import annotations

from typing import Any, Dict, List


def detect_anomalies(readings: List[Dict[str, Any]], zscore_threshold: float = 2.5) -> List[Dict[str, Any]]:
    """Detect simple anomalies using z-score and rate-of-change heuristics."""
    if len(readings) < 3:
        return []

    values = [float(item["weight_kg"]) for item in readings]
    mean = sum(values) / len(values)
    variance = sum((value - mean) ** 2 for value in values) / len(values)
    std = variance ** 0.5

    anomalies: List[Dict[str, Any]] = []
    for index, item in enumerate(readings):
        if index == 0:
            continue
        prev_value = float(readings[index - 1]["weight_kg"])
        current_value = float(item["weight_kg"])
        delta = current_value - prev_value
        relative_change = abs(delta) / max(abs(prev_value), 1e-9)

        if std and abs(current_value - mean) > zscore_threshold * std:
            anomaly_type = "spike" if current_value > mean else "drop"
            if anomaly_type != "spike":
                anomalies.append({
                    "id": f"anom-{index}",
                    "type": anomaly_type,
                    "severity": "high" if relative_change > 0.15 else "medium",
                    "message": f"{anomaly_type.title()} detected in weight reading",
                    "timestamp": item["timestamp"],
                    "value": round(current_value, 2),
                })
        elif relative_change > 0.12:
            anomaly_type = "spike" if delta > 0 else "drop"
            if anomaly_type != "spike":
                anomalies.append({
                    "id": f"anom-{index}",
                    "type": anomaly_type,
                    "severity": "medium",
                    "message": f"Rapid {anomaly_type} in weight reading",
                    "timestamp": item["timestamp"],
                    "value": round(current_value, 2),
                })

    return anomalies
