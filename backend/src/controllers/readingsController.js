const Reading = require('../models/Reading');

exports.addReading = async (req, res) => {
  try {
    const { weight_kg } = req.body;
    const cylinder_id = req.params.id;

    const newReading = new Reading({
      cylinder_id,
      weight_kg
    });

    const reading = await newReading.save();
    res.status(201).json(reading);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReadings = async (req, res) => {
  try {
    const { startDate, includeSimulations } = req.query;
    const cylinder_id = req.params.id;
    let query = { cylinder_id };
    
    if (startDate) {
      query.timestamp = { $gte: new Date(startDate) };
    }
    if (includeSimulations === 'false') {
      query.type = 'real';
    }

    const readings = await Reading.find(query).sort({ timestamp: -1 });
    res.status(200).json(readings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.simulateUsage = async (req, res) => {
  try {
    const { gas_consumed = 0.5, duration_minutes = 60 } = req.body;
    const cylinder_id = req.params.id;

    const latestReading = await Reading.findOne({ cylinder_id }).sort({ timestamp: -1 });
    
    if (!latestReading) {
      return res.status(400).json({ message: "Cylinder must be initialized first." });
    }

    const startWeight = latestReading.weight_kg;
    const endWeight = Math.max(0, startWeight - parseFloat(gas_consumed));
    const now = new Date();
    
    const numPoints = 10;
    const timeStepMs = (duration_minutes * 60 * 1000) / numPoints;
    const weightStep = (startWeight - endWeight) / numPoints;

    const readingsToInsert = [];
    
    for (let i = 1; i <= numPoints; i++) {
      const pointTime = new Date(now.getTime() - (numPoints - i) * timeStepMs);
      let pointWeight = startWeight - (weightStep * i);
      
      const jitter = (Math.random() - 0.5) * 0.01;
      
      if (i === numPoints) {
        pointWeight = endWeight;
      } else {
        pointWeight += jitter;
      }
      
      readingsToInsert.push({
        cylinder_id,
        weight_kg: parseFloat(pointWeight.toFixed(3)),
        timestamp: pointTime,
        type: 'simulation'
      });
    }

    await Reading.insertMany(readingsToInsert);
    res.status(201).json({ message: "Simulation successful", count: numPoints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
