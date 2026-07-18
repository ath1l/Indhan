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

exports.simulateHistory = async (req, res) => {
  try {
    const { days = 30, startWeight = 29.5, endWeight = 17.0 } = req.body;
    const cylinder_id = req.params.id;

    const totalDrop = startWeight - endWeight;
    const dailyDrop = totalDrop / days;
    const morningDrop = dailyDrop * 0.20;
    const eveningDrop = dailyDrop * 0.80;

    const readingsToInsert = [];
    const now = new Date();
    
    let currentWeight = startWeight;
    
    for (let i = days; i >= 0; i--) {
      const baseDate = new Date(now);
      baseDate.setDate(baseDate.getDate() - i);
      baseDate.setHours(0, 0, 0, 0);

      const times = [
        { h: 0, m: 0,  drop: 0 },
        { h: 7, m: 30, drop: 0 },
        { h: 8, m: 30, drop: morningDrop },
        { h: 12, m: 0, drop: 0 },
        { h: 19, m: 30, drop: 0 },
        { h: 20, m: 30, drop: eveningDrop },
        { h: 23, m: 59, drop: 0 }
      ];

      for (let t of times) {
        const pointTime = new Date(baseDate);
        pointTime.setHours(t.h, t.m, 0, 0);
        
        if (pointTime > now) break;

        currentWeight -= t.drop;
        
        const jitter = (Math.random() - 0.5) * 0.1; // +/- 0.05kg
        let finalWeight = currentWeight + jitter;
        
        readingsToInsert.push({
          cylinder_id,
          weight_kg: parseFloat(finalWeight.toFixed(3)),
          timestamp: pointTime,
          type: 'simulation'
        });
      }
    }

    await Reading.insertMany(readingsToInsert);
    res.status(201).json({ message: "Generated realistic demo data successfully", count: readingsToInsert.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
