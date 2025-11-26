const { body } = require('express-validator');

/**
 * Validation rules for tenant registration
 */
const registerValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be valid')
        .normalizeEmail(),
    
    body('phone')
        .notEmpty()
        .withMessage('Phone is required')
        .isNumeric()
        .withMessage('Phone must be a valid number')
        .isLength({ min: 10, max: 15 })
        .withMessage('Phone must be between 10 and 15 digits'),
    
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
    body('role')
        .optional({ checkFalsy: true })
        .isIn(['admin', 'manager', 'staff'])
        .withMessage('Role must be one of: admin, manager, staff')
];

/**
 * Validation rules for tenant login
 */
const loginValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be valid')
        .normalizeEmail(),
    
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
];

module.exports = {
    registerValidator,
    loginValidator
};


