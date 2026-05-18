const axios = require('axios');
const { 
  createPrediction, 
  getPredictionById, 
  getPredictionsByUser, 
  countPredictionsByUser, 
  deletePrediction, 
  getUserAnalytics 
} = require('../db');

// @desc Analyze news text
exports.analyze = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: 'Please provide at least 10 characters of text' });
    }

    const startTime = Date.now();
    let mlResult;

    try {
      const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, { text }, { timeout: 15000 });
      mlResult = mlResponse.data;
    } catch (mlErr) {
      console.warn('ML Service unreachable, using fallback logic');
      // Fallback simulation if ML service is offline
      const words = text.toLowerCase().split(/\s+/);
      const fakeKeywords = ['shocking', 'breaking', 'secret', 'conspiracy', 'hoax', 'unbelievable', 'miracle', 'exposed'];
      const fakeScore = words.filter(w => fakeKeywords.includes(w)).length;
      const isFake = fakeScore > 1 || text.length < 100;
      mlResult = {
        prediction: isFake ? 'FAKE' : 'REAL',
        confidence: isFake ? Math.floor(Math.random() * 20 + 75) : Math.floor(Math.random() * 20 + 78),
        keywords: words.slice(0, 5),
        model: 'Fallback (ML service offline)'
      };
    }

    const processingTime = Date.now() - startTime;

    const resDb = await createPrediction({
      user_id: req.user._id,
      news_text: text,
      prediction: mlResult.prediction,
      confidence: mlResult.confidence,
      model: mlResult.model || 'Logistic Regression',
      processing_time: processingTime,
      keywords: mlResult.keywords || [],
      sentiment: mlResult.sentiment || 'neutral',
      word_count: text.split(/\s+/).length,
    });

    const savedPrediction = await getPredictionById(resDb.id);

    res.status(201).json({
      prediction: savedPrediction.prediction,
      confidence: savedPrediction.confidence,
      model: savedPrediction.model,
      processingTime: savedPrediction.processing_time,
      keywords: JSON.parse(savedPrediction.keywords || '[]'),
      wordCount: savedPrediction.word_count,
      id: savedPrediction.id,
      timestamp: savedPrediction.created_at
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc Get user prediction history
exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = req.query.filter;
    const offset = (page - 1) * limit;

    const totalRes = await countPredictionsByUser(req.user._id, filter);
    const total = totalRes.count;
    const predictions = await getPredictionsByUser(req.user._id, limit, offset);

    // Parse keywords and remap snake_case to camelCase for each prediction
    const formattedPredictions = predictions.map(p => ({
      ...p,
      _id: p.id,
      newsText: p.news_text,
      createdAt: p.created_at,
      processingTime: p.processing_time,
      wordCount: p.word_count,
      keywords: JSON.parse(p.keywords || '[]')
    }));

    res.json({ predictions: formattedPredictions, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc Get user analytics
exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await getUserAnalytics(req.user._id);
    
    res.json({
      total: analytics.total,
      fakeCount: analytics.fakeCount,
      realCount: analytics.realCount,
      accuracy: analytics.avgConfidence.toFixed(1),
      fakePercent: analytics.total ? ((analytics.fakeCount / analytics.total) * 100).toFixed(1) : 0,
      realPercent: analytics.total ? ((analytics.realCount / analytics.total) * 100).toFixed(1) : 0,
      dailyActivity: analytics.dailyActivity
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc Delete a prediction
exports.deletePrediction = async (req, res) => {
  try {
    const prediction = await getPredictionById(req.params.id);
    if (!prediction || prediction.user_id !== req.user._id) {
      return res.status(404).json({ error: 'Prediction not found' });
    }
    await deletePrediction(req.params.id, req.user._id);
    res.json({ message: 'Prediction deleted' });
  } catch (err) {
    console.error('Delete prediction error:', err);
    res.status(500).json({ error: err.message });
  }
};
