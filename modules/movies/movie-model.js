const { readFile, writeToFile } = require("../../shared/file-utils");

const filePath = "./data/movies.json";

/**
 * Get all movies from the movies.json file.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of movies.
 */
async function getAllMovies() {
  return readFile(filePath);
}

/**
 * Get a single movie by its ID.
 * @param {number|string} movieID - The ID of the movie to retrieve.
 * @returns {Promise<Object|undefined>} - Returns the movie object if found, otherwise undefined.
 * @throws {Error} - If movieID is not provided.
 */
async function getMovieByID(movieID) {
  if (!movieID) throw new Error(`Cannot use ${movieID} to get movie`);
  const allMovies = await getAllMovies();
  const foundMovie = allMovies.find((movie) => movie.id === Number(movieID));
  return foundMovie;
}

/**
 * Add a new movie to the movies list.
 * @param {Object} newMovie - The movie object to be added.
 * @returns {Promise<Object>} - Returns the newly created movie object with an assigned ID.
 * @throws {Error} - If newMovie is not provided.
 */
async function addNewMovie(newMovie) {
  if (!newMovie) throw new Error(`Cannot use ${newMovie} to add movie`);
  const allMovies = await getAllMovies();
  newMovie = { id: allMovies.length + 1, ...newMovie };
  allMovies.push(newMovie);
  await writeToFile(filePath, allMovies);
  return newMovie;
}

/**
 * Update an existing movie by its ID.
 * @param {number} movieID - The ID of the movie to update.
 * @param {Object} newMovie - The updated movie data.
 * @returns {Promise<Object>} - Returns the updated movie object.
 * @throws {Error} - If movieID or newMovie is missing.
 * @throws {Error} - If the movie does not exist.
 */
async function updateExistingMovie(movieID, newMovie) {
  if (!movieID || !newMovie) {
    throw new Error(`Cannot use ${movieID} & ${newMovie} to update movie`);
  }
  const allMovies = await getAllMovies();
  const index = allMovies.findIndex((movie) => movie.id === Number(movieID));
  if (index < 0) throw new Error(`Movie with ID ${movieID} doesn't exist`);
  const updatedMovie = { ...allMovies[index], ...newMovie };
  allMovies[index] = updatedMovie;
  await writeToFile(filePath, allMovies);
  return updatedMovie;
}

/**
 * Delete a movie by its ID.
 * @param {number} movieID - The ID of the movie to delete.
 * @returns {Promise<Object>} - Returns the deleted movie object.
 * @throws {Error} - If movieID is missing or the movie does not exist.
 */
async function deleteMovie(movieID) {
  if (!movieID) throw new Error(`Cannot use ${movieID} to delete movie`);
  const allMovies = await getAllMovies();
  const index = allMovies.findIndex((movie) => movie.id === Number(movieID));
  if (index < 0) {
    throw new Error(`Movie with ID ${movieID} doesn't exist`, {
      cause: { status: 404 },
    });
  }
  const [deletedMovie] = allMovies.splice(index, 1);
  await writeToFile(filePath, allMovies);
  return deletedMovie;
}

module.exports = {
  getAllMovies,
  getMovieByID,
  addNewMovie,
  updateExistingMovie,
  deleteMovie,
};
