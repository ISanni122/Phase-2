const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 1 },
  genres: { type: Array, required: true, minLength: 1 },
  release_year: { type: Number, min: 1888 },
  overview: { type: String, maxLength: 1000, default: '' },
  budget: { type: Number, min: 0 },
  revenue: { type: Number, min: 0 },
});

movieSchema.index({ title: 'text', overview: 'text' });

const MovieModel = mongoose.model('Movie', movieSchema);

module.exports = MovieModel;