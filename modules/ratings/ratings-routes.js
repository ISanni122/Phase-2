const express = require("express");
const RatingRoutes = express.Router();

const {getAllRatings, getRatingByID, addNewRating, updateExistingRating, deleteRatings,} = require("../ratings/ratings-model");
const {createRatingRules} =  require("../ratings/middlewares/Validator");
const {validateRequest} = require("../ratings/middlewares/Validator");
const {updateRatingRules} = require("../ratings/middlewares/Validator");
const {idParamRule} = require("../ratings/middlewares/Validator");


// Routes

// Get all ratings
RatingRoutes.get("/", async (req, res) => {
  try {
    const ratings = await getAllRatings();
    res.json(ratings || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get rating by id
RatingRoutes.get("/:id", async (req, res) => {
  try {
    const ratingID = req.params.id;
    const rating = await getRatingByID(ratingID);
    
    if (!rating) {
      return res.status(404).json({ error: "Rating not found" });
    }
    
    res.json(rating);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Rating" });
  }
});

// Add a new rating
RatingRoutes.post("/", createRatingRules, validateRequest, async (req, res) => {
  try {
    const newRating = await addNewRating(req.body);
    res.status(201).json({ message: "Rating added successfully", rating: newRating });
  } catch (err) {
    res.status(500).json({ error: "Failed to add new rating" });
  }
});

// Update rating
RatingRoutes.put("/:id", idParamRule, updateRatingRules, validateRequest, async (req, res) => {
  try {
    const ratingID = parseInt(req.params.id);
    const rating = await getRatingByID(ratingID);
      
  if (!rating) {
    return res.status(404).json({ error: "Rating not found" });
  }      
  const updatedRating = await updateExistingRating(ratingID, req.body);
    res.json({ 
    message: "Rating updated successfully", 
    rating: updatedRating 
    });
} catch (err) {
  console.error("Error updating rating:", err);
  res.status(500).json({ error: "Failed to update the rating" });
}});

// Delete rating
RatingRoutes.delete("/:id", async (req, res) => {
   try {
    const ratingID = parseInt(req.params.id);
    const rating = await getRatingByID(ratingID);
    
    if (!rating) {
      return res.status(404).json({ error: "Rating not found" });
    }
    
    const deletedRating = await deleteRatings(ratingID);
    res.json({ message: "Product deleted successfully", product: deletedRating });
  } catch (err) {
    if (err.cause?.status === 404) {
      return res.status(404).json({ error: "Rating not found" });
    }
    res.status(500).json({ error: "Failed to delete the Rating" });
  }
});


module.exports = RatingRoutes;
