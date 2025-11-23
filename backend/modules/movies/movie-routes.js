const {Router} = require('express');
const createMovieRules = require('./middlewares/createMovieRules');
const updateMovieRules = require('./middlewares/updateMovieRules');

const MovieModel = require('./movie-model');

const moviesRoute = Router();

moviesRoute.get("/movies", async (req, res) => {
  try {
    await MovieModel.syncIndexes();

    const search = req.query.search || "";

    const count = await MovieModel.countDocuments({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { overview: { $regex: search, $options: "i" } },
      ],
    });

    if (!count || count <= 0) {
      return res.send({ count: 0, page: 1, data: [] });
    }

    // sorting
    const sort_by = req.query.sort_by || "release_year";
    const sort_order = req.query.sort_order === "asc" ? 1 : -1;

    // pagination
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const movies = await MovieModel.find(
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { overview: { $regex: search, $options: "i" } },
        ],
      },
      {},
      {
        limit,
        skip: (page - 1) * limit,
        sort: { [sort_by]: sort_order },
      }
    );

    res.json({
      count,
      page,
      limit,
      data: movies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while retrieving movies.");
  }
});

// GET /movies/:id — get a movie by ID
moviesRoute.get("/movies/:id", async (req, res) => {
  try {
    const movieID = req.params.id;
    const foundMovie = await MovieModel.findById(movieID);
    if (!foundMovie) {
      return res.status(404).send(`Movie with ID ${movieID} doesn't exist`);
    }
    res.json(foundMovie);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving movie.");
  }
});

// POST /movies — create a new movie
moviesRoute.post("/movies", createMovieRules, async (req, res) => {
  try {
    const newMovie = req.body;
    // normalize genres into an array
    const genres = Array.isArray(newMovie.genres)
      ? newMovie.genres
      : typeof newMovie.genres === 'string'
      ? newMovie.genres.split(',').map(s => s.trim()).filter(Boolean)
      : newMovie.genres
      ? [newMovie.genres]
      : [];

    // accept either release_year (preferred) or legacy releaseYear
    const releaseYear = newMovie.release_year ?? newMovie.releaseYear;

    const addedMovie = await MovieModel.create({
      title: newMovie.title,
      genres,
      release_year: releaseYear,
      overview: newMovie.overview,
      budget: newMovie.budget,
      revenue: newMovie.revenue,
    });

    if (!addedMovie) {
      return res.status(500).send("Oops! Movie couldn't be added!");
    }
    res.json(addedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating movie.");
  }
});

// PUT /movies/:id — update a movie by ID
moviesRoute.put("/movies/:id", updateMovieRules, async (req, res) => {
  try {
    const movieID = req.params.id;
    const newMovie = req.body;

    const foundMovie = await MovieModel.exists({ _id: movieID });
    if (!foundMovie) {
      return res.status(404).send(`Movie with ID ${movieID} doesn't exist`);
    }

    // normalize genres and release year similar to create
    const genres = Array.isArray(newMovie.genres)
      ? newMovie.genres
      : typeof newMovie.genres === 'string'
      ? newMovie.genres.split(',').map(s => s.trim()).filter(Boolean)
      : newMovie.genres
      ? [newMovie.genres]
      : undefined;

    const releaseYear = newMovie.release_year ?? newMovie.releaseYear;

    const updatedMovie = await MovieModel.findByIdAndUpdate(
      movieID,
      {
        $set: {
          title: newMovie.title,
          ...(typeof genres !== 'undefined' ? { genres } : {}),
          ...(typeof releaseYear !== 'undefined' ? { release_year: releaseYear } : {}),
          overview: newMovie.overview,
          budget: newMovie.budget,
          revenue: newMovie.revenue,
        },
      },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(500).send("Oops! Movie couldn't be updated!");
    }
    res.json(updatedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating movie.");
  }
});

// DELETE /movies/:id — delete a movie by ID
moviesRoute.delete("/movies/:id", async (req, res) => {
  try {
    const movieID = req.params.id;
    const foundMovie = await MovieModel.findById(movieID);
    if (!foundMovie) {
      return res.status(404).send(`Movie with ID ${movieID} doesn't exist`);
    }

    const deletedMovie = await MovieModel.findByIdAndDelete(movieID, {
      new: true,
    });

    if (!deletedMovie) {
      return res.status(500).send("Oops! Movie couldn't be deleted!");
    }
    res.json(deletedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting movie.");
  }
});

module.exports = { moviesRoute };