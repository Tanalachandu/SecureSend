const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  owner:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalName: String,
  storedName:   String,
  mimeType:     String,
  size:         Number,
  passwordHash: String,
  iv:           String,
  encryptedData: { type: String, required: true }, // ✅ New field for base64-encoded encrypted file
  maxDownloads: { type: Number, default: null },
  downloadCount:{ type: Number, default: 0 },
  createdAt:    { type: Date, default: Date.now },
  expiresAt:    { type: Date, default: null }
});

// TTL index for automatic cleanup
FileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('File', FileSchema);
