# ML Engine

This module exposes simple Python helpers for the Indhan hackathon demo:

- `models/depletion_regression.py`: predicts remaining days and an estimated empty timestamp.
- `models/anomaly_detection.py`: detects weight spikes or drops using z-score and rate-of-change heuristics.
- `models/cost_calculator.py`: provides daily and monthly cost projections.
- `data_generator/simulate_weight_series.py`: generates synthetic cylinder readings for demo data.

## Example

```python
from models.depletion_regression import predict_depletion
from models.anomaly_detection import detect_anomalies
from data_generator.simulate_weight_series import simulate_weight_series

readings = simulate_weight_series(points=8)
prediction = predict_depletion(readings, tare_weight_kg=2.0, capacity_kg=15.0)
anomalies = detect_anomalies(readings)
```
