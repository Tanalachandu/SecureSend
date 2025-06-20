const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const FileSchema = new mongoose.Schema({
  owner:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalName: String,
  storedName:   String,
  mimeType:     String,
  size:         Number,
  passwordHash: String,
  iv:           String,
  maxDownloads: { type: Number, default: null },
  downloadCount:{ type: Number, default: 0 },
  createdAt:    { type: Date, default: Date.now },
  expiresAt:    { type: Date, default: null }
});

// TTL index: auto-remove when expiresAt passes
FileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// After a document is removed by TTL or manually, delete file from disk
FileSchema.post('remove', function(doc) {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  const filePath = path.join(uploadDir, doc.storedName);
  fs.unlink(filePath, err => {
    if (err) console.error('Error deleting file from disk:', err);
  });
});

module.exports = mongoose.model('File', FileSchema);
