// ✅ Updated fileRoutes.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');
const File = require('../models/File');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + crypto.randomBytes(4).toString('hex') + path.extname(file.originalname);
    cb(null, unique);
  }
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { password, maxDownloads, expireHours } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const originalName = req.file.originalname;
    const storedName = req.file.filename;
    const mimeType = req.file.mimetype;
    const size = req.file.size;
    const filePath = path.join(uploadDir, storedName);
    const buffer = fs.readFileSync(filePath);

    const iv = crypto.randomBytes(16);
    let key, passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
      key = crypto.scryptSync(password, 'salt', 32);
    } else {
      key = crypto.randomBytes(32);
    }

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    fs.writeFileSync(filePath, encrypted);

    let expiresAt = null;
    if (expireHours) {
      const hrs = parseInt(expireHours, 10);
      if (!isNaN(hrs)) expiresAt = dayjs().add(hrs, 'hour').toDate();
    }

    let maxD = null;
    if (maxDownloads) {
      const md = parseInt(maxDownloads, 10);
      if (!isNaN(md)) maxD = md;
    }

    const fileDoc = new File({
      owner: req.user._id,
      originalName,
      storedName,
      mimeType,
      size,
      passwordHash,
      iv: iv.toString('hex'),
      maxDownloads: maxD,
      expiresAt
    });
    await fileDoc.save();

    let accessKey = null;
    if (!password) accessKey = key.toString('hex');
    res.json({ id: fileDoc._id, accessKey, originalName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/list', async (req, res) => {
  try {
    const now = new Date();
    const files = await File.find({
      owner: req.user._id,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: now } }
      ]
    }).sort({ createdAt: -1 });

    const result = files.map(f => ({
      id: f._id,
      originalName: f.originalName,
      createdAt: f.createdAt,
      downloadCount: f.downloadCount,
      maxDownloads: f.maxDownloads,
      expiresAt: f.expiresAt,
      requiresPassword: !!f.passwordHash,
      size: f.size
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const fileDoc = await File.findById(req.params.id);
    if (!fileDoc) return res.status(404).json({ error: 'File not found' });
    if (fileDoc.owner.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });

    const isExpired = fileDoc.expiresAt && dayjs().isAfter(dayjs(fileDoc.expiresAt));
    const limitReached = fileDoc.maxDownloads !== null && fileDoc.downloadCount >= fileDoc.maxDownloads;

    res.json({
      originalName: fileDoc.originalName,
      requiresPassword: !!fileDoc.passwordHash,
      expiresAt: fileDoc.expiresAt,
      maxDownloads: fileDoc.maxDownloads,
      downloadCount: fileDoc.downloadCount,
      size: fileDoc.size,
      expired: isExpired || limitReached
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/unlock/:id', async (req, res) => {
  try {
    const fileDoc = await File.findById(req.params.id);
    if (!fileDoc) return res.status(404).json({ error: 'File not found' });

    let key;
    if (fileDoc.passwordHash) {
      if (!req.body.password) return res.status(400).json({ error: 'Password required' });
      const ok = await bcrypt.compare(req.body.password, fileDoc.passwordHash);
      if (!ok) return res.status(401).json({ error: 'Invalid password' });
    } else {
      if (!req.body.accessKey) return res.status(400).json({ error: 'Access key required' });
    }

    res.json({ message: 'Access granted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/download/:id', async (req, res) => {
  try {
    const fileDoc = await File.findById(req.params.id);
    if (!fileDoc) return res.status(404).json({ error: 'File not found' });
    if (fileDoc.expiresAt && dayjs().isAfter(dayjs(fileDoc.expiresAt))) return res.status(410).json({ error: 'Link expired' });
    if (fileDoc.maxDownloads !== null && fileDoc.downloadCount >= fileDoc.maxDownloads) return res.status(410).json({ error: 'Download limit reached' });

    let key;
    if (fileDoc.passwordHash) {
      if (!req.body.password) return res.status(400).json({ error: 'Password required' });
      const ok = await bcrypt.compare(req.body.password, fileDoc.passwordHash);
      if (!ok) return res.status(401).json({ error: 'Invalid password' });
      key = crypto.scryptSync(req.body.password, 'salt', 32);
    } else {
      if (!req.body.accessKey) return res.status(400).json({ error: 'Access key required' });
      key = Buffer.from(req.body.accessKey, 'hex');
    }

    const filePath = path.join(uploadDir, fileDoc.storedName);
    const enc = fs.readFileSync(filePath);
    const iv = Buffer.from(fileDoc.iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(enc), decipher.final()]);

    fileDoc.downloadCount += 1;
    await fileDoc.save();

    res.setHeader('Content-Disposition', `attachment; filename="${fileDoc.originalName}"`);
    res.setHeader('Content-Type', fileDoc.mimeType);
    res.send(decrypted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const fileDoc = await File.findById(req.params.id);
    if (!fileDoc) return res.status(404).json({ error: 'File not found' });
    if (fileDoc.owner.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });

    const filePath = path.join(uploadDir, fileDoc.storedName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await fileDoc.deleteOne();
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
