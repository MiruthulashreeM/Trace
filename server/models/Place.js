const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  category: String, // Openness, Conscientiousness, etc.
  imageUrl: String, // Optional
});

module.exports = mongoose.model('Place', placeSchema);
