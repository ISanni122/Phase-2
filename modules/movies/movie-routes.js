const express = require("express");
const MovieRoutes = express.Router();

const {getAllMovies, getMovieByID, addNewMovie, updateExistingMovie, deleteMovie,} = require("../movies/movie-model");
const {createMovieRules} =  require("../movies/middlewares/Validator");
const {validateRequest} = require("../movies/middlewares/Validator");
const {updateMovieRules} = require("../movies/middlewares/Validator");
const {idParamRule} = require("../movies/middlewares/Validator");

// Get all movies
MovieRoutes.get("/", async (req, res) => {
  try {
    const movies = await getAllMovies();
    res.json(movies || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get movie by id
MovieRoutes.get("/:id", async (req, res) => {
  try {
    const movieID = req.params.id;
    const movie = await getMovieByID(movieID);
    
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Movie" });
  }
});

// Add a new movie
MovieRoutes.post("/", createMovieRules, validateRequest, async (req, res) => {
  try {
    const newMovie = await addNewMovie(req.body);
    res.status(201).json({ message: "Movie added successfully", rating: newMovie });
  } catch (err) {
    res.status(500).json({ error: "Failed to add new movie" });
  }
});

// Update movie
MovieRoutes.put("/:id", idParamRule, updateExistingMovie, validateRequest, async (req, res) => {
  try {
    const movieID = parseInt(req.params.id);
    const movie = await getRatingByID(movieIDID);
      
  if (!movie) {
    return res.status(404).json({ error: "Rating not found" });
  }      
  const updatedMovie = await updateExistingMovie(movieID, req.body);
    res.json({ 
    message: "Movie updated successfully", 
    rating: updatedMovie 
    });
} catch (err) {
  console.error("Error updating movie:", err);
  res.status(500).json({ error: "Failed to update the movie" });
}});

// Delete movie
MovieRoutes.delete("/:id", async (req, res) => {
   try {
    const movieID = parseInt(req.params.id);
    const movie = await getMovieByID(movieID);
    
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    
    const deletedMovie = await deleteMovie(movieID);
    res.json({ message: "Product deleted successfully", product: deletedMovie });
  } catch (err) {
    if (err.cause?.status === 404) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.status(500).json({ error: "Failed to delete the Movie" });
  }
});


module.exports = MovieRoutes;
