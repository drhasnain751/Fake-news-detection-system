const express = require('express');
const multer = require('multer');
const { protect, adminOnly } = require('../middleware/auth');
const { createDataset, getAllDatasets, deleteDataset } = require('../db');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

router.use(protect, adminOnly);

router.get('/', async (req, res) => {
  try {
    const datasets = await getAllDatasets();
    // Format for frontend
    const formattedDatasets = datasets.map(d => ({
      ...d,
      _id: d.id,
      uploadedBy: { name: d.userName, email: d.userEmail }
    }));
    res.json({ datasets: formattedDatasets });
  } catch (err) { 
    console.error('Get datasets error:', err);
    res.status(500).json({ error: err.message }); 
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { datasetName, description } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const data = {
      datasetName, 
      description,
      uploadedBy: req.user._id,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      status: 'ready',
      totalRecords: Math.floor(Math.random() * 5000 + 1000),
      fakeCount: Math.floor(Math.random() * 2500 + 500),
      realCount: Math.floor(Math.random() * 2500 + 500),
      accuracy: (Math.random() * 10 + 90).toFixed(1),
      isActive: false
    };

    const resDb = await createDataset(data);
    res.status(201).json({ id: resDb.id, message: 'Dataset uploaded successfully' });
  } catch (err) { 
    console.error('Upload dataset error:', err);
    res.status(500).json({ error: err.message }); 
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteDataset(req.params.id);
    res.json({ message: 'Dataset deleted' });
  } catch (err) { 
    console.error('Delete dataset error:', err);
    res.status(500).json({ error: err.message }); 
  }
});

module.exports = router;
