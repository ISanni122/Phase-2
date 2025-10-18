const express = require('express');
const router = express.Router();

const {
  getAllMovies,
  getMovieById,
  addNewMovie,
  updateExistingMovie,
  deleteMovie
} = require('../models/movies.model');

const {
  createMovieRules,
  updateMovieRules,
  idParamRule,
  validateRequest
} = require('../middlewares/movies.validation');

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, title, genre, release_year, sortBy } = req.query;
    const result = await getAllMovies({
      page,
      limit,
      filters: { title, genre, release_year },
      sortBy
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', idParamRule, validateRequest, async (req, res, next) => {
  try {
    const movie = await getMovieById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    next(err);
  }
});

router.post('/', createMovieRules, validateRequest, async (req, res, next) => {
  try {
    const created = await addNewMovie(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', idParamRule, updateMovieRules, validateRequest, async (req, res, next) => {
  try {
    const updated = await updateExistingMovie(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Movie not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', idParamRule, validateRequest, async (req, res, next) => {
  try {
    const deleted = await deleteMovie(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
