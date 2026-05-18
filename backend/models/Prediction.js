const { createPrediction, getPredictionById, getPredictionsByUser, countPredictionsByUser, deletePrediction, getUserAnalytics } = require('../db');

module.exports = {
  create: async (data) => {
    const res = await createPrediction({
      user_id: data.userId,
      news_text: data.newsText,
      prediction: data.prediction,
      confidence: data.confidence,
      model: data.model,
      processing_time: data.processingTime,
      keywords: data.keywords,
      sentiment: data.sentiment || 'neutral',
      word_count: data.wordCount
    });
    const row = await getPredictionById(res.id);
    return { ...row, _id: row.id };
  },
  find: async (query) => {
    // This is simplified to just handle userId and sorting for getHistory
    // Real implementation should handle filters and search
    // But for now we use specific methods in controllers
    return []; 
  },
  countDocuments: async (query) => {
    return 0;
  },
  findOneAndDelete: async (query) => {
    if (query._id && query.userId) {
      const row = await getPredictionById(query._id);
      if (row && row.user_id === query.userId) {
        await deletePrediction(query._id, query.userId);
        return row;
      }
    }
    return null;
  }
};
