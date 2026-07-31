import sys
import json
import os

# Ensure Python can import from models/ directory
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from models.depletion_regression import predict_depletion
from models.anomaly_detection import detect_anomalies
from models.cost_calculator import calculate_cost_projection

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing arguments"}))
        return

    action = sys.argv[1]
    cylinder_id = sys.argv[2]
    
    try:
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"error": "Missing stdin data"}))
            return
            
        data = json.loads(input_data)
        readings = data.get("readings", [])
        tare_weight_kg = float(data.get("tare_weight_kg", 15.0))
        capacity_kg = float(data.get("capacity_kg", 14.2))
        
        if action == "prediction":
            if not readings:
                print(json.dumps({"error": "No readings provided"}))
                return
            result = predict_depletion(readings, tare_weight_kg, capacity_kg)
            result["cylinder_id"] = cylinder_id
            print(json.dumps(result))
            
        elif action == "history":
            # Generate history by running the model on incremental slices of readings
            history = []
            if len(readings) >= 1:
                # Add at least the last reading if there's only 1 or 2
                for i in range(1, len(readings) + 1):
                    slice_readings = readings[:i]
                    pred = predict_depletion(slice_readings, tare_weight_kg, capacity_kg)
                    history.append({
                        "date": slice_readings[-1]["timestamp"],
                        "weight_kg": slice_readings[-1]["weight_kg"],
                        "days_remaining": pred["days_remaining"],
                        "burn_rate_kg_per_day": pred["burn_rate_kg_per_day"]
                    })
                
                # Inject a bridge point for Recharts
                history[-1]["projected_weight_kg"] = history[-1]["weight_kg"]
                
                # Append future projection point
                final_pred = predict_depletion(readings, tare_weight_kg, capacity_kg)
                if final_pred["days_remaining"] > 0:
                    history.append({
                        "date": final_pred["est_empty_at"],
                        "weight_kg": None,
                        "projected_weight_kg": tare_weight_kg,
                        "days_remaining": 0,
                        "burn_rate_kg_per_day": final_pred["burn_rate_kg_per_day"]
                    })
            print(json.dumps(history))
            
        elif action == "anomalies":
            result = detect_anomalies(readings)
            for r in result:
                r["cylinder_id"] = cylinder_id
                r["acknowledged"] = False
            print(json.dumps(result))
            
        elif action == "usage":
            print(json.dumps({
                "peak_hours": ["07:00", "08:00", "19:00", "20:00"],
                "baseline_burn_rate_kg_per_day": 0.2
            }))
            
        else:
            print(json.dumps({"error": "Unknown action"}))
            
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
