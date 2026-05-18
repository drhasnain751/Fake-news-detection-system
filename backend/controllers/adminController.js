const axios = require('axios');
const { 
  getAllUsers, 
  countUsers, 
  toggleUserStatus, 
  deleteUser, 
  getAdminStats, 
  getAllPredictionsAdmin, 
  countAllPredictions,
  deletePrediction
} = require('../db');

// @desc Get all users
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search;
    const offset = (page - 1) * limit;

    const totalRes = await countUsers(search);
    const total = totalRes.count;
    const users = await getAllUsers(limit, offset, search);

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Admin getUsers error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc Toggle user status
exports.toggleUser = async (req, res) => {
  try {
    const user = await toggleUserStatus(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) {
    console.error('Admin toggleUser error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc Delete user
exports.deleteUser = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    // Predictions are deleted by foreign key or manual cleanup
    // In our SQLite setup we can add a helper if needed
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Admin deleteUser error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc Get platform stats
exports.getStats = async (req, res) => {
  try {
    const stats = await getAdminStats();
    
    // Format recent predictions for frontend
    const formattedPredictions = stats.recentPredictions.map(p => ({
      ...p,
      _id: p.id,
      newsText: p.news_text,
      createdAt: p.created_at,
      userId: { id: p.user_id, name: p.userName, email: p.userEmail },
      keywords: JSON.parse(p.keywords || '[]')
    }));

    res.json({ 
      totalUsers: stats.totalUsers, 
      activeUsers: stats.activeUsers, 
      totalPredictions: stats.totalPredictions, 
      fakePredictions: stats.fakePredictions, 
      realPredictions: stats.realPredictions, 
      totalDatasets: stats.totalDatasets, 
      recentPredictions: formattedPredictions, 
      weeklyStats: stats.weeklyStats 
    });
  } catch (err) {
    console.error('Admin getStats error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc Retrain ML model
exports.retrainModel = async (req, res) => {
  try {
    const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/retrain`, {}, { timeout: 60000 });
    res.json({ message: 'Model retraining initiated', result: mlResponse.data });
  } catch (err) {
    console.error('Admin retrainModel error:', err);
    res.status(500).json({ error: 'ML service unavailable: ' + err.message });
  }
};

// @desc Get ML model status
exports.getModelStatus = async (req, res) => {
  try {
    const mlResponse = await axios.get(`${process.env.ML_SERVICE_URL}/status`, { timeout: 5000 });
    res.json(mlResponse.data);
  } catch (err) {
    res.status(200).json({ status: 'offline', message: 'ML service is not reachable' });
  }
};

// @desc Get all predictions (admin)
exports.getAllPredictions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const totalRes = await countAllPredictions();
    const total = totalRes.count;
    const predictions = await getAllPredictionsAdmin(limit, offset);

    const formattedPredictions = predictions.map(p => ({
      ...p,
      _id: p.id,
      newsText: p.news_text,
      createdAt: p.created_at,
      userId: { id: p.user_id, name: p.userName, email: p.userEmail },
      keywords: JSON.parse(p.keywords || '[]')
    }));

    res.json({ predictions: formattedPredictions, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Admin getAllPredictions error:', err);
    res.status(500).json({ error: err.message });
  }
};
