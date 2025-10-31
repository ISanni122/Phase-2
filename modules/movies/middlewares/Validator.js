const { body, param, validationResult } = require('express-validator');

const createMovieRules = [
  body('title').exists().withMessage('title is required').isString(),
  body('genres').optional().isArray().withMessage('genres must be an array of strings'),
  body('release_year').optional().isInt({ min: 1878 }).withMessage('release_year must be a valid year'),
  body('overview').optional().isString(),
  body('budget').optional().isNumeric().withMessage('budget must be a number'),
  body('revenue').optional().isNumeric().withMessage('revenue must be a number')
];

const updateMovieRules = [
  body('title').optional().isString(),
  body('genres').optional().isArray(),
  body('release_year').optional().isInt({ min: 1878 }),
  body('overview').optional().isString(),
  body('budget').optional().isNumeric(),
  body('revenue').optional().isNumeric()
];

const idParamRule = [
  param('id').exists().withMessage('id parameter required').isString()
];

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = {
  createMovieRules,
  updateMovieRules,
  idParamRule,
  validateRequest
};
