const { body, param, validationResult } = require('express-validator');

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
    .isInt({ min: 0 }).withMessage('vote_count must be a positive integer')
];

const updateRatingRules = [
  body('id')
    .optional()
    .isInt({ min: 1 }).withMessage('id must be a positive integer'),
  
  body('title')
    .optional()
    .notEmpty().withMessage('title cannot be empty if provided')
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
    .isInt({ min: 0 }).withMessage('vote_count must be a positive integer')
];

const idParamRule = [
  param('id')
    .exists().withMessage('id parameter is required')
    .isInt({ min: 1 }).withMessage('id must be a positive integer')
    .toInt()
];

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = {
    createRatingRules,
    updateRatingRules,
    idParamRule,
    validateRequest
};
