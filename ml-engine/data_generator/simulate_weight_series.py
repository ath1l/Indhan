from __future__ import annotations

"""
Indhan LPG Cylinder Weight Simulation Script.
This script simulates LPG cylinder weight sensor readings over time across multiple cylinders,
incorporating normal usage, refills, and anomalous events (leaks, sensor glitches, flatlines).
It exports the telemetry data, static cylinder metadata, and ground truth anomaly logs.

Part of Team Bourbon | Hack X '26
Member A: Data Engineer (Synthetic weight-sensor generator)
"""

import datetime
from datetime import timedelta, timezone
from typing import Any, Dict, List
import random
import json
import csv
import os

# ==============================================================================
# Simulation Configuration & Constants
# ==============================================================================

# Telemetry measures Net Gas Weight (0.0 kg to 14.2 kg) to simplify depletion models.
# Cylinder shell/tare weight is stored in static metadata rather than in live telemetry.
TARE_WEIGHT_KG = 15.3       # Empty physical LPG cylinder weight (approx. 15.3 kg)
GAS_WEIGHT_FULL_KG = 14.2   # LPG net gas weight when full (domestic standard 14.2 kg)
FULL_WEIGHT_KG = TARE_WEIGHT_KG + GAS_WEIGHT_FULL_KG  # Total weight when full (~29.5 kg)

# Simulation target properties
NUM_CYLINDERS = 5           # Number of unique cylinders to simulate for the dashboard demo

# Depletion rate parameters
BURN_RATE_KG_PER_DAY = 0.25 # Baseline depletion/consumption rate of gas per day (approx. 0.25 kg/day)

# Time resolution of sensor data
READING_INTERVAL_MINUTES = 60 # Sensor reports weight reading every 60 minutes (1 hour)

# Anomaly Configuration
ANOMALY_RATE_PER_WEEK = 1.0  # Average number of anomalies per cylinder per week (168 hours)

# ==============================================================================
# Simulation Core Logic
# ==============================================================================

def simulate_step(previous_weight: float, burn_rate_per_hour: float, hours_elapsed: float) -> float:
    """
    Computes the next weight based on the previous weight, hourly burn rate, and elapsed time.
    """
    return previous_weight - (burn_rate_per_hour * hours_elapsed)

