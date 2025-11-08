const { body} = require('express-validator');
const checkValidation = require("../../../shared/middlewares/check-validation");


const createMovieRules = [
  body('title').exists().withMessage('title is required').isString(),
  body('genres').optional().isArray().withMessage('genres must be an array of strings'),
  body('release_year').optional().isInt({ min: 1878 }).withMessage('release_year must be a valid year'),
  body('overview').optional().isString(),
  body('budget').optional().isNumeric().withMessage('budget must be a number'),
  body('revenue').optional().isNumeric().withMessage('revenue must be a number'),
  checkValidation,
];

module.exports = createMovieRules;