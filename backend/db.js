const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dbDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'fakenews.db');
const db = new sqlite3.Database(dbPath);

const init = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users Table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        isActive INTEGER DEFAULT 1,
        theme TEXT DEFAULT 'dark',
        notifications INTEGER DEFAULT 1,
        lastLogin DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Predictions Table
      db.run(`CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        news_text TEXT NOT NULL,
        prediction TEXT NOT NULL,
        confidence REAL NOT NULL,
        model TEXT,
        processing_time INTEGER,
        keywords TEXT,
        sentiment TEXT,
        word_count INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);

      // Datasets Table
      db.run(`CREATE TABLE IF NOT EXISTS datasets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        datasetName TEXT NOT NULL,
        description TEXT,
        uploadedBy INTEGER NOT NULL,
        fileName TEXT NOT NULL,
        fileSize INTEGER,
        totalRecords INTEGER DEFAULT 0,
        fakeCount INTEGER DEFAULT 0,
        realCount INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pending',
        accuracy REAL DEFAULT 0,
        isActive INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploadedBy) REFERENCES users (id)
      )`, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
};

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) return reject(err);
    resolve({ id: this.lastID, changes: this.changes });
  });
});

const mapRow = (row) => {
  if (!row) return row;
  const mapped = { ...row };
  if (row.created_at !== undefined) mapped.createdAt = row.created_at;
  if (row.updated_at !== undefined) mapped.updatedAt = row.updated_at;
  return mapped;
};

const mapRows = (rows) => {
  if (!rows) return rows;
  return rows.map(mapRow);
};

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) return reject(err);
    resolve(mapRow(row));
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) return reject(err);
    resolve(mapRows(rows));
  });
});

// ----- User helpers -----
const getUserById = (id) => get('SELECT * FROM users WHERE id = ?', [id]);
const getUserByEmail = (email) => get('SELECT * FROM users WHERE email = ?', [email]);
const createUser = ({ name, email, password, role = 'user' }) =>
  run(
    `INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)`,
    [name, email, password, role]
  );
const updateUserLogin = (id) =>
  run('UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?', [id]);
const updateUserProfile = (id, { name, theme, notifications }) =>
  run(
    `UPDATE users SET name = ?, theme = ?, notifications = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [name, theme, notifications ? 1 : 0, id]
  );
