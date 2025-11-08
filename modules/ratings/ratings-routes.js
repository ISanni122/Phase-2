const { Router } = require("express");
const createRatingRules = require("./middlewares/createRatingRules");
const updateRatingRules = require("./middlewares/updateRatingRules");

const RatingModel = require("./ratings-model");

const ratingsRoute = Router();

// GET /ratings — get all ratings with search, sort, and pagination
ratingsRoute.get("/ratings",async (req, res) => {
  try {
    // sync indexes
    await RatingModel.syncIndexes();

    // search query
    const search = req.query.search || "";

    // count all matching documents
    const count = await RatingModel.countDocuments({
      $or: [
        { title: { $regex: search, $options: "i" } },
      ],
    });

    if (!count || count <= 0) {
      return res.send({ count: 0, page: 1, data: [] });
    }

    // sorting
    const sort_by = req.query.sort_by || "popularity";
    const sort_order = req.query.sort_order === "asc" ? 1 : -1;

    // pagination
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    // query
    const ratings = await RatingModel.find(
      {
        $or: [{ title: { $regex: search, $options: "i" } }],
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
      data: ratings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while retrieving ratings.");
  }
});

// GET /ratings/:id — get one rating by ID
ratingsRoute.get("/ratings/:id", async (req, res) => {
  try {
    const ratingID = req.params.id;
    const foundRating = await RatingModel.findById(ratingID);
    if (!foundRating) {
      return res.status(404).send(`Rating with ID ${ratingID} doesn't exist`);
    }
    res.json(foundRating);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving rating.");
  }
});

// POST /ratings — create a new rating
ratingsRoute.post("/ratings", createRatingRules, async (req, res) => {
  try {
    const newRating = req.body;
    const addedRating = await RatingModel.create({
      id: newRating.id,
      title: newRating.title,
      popularity: newRating.popularity,
      vote_average: newRating.vote_average,
      vote_count: newRating.vote_count,
    });

    if (!addedRating) {
      return res.status(500).send("Oops! Rating couldn't be added!");
    }
    res.json(addedRating);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating rating.");
  }
});

// PUT /ratings/:id — update a rating by ID
ratingsRoute.put("/ratings/:id", updateRatingRules, async (req, res) => {
  try {
    const ratingID = req.params.id;
    const newRating = req.body;

    const foundRating = await RatingModel.exists({ _id: ratingID });
    if (!foundRating) {
      return res.status(404).send(`Rating with ID ${ratingID} doesn't exist`);
    }

    const updatedRating = await RatingModel.findByIdAndUpdate(
      ratingID,
      {
        $set: {
          id: newRating.id,
          title: newRating.title,
          popularity: newRating.popularity,
          vote_average: newRating.vote_average,
          vote_count: newRating.vote_count,
        },
      },
      { new: true }
    );

    if (!updatedRating) {
      return res.status(500).send("Oops! Rating couldn't be updated!");
    }
    res.json(updatedRating);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating rating.");
  }
});

// DELETE /ratings/:id — delete a rating by ID
ratingsRoute.delete("/ratings/:id", async (req, res) => {
  try {
    const ratingID = req.params.id;
    const foundRating = await RatingModel.findById(ratingID);
    if (!foundRating) {
      return res.status(404).send(`Rating with ID ${ratingID} doesn't exist`);
    }

    const deletedRating = await RatingModel.findByIdAndDelete(ratingID, {
      new: true,
    });

    if (!deletedRating) {
      return res.status(500).send("Oops! Rating couldn't be deleted!");
    }
    res.json(deletedRating);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting rating.");
  }
});

module.exports = { ratingsRoute };