const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true, minLength: 1 },
  popularity: { type: Number, min: 0 },
  vote_average: { type: Number, min: 0, max: 10 },
  vote_count: { type: Number, min: 0 },
});

const RatingModel = mongoose.model('Rating', ratingSchema);

module.exports = RatingModel;