const changeUserPassword = (id, newPassword) =>
  run('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newPassword, id]);

const getAllUsers = (limit, offset, search) => {
  let sql = 'SELECT * FROM users';
  const params = [];
  if (search) {
    sql += ' WHERE name LIKE ? OR email LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  return all(sql, params);
};

const countUsers = (search) => {
  let sql = 'SELECT COUNT(*) as count FROM users';
  const params = [];
  if (search) {
    sql += ' WHERE name LIKE ? OR email LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }
  return get(sql, params);
};

const toggleUserStatus = async (id) => {
  const user = await getUserById(id);
  if (!user) return null;
  const newStatus = user.isActive ? 0 : 1;
  await run('UPDATE users SET isActive = ? WHERE id = ?', [newStatus, id]);
  return { ...user, isActive: newStatus };
};

const deleteUser = (id) => run('DELETE FROM users WHERE id = ?', [id]);

// ----- Prediction helpers -----
const createPrediction = (pred) =>
  run(
    `INSERT INTO predictions (user_id, news_text, prediction, confidence, model, processing_time, keywords, sentiment, word_count) VALUES (?,?,?,?,?,?,?,?,?)`,
    [
      pred.user_id,
      pred.news_text,
      pred.prediction,
      pred.confidence,
      pred.model,
      pred.processing_time,
      JSON.stringify(pred.keywords),
      pred.sentiment,
      pred.word_count,
    ]
  );

const getPredictionById = (id) => get('SELECT * FROM predictions WHERE id = ?', [id]);
const getPredictionsByUser = (userId, limit, offset) =>
  all('SELECT * FROM predictions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?', [userId, limit, offset]);
const countPredictionsByUser = (userId, filter) => {
  let sql = 'SELECT COUNT(*) as count FROM predictions WHERE user_id = ?';
  const params = [userId];
  if (filter && ['FAKE', 'REAL'].includes(filter)) {
    sql += ' AND prediction = ?';
    params.push(filter);
  }
  return get(sql, params);
};
const deletePrediction = (id, userId) => run('DELETE FROM predictions WHERE id = ? AND user_id = ?', [id, userId]);

const getAllPredictionsAdmin = (limit, offset) =>
  all(
    `SELECT p.*, u.name as userName, u.email as userEmail 
     FROM predictions p 
     JOIN users u ON p.user_id = u.id 
     ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );

const countAllPredictions = () => get('SELECT COUNT(*) as count FROM predictions');

// ----- Analytics helpers -----
const getUserAnalytics = async (userId) => {
  const totalRes = await get('SELECT COUNT(*) as cnt FROM predictions WHERE user_id = ?', [userId]);
  const total = totalRes.cnt;
  const fakeRes = await get('SELECT COUNT(*) as cnt FROM predictions WHERE user_id = ? AND prediction = "FAKE"', [userId]);
  const fakeCount = fakeRes.cnt;
  const realRes = await get('SELECT COUNT(*) as cnt FROM predictions WHERE user_id = ? AND prediction = "REAL"', [userId]);
  const realCount = realRes.cnt;
  const avgRes = await get('SELECT AVG(confidence) as avg FROM predictions WHERE user_id = ?', [userId]);
  const avgConfidence = avgRes.avg || 0;
  
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const dailyActivity = await all(
    `SELECT DATE(created_at) as date, COUNT(*) as count FROM predictions WHERE user_id = ? AND created_at >= ? GROUP BY DATE(created_at) ORDER BY date`,
    [userId, sevenDaysAgo]
  );
  return { total, fakeCount, realCount, avgConfidence, dailyActivity };
};

// ----- Admin stats helpers -----
const getAdminStats = async () => {
  const totalUsers = (await get('SELECT COUNT(*) as cnt FROM users')).cnt;
  const activeUsers = (await get('SELECT COUNT(*) as cnt FROM users WHERE isActive = 1')).cnt;
  const totalPredictions = (await get('SELECT COUNT(*) as cnt FROM predictions')).cnt;
  const fakePredictions = (await get('SELECT COUNT(*) as cnt FROM predictions WHERE prediction = "FAKE"')).cnt;
  const realPredictions = (await get('SELECT COUNT(*) as cnt FROM predictions WHERE prediction = "REAL"')).cnt;
  const totalDatasets = (await get('SELECT COUNT(*) as cnt FROM datasets')).cnt;
  const recentPredictions = await all(
    `SELECT p.*, u.name as userName, u.email as userEmail 
     FROM predictions p 
     JOIN users u ON p.user_id = u.id 
     ORDER BY p.created_at DESC LIMIT 10`
  );
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const weeklyStats = await all(
    `SELECT DATE(created_at) as date, COUNT(*) as total,
      SUM(CASE WHEN prediction='FAKE' THEN 1 ELSE 0 END) as fake,
      SUM(CASE WHEN prediction='REAL' THEN 1 ELSE 0 END) as real
      FROM predictions WHERE created_at >= ? GROUP BY DATE(created_at) ORDER BY date`,
    [thirtyDaysAgo]
  );
  return { totalUsers, activeUsers, totalPredictions, fakePredictions, realPredictions, totalDatasets, recentPredictions, weeklyStats };
};

// ----- Dataset helpers -----
const createDataset = (data) =>
  run(
    `INSERT INTO datasets (datasetName, description, uploadedBy, fileName, fileSize, totalRecords, fakeCount, realCount, status, accuracy, isActive)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [data.datasetName, data.description, data.uploadedBy, data.fileName, data.fileSize, data.totalRecords, data.fakeCount, data.realCount, data.status, data.accuracy, data.isActive ? 1 : 0]
  );

const getAllDatasets = () =>
  all(
    `SELECT d.*, u.name as userName, u.email as userEmail 
     FROM datasets d 
     JOIN users u ON d.uploadedBy = u.id 
     ORDER BY d.created_at DESC`
  );

const deleteDataset = (id) => run('DELETE FROM datasets WHERE id = ?', [id]);

module.exports = {
  db,
  init,
  run,
  get,
  all,
  getUserById,
  getUserByEmail,
  createUser,
  updateUserLogin,
  updateUserProfile,
  changeUserPassword,
  getAllUsers,
  countUsers,
  toggleUserStatus,
  deleteUser,
  // prediction helpers
  createPrediction,
  getPredictionById,
  getPredictionsByUser,
  countPredictionsByUser,
  deletePrediction,
  getAllPredictionsAdmin,
  countAllPredictions,
  // analytics & admin
  getUserAnalytics,
  getAdminStats,
  // datasets
  createDataset,
  getAllDatasets,
  deleteDataset
};