def generate_depletion_series(
    cylinder_id: str, 
    start_time: datetime.datetime, 
    num_days: int,
    base_burn_rate_kg_day: float = BURN_RATE_KG_PER_DAY
) -> tuple:
    """
    Generates simulated hourly net weight readings for a single cylinder.
    Simulates a sawtooth pattern over time with multiple depletion/refill cycles
    and randomly injected anomalies (leaks, spikes, flatlines).
    
    Returns:
        (readings_list, anomaly_log_list)
    """
    # Add per-cylinder variation: randomize burn rate by +/- 15%
    random_factor = random.uniform(0.85, 1.15)
    actual_burn_rate_kg_day = base_burn_rate_kg_day * random_factor
    burn_rate_per_hour = actual_burn_rate_kg_day / 24.0
    
    readings = []
    anomaly_log = []
    current_time = start_time
    
    # State variables for sawtooth loop
    current_weight = GAS_WEIGHT_FULL_KG
    refill_threshold = random.uniform(0.3, 0.8) # Trigger refill somewhere between 0.3kg and 0.8kg remaining
    delay_steps_left = 0
    is_empty_waiting_refill = False
    
    # Anomaly State tracking
    active_anomaly = None # Tracks active duration-based anomalies (leak, flatline)
    
    # Calculate number of simulation steps
    interval_hours = READING_INTERVAL_MINUTES / 60.0
    total_steps = int((num_days * 24.0 * 60.0) / READING_INTERVAL_MINUTES)
    
    # Calculate anomaly chance per step
    steps_per_week = (7 * 24.0 * 60.0) / READING_INTERVAL_MINUTES
    anomaly_chance_per_step = ANOMALY_RATE_PER_WEEK / steps_per_week
    
    for _ in range(total_steps):
        spike_offset = 0.0
        
        # Check if we should trigger a new anomaly (only if none is active and not waiting for a refill)
        if active_anomaly is None and not is_empty_waiting_refill:
            if random.random() < anomaly_chance_per_step:
                anomaly_type = random.choice(["leak", "spike", "flatline"])
                
                if anomaly_type == "flatline":
                    duration = random.randint(5, 20) # Stuck for 5 to 20 readings
                    active_anomaly = {
                        "type": "flatline",
                        "duration": duration,
                        "value": current_weight,
                        "start_time": current_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                        "end_time": (current_time + datetime.timedelta(minutes=READING_INTERVAL_MINUTES * (duration - 1))).strftime("%Y-%m-%dT%H:%M:%SZ")
                    }
                    anomaly_log.append({
                        "cylinder_id": cylinder_id,
                        "anomaly_type": "flatline",
                        "start_time": active_anomaly["start_time"],
                        "end_time": active_anomaly["end_time"]
                    })
                    
                elif anomaly_type == "leak":
                    duration = random.randint(1, 3) # Sudden drop over 1-3 hours
                    leak_amount = random.uniform(1.0, 2.5) # Additional leak of 1.0 - 2.5 kg
                    active_anomaly = {
                        "type": "leak",
                        "duration": duration,
                        "leak_per_step": leak_amount / duration,
                        "start_time": current_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                        "end_time": (current_time + datetime.timedelta(minutes=READING_INTERVAL_MINUTES * (duration - 1))).strftime("%Y-%m-%dT%H:%M:%SZ")
                    }
                    anomaly_log.append({
                        "cylinder_id": cylinder_id,
                        "anomaly_type": "leak",
                        "start_time": active_anomaly["start_time"],
                        "end_time": active_anomaly["end_time"]
                    })
                    
                elif anomaly_type == "spike":
                    # Spikes are instantaneous (single step) and do not persist in active_anomaly
                    spike_direction = random.choice([-1, 1])
                    spike_offset = spike_direction * random.uniform(1.5, 3.5) # Glitch by 1.5 - 3.5 kg
                    anomaly_log.append({
                        "cylinder_id": cylinder_id,
                        "anomaly_type": "spike",
                        "start_time": current_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                        "end_time": current_time.strftime("%Y-%m-%dT%H:%M:%SZ")
                    })
        
        # Add realistic sensor noise (std dev of ~0.03 kg) + active anomaly effects
        if active_anomaly and active_anomaly["type"] == "flatline":
            reported_weight_base = active_anomaly["value"]
        else:
            reported_weight_base = current_weight
            
        sensor_noise = random.gauss(0, 0.03)
        reported_weight = reported_weight_base + sensor_noise + spike_offset
        
        # Allow spikes to exceed boundaries slightly but clamp normal weights
        reported_weight = round(max(0.0, min(GAS_WEIGHT_FULL_KG + 3.0, reported_weight)), 2)
        
        # Format timestamp to ISO 8601 UTC string format
        timestamp_str = current_time.strftime("%Y-%m-%dT%H:%M:%SZ")
        
        readings.append({
            "timestamp": timestamp_str,
            "cylinder_id": cylinder_id,
            "weight_kg": reported_weight
        })
        
        # Sawtooth Logic + Physical state updates
        if is_empty_waiting_refill:
            if delay_steps_left > 0:
                delay_steps_left -= 1
            else:
                # Refill Event! Reset weight
                current_weight = GAS_WEIGHT_FULL_KG + random.gauss(0, 0.05)
                current_weight = max(GAS_WEIGHT_FULL_KG - 0.2, min(GAS_WEIGHT_FULL_KG, current_weight))
                is_empty_waiting_refill = False
                refill_threshold = random.uniform(0.3, 0.8)
        else:
            # Calculate physical depletion rate for this step
            depletion_rate = burn_rate_per_hour
            
            if active_anomaly:
                if active_anomaly["type"] == "leak":
                    depletion_rate += (active_anomaly["leak_per_step"] / interval_hours)
                elif active_anomaly["type"] == "flatline":
                    depletion_rate = 0.0 # stuck sensor
            
            current_weight = simulate_step(current_weight, depletion_rate, interval_hours)
            
            # Decrement active duration-based anomalies
            if active_anomaly:
                active_anomaly["duration"] -= 1
                if active_anomaly["duration"] <= 0:
                    active_anomaly = None
            
            # Trigger refill if depleted
            if current_weight <= refill_threshold:
                is_empty_waiting_refill = True
                delay_steps_left = random.randint(0, 6)
                current_weight = max(0.1, current_weight)
                active_anomaly = None # Clear any active anomaly if cylinder empty/refilled
                
        # Step time forward
        current_time += datetime.timedelta(minutes=READING_INTERVAL_MINUTES)
        
    return readings, anomaly_log

