const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  id: { type: Number, required: false, unique: true },
  title: { type: String, required: true, minLength: 1 },
  genre: { type: Array, required: true, minLength: 3 },
  releaseYear: { type: Number, min: 1888 },
  overview: { type: String, maxLength: 1000, default: '' },
  budget: { type: Number, min: 0 },
  revenue: { type: Number, min: 0 },
});

movieSchema.index({ title: 'text', overview: 'text' });

const MovieModel = mongoose.model('Movie', movieSchema);

module.exports = MovieModel;