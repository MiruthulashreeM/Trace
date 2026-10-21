const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const recommendRoutes = require('./routes/recommend'); // ✅ Add this line

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use routes
app.use('/api', authRoutes);
app.use('/api/recommend', recommendRoutes); // ✅ Add this line

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trace';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected to', MONGO_URI))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
