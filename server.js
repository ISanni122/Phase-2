const express = require("express");
const app = express();
const path = require("path");
const PORT = 5000;
const fs = require("fs");

app.use(express.json());

const filePath = path.join(__dirname, "data", "movies.json");
let movies = [];

try {
  const data = fs.readFileSync(filePath, "utf8");
  movies = JSON.parse(data);
  console.log(`✅ Loaded ${movies.length} movies from dataset`);
} catch (err) {
  console.error("Failed to load movies.json:", err);
}

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Movie Explorer API 🎬");
});

// Get all movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// Get movie by id
app.get("/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  movie ? res.json(movie) : res.status(404).json({ msg: "Movie not found" });
});

// Add a new movie
app.post("/movies", (req, res) => {
  const newMovie = { id: movies.length + 1, ...req.body };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// Update movie
app.put("/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).json({ msg: "Movie not found" });

  Object.assign(movie, req.body);
  res.json(movie);
});

// Delete movie
app.delete("/movies/:id", (req, res) => {
  movies = movies.filter((m) => m.id !== parseInt(req.params.id));
  res.json({ msg: "Movie deleted" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