# ==============================================================================
# Phase 6: Multi-Cylinder Generation and Export
# ==============================================================================

def main():
    print("=== Starting Indhan Multi-Cylinder Simulation & Export ===")
    
    # 1. Setup paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, "output")
    os.makedirs(output_dir, exist_ok=True)
    
    # Define simulation time range
    # e.g., 60 days of history for a comprehensive demo
    simulation_days = 60
    start_dt = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=simulation_days)
    # Align to the start of the hour for clean telemetry timestamps
    start_dt = start_dt.replace(minute=0, second=0, microsecond=0)
    
    all_readings = []
    all_anomalies = []
    cylinder_metadata = []
    
    # 2. Iterate and generate data per cylinder
    for i in range(1, NUM_CYLINDERS + 1):
        cyl_id = f"cyl_{i:03d}"
        print(f"Simulating telemetry for {cyl_id} over {simulation_days} days...")
        
        # Generate series
        readings, anomalies = generate_depletion_series(cyl_id, start_dt, num_days=simulation_days)
        
        all_readings.extend(readings)
        all_anomalies.extend(anomalies)
        
        # Generate associated metadata for this cylinder (from Phase 2 lock)
        cylinder_metadata.append({
            "cylinder_id": cyl_id,
            "tare_weight_kg": TARE_WEIGHT_KG,
            "gas_capacity_kg": GAS_WEIGHT_FULL_KG,
            "full_weight_kg": round(FULL_WEIGHT_KG, 2),
            "user_id": f"usr_{i:03d}"
        })
        
    # 3. Sort all readings chronologically by timestamp (important for backend streaming order)
    print("Sorting all readings chronologically...")
    all_readings.sort(key=lambda x: x["timestamp"])
    
    # 4. Save metadata JSON
    metadata_path = os.path.join(output_dir, "cylinder_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(cylinder_metadata, f, indent=2)
    print(f"Exported cylinder metadata to: {metadata_path}")
    
    # 5. Save readings JSON (API schema format)
    readings_json_path = os.path.join(output_dir, "seed_readings.json")
    with open(readings_json_path, "w") as f:
        json.dump(all_readings, f, indent=2)
    print(f"Exported seed readings (JSON) to: {readings_json_path}")
    
    # 6. Save readings CSV (DB seed format)
    readings_csv_path = os.path.join(output_dir, "seed_readings.csv")
    with open(readings_csv_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["timestamp", "cylinder_id", "weight_kg"])
        writer.writeheader()
        writer.writerows(all_readings)
    print(f"Exported seed readings (CSV) to: {readings_csv_path}")
    
    # 7. Save anomaly ground truth JSON
    anomalies_path = os.path.join(output_dir, "anomaly_ground_truth.json")
    with open(anomalies_path, "w") as f:
        json.dump(all_anomalies, f, indent=2)
    print(f"Exported anomaly ground truth logs to: {anomalies_path}")
    
    # 8. Report final metrics
    print("\n=== Export Summary ===")
    print(f"Total Cylinders Monitored: {len(cylinder_metadata)}")
    print(f"Total Telemetry Readings:  {len(all_readings)}")
    print(f"Total Injected Anomalies:  {len(all_anomalies)}")
    print("Simulation complete and dataset is locked.")

# ==============================================================================
# Legacy Function for ML Engine Tests (from origin/athil)
# ==============================================================================

def simulate_weight_series(
    start_time: datetime.datetime | None = None, 
    period_hours: int = 6, 
    points: int = 10, 
    base_weight_kg: float = 12.0, 
    decay_rate_kg_per_day: float = 0.3
) -> List[Dict[str, Any]]:
    """
    Generate a simple synthetic weight series that decays over time.
    Maintained for unit test compatibility with the ML engine models.
    """
    if start_time is None:
        start_time = datetime.datetime.now(timezone.utc)

    series: List[Dict[str, Any]] = []
    for index in range(points):
        timestamp = start_time + timedelta(hours=index * period_hours)
        weight = max(base_weight_kg - (decay_rate_kg_per_day * (index * period_hours / 24.0)), 0.0)
        series.append({
            "timestamp": timestamp.isoformat().replace("+00:00", "Z"),
            "weight_kg": round(weight, 2),
        })
    return series

if __name__ == "__main__":
    main()
