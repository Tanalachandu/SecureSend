require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const auth = require('./auth');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', auth, fileRoutes);

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));