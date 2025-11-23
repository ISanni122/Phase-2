const { body} = require('express-validator');
const checkValidation = require("../../../shared/middlewares/check-validation");

const createRatingRules = [
  body('id')
    .optional()
    .isInt({ min: 1 }).withMessage('id must be a positive integer'),
  
  body('title')
    .exists().withMessage('title is required')
    .notEmpty().withMessage('title cannot be empty')
    .isString().withMessage('title must be a string')
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('title must be between 1 and 255 characters'),
  
  body('popularity')
    .optional()
    .isFloat({ min: 0 }).withMessage('popularity must be a positive number'),
  
  body('vote_average')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('vote_average must be between 0 and 10'),
  
  body('vote_count')
    .optional()
    .isInt({ min: 0 }).withMessage('vote_count must be a positive integer'),

    checkValidation,
];

module.exports = createRatingRules;