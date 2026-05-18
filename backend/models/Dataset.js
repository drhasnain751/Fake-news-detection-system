const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  datasetName: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number },
  totalRecords: { type: Number, default: 0 },
  fakeCount: { type: Number, default: 0 },
  realCount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'processing', 'ready', 'error'], default: 'pending' },
  accuracy: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Dataset', datasetSchema);
