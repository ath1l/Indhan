const { spawn } = require('child_process');
const path = require('path');
const Cylinder = require('../models/Cylinder');
const Reading = require('../models/Reading');

const GATEWAY_SCRIPT = path.resolve(__dirname, '../../../ml-engine/gateway.py');

/**
 * Execute Python ML Gateway script
 */
const executePythonML = async (action, cylinderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Fetch cylinder and readings from DB
      const cylinder = await Cylinder.findById(cylinderId);
      if (!cylinder) {
        return reject(new Error('Cylinder not found'));
      }
      
      const readingsDb = await Reading.find({ cylinder_id: cylinderId }).sort({ timestamp: 1 });
      const readings = readingsDb.map(r => ({
        timestamp: r.timestamp.toISOString(),
        weight_kg: r.weight_kg
      }));

      const inputData = {
        cylinder_id: cylinderId,
        tare_weight_kg: cylinder.tare_weight_kg,
        capacity_kg: cylinder.capacity_kg,
        readings: readings
      };
      
      const inputString = JSON.stringify(inputData);

      // 2. Spawn python and pass data via stdin
      const pythonProcess = spawn('python', [GATEWAY_SCRIPT, action, cylinderId]);
      
      let outputData = '';
      let errorData = '';

      pythonProcess.stdin.write(inputString);
      pythonProcess.stdin.end();

      pythonProcess.stdout.on('data', (data) => {
          outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
          errorData += data.toString();
      });

      pythonProcess.on('close', (code) => {
          if (code !== 0) {
              return reject(new Error(`Python process exited with code ${code}. Error: ${errorData}`));
          }
          try {
              const result = JSON.parse(outputData);
              if (result.error) {
                  return reject(new Error(result.error));
              }
              resolve(result);
          } catch (parseErr) {
              console.error(`Failed to parse ML Gateway output [${action}]:`, parseErr);
              console.error(`Raw output: ${outputData}`);
              reject(parseErr);
          }
      });

    } catch (dbErr) {
      reject(dbErr);
    }
  });
};

const getPrediction = async (cylinderId) => {
  return executePythonML('prediction', cylinderId);
};

const getPredictionHistory = async (cylinderId) => {
  return executePythonML('history', cylinderId);
};

const getAnomalies = async (cylinderId) => {
  return executePythonML('anomalies', cylinderId);
};

const getAnomaly = async (cylinderId, anomalyId) => {
  const anomalies = await getAnomalies(cylinderId);
  return anomalies.find(a => a.id === anomalyId) || null;
};

const getUsagePatterns = async (cylinderId) => {
  return executePythonML('usage', cylinderId);
};

module.exports = {
  getPrediction,
  getPredictionHistory,
  getAnomalies,
  getAnomaly,
  getUsagePatterns
};
