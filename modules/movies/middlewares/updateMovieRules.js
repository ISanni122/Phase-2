const { body} = require('express-validator');
const checkValidation = require("../../../shared/middlewares/check-validation");

const updateMovieRules = [
  body('title').optional().isString(),
  body('genres').optional().isArray(),
  body('release_year').optional().isInt({ min: 1878 }),
  body('overview').optional().isString(),
  body('budget').optional().isNumeric(),
  body('revenue').optional().isNumeric(),
  checkValidation,
];

module.exports = updateMovieRules;