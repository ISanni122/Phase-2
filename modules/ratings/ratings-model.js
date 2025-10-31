const path = require("path");
const fs = require("fs");
const { readFile, writeToFile } = require("../../shared/file-utils");

const filePath = "./data/rating.json";

/**
 * Get all rating from the rating.json file.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of ratings.
 */
async function getAllRatings() {
  return readFile(filePath);
}

/**
 * Get a single rating by its ID.
 * @param {number|string} ratingID - The ID of the rating to retrieve.
 * @returns {Promise<Object|undefined>} - Returns the rating object if found, otherwise undefined.
 * @throws {Error} - If ratingID is not provided.
 */
async function getRatingByID(ratingID) {
  if (!ratingID) throw new Error(`Cannot use ${ratingID} to get rating`);
  const allRatings = await getAllRatings();
  const foundRating = allRatings.find(
    (rating) => rating.id === Number(ratingID));
  return foundRating;
}

/**
 * Add a new rating to the rating list.
 * @param {Object} newRating - The rating object to be added.
 * @returns {Promise<Object>} - Returns the newly created rating object with an assigned ID.
 * @throws {Error} - If newRating is not provided.
 */
async function addNewRating(newRating) {
  if (!newRating) throw new Error(`Cannot use ${newRating} to add rating`);
  const allRatings = await getAllRatings();
  newRating = { id: allRatings.length + 1, ...newRating };
  allRatings.push(newRating);
  await writeToFile(filePath, allRatings);
  return newRating;
}

/**
 * Update an existing rating by its ID.
 * @param {number} ratingID - The ID of the rating to update.
 * @param {Object} newRating - The updated rating data.
 * @returns {Promise<Object>} - Returns the updated rating object.
 * @throws {Error} - If ratingID or newRating is missing.
 * @throws {Error} - If the rating does not exist.
 */
async function updateExistingRating(ratingID, newRating) {
  if (!ratingID || !newRating) {
    throw new Error(`Cannot use ${ratingID} & ${newRating} to update rating`);
  }
  const allRatings = await getAllRatings();
  const index = allRatings.findIndex((rating) => rating.id === Number(ratingID));
  if (index < 0) throw new Error(`Rating with ID ${ratingID} doesn't exist`);
  const updatedRating = { ...allRatings[index], ...newRating };
  allRatings[index] = updatedRating;
  await writeToFile(filePath, allRatings);
  return updatedRating;
}

/**
 * Delete a rating by its ID.
 * @param {number} ratingID - The ID of the rating to delete.
 * @returns {Promise<Object>} - Returns the deleted rating object.
 * @throws {Error} - If ratingID is missing or the rating does not exist.
 */
async function deleteRatings(ratingID) {
  if (!ratingID) throw new Error(`Cannot use ${ratingID} to delete rating`);
  const allRatings = await getAllRatings();
  const index = allRatings.findIndex((rating) => rating.id === Number(ratingID));
  if (index < 0) {
    throw new Error(`Rating with ID ${ratingID} doesn't exist`, {
      cause: { status: 404 },
    });
  }
  const [deletedRating] = allRatings.splice(index, 1);
  await writeToFile(filePath, allRatings);
  return deletedRating;
}

module.exports = {
    getAllRatings,
    getRatingByID,
    addNewRating,
    updateExistingRating,
    deleteRatings,
};
