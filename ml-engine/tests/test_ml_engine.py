import os
import sys
from datetime import datetime, timedelta, timezone

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from models.depletion_regression import predict_depletion
from models.anomaly_detection import detect_anomalies
from data_generator.simulate_weight_series import simulate_weight_series


def test_predict_depletion_returns_expected_shape():
    readings = [
        {"timestamp": "2026-07-18T00:00:00Z", "weight_kg": 10.0},
        {"timestamp": "2026-07-19T00:00:00Z", "weight_kg": 8.5},
        {"timestamp": "2026-07-20T00:00:00Z", "weight_kg": 7.0},
    ]

    prediction = predict_depletion(readings, tare_weight_kg=2.0, capacity_kg=15.0)

    assert prediction["days_remaining"] > 0
    assert prediction["confidence"] >= 0
    assert prediction["confidence"] <= 1
    assert prediction["burn_rate_kg_per_day"] > 0
    assert prediction["est_empty_at"].endswith("Z")


def test_detect_anomalies_flags_spike_and_drop():
    readings = [
        {"timestamp": "2026-07-18T00:00:00Z", "weight_kg": 10.0},
        {"timestamp": "2026-07-18T01:00:00Z", "weight_kg": 10.2},
        {"timestamp": "2026-07-18T02:00:00Z", "weight_kg": 9.8},
        {"timestamp": "2026-07-18T03:00:00Z", "weight_kg": 8.3},
    ]

    anomalies = detect_anomalies(readings)
    types = {item["type"] for item in anomalies}
    assert "spike" in types or "drop" in types


def test_simulate_weight_series_produces_expected_length():
    series = simulate_weight_series(start_time=datetime(2026, 7, 18, 12, 0, tzinfo=timezone.utc), period_hours=6, points=8)
    assert len(series) == 8
    assert all("timestamp" in item and "weight_kg" in item for item in series)
