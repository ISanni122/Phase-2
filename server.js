const express = require("express");
const server = express();
const port = 5000; 
const hostname = "localhost";

const MovieRoutes = require("./modules/movies/movie-routes");
const RatingRoutes = require("./modules/ratings/ratings-routes");

server.use(express.json());

// Add route prefixes to avoid conflicts
server.use("/movies",MovieRoutes);
server.use("/rating",RatingRoutes);

// Basic health check route
server.get("/", (req, res) => {
  res.send("Welcome to Movie Explorer Server");
});

// Error handling middleware
server.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// 404 handler
server.use((req, res, next) => {
  res.status(404).json({ error: `404! ${req.method} ${req.path} Not Found.` });
});

server.listen(port, hostname, (error) => {
  if (error) console.log(error.message);
  else console.log(`Server running on http://${hostname}:${port}`);
});