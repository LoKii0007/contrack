const { body, param, query } = require('express-validator');

/**
 * Validation rules for creating a supplier
 */
const createSupplierValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    body('email')
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage('Email must be valid')
        .normalizeEmail(),

    body('phone')
        .optional({ checkFalsy: true })
        .isNumeric()
        .withMessage('Phone must be a valid number')
        .isLength({ min: 10, max: 15 })
        .withMessage('Phone must be between 10 and 15 digits'),

    body('addresses')
        .optional({ checkFalsy: true })
        .isArray()
        .withMessage('Addresses must be an array'),

    body('addresses.*.streetAddress')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Street address must be between 5 and 200 characters'),

    body('addresses.*.streetAddress2')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 200 })
        .withMessage('Street address 2 must not exceed 200 characters'),

    body('addresses.*.city')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('City must be between 2 and 100 characters'),

    body('addresses.*.state')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('State must be between 2 and 100 characters'),

    body('addresses.*.postalCode')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Postal code must be between 3 and 20 characters')
];

/**
 * Validation rules for updating a supplier
 */
const updateSupplierValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid supplier ID'),

    body('name')
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    body('email')
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage('Email must be valid')
        .normalizeEmail(),

    body('phone')
        .optional({ checkFalsy: true })
        .isNumeric()
        .withMessage('Phone must be a valid number')
        .isLength({ min: 10, max: 15 })
        .withMessage('Phone must be between 10 and 15 digits'),

    body('addresses')
        .optional({ checkFalsy: true })
        .isArray()
        .withMessage('Addresses must be an array'),

    body('addresses.*.streetAddress')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Street address must be between 5 and 200 characters'),

    body('addresses.*.streetAddress2')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 200 })
        .withMessage('Street address 2 must not exceed 200 characters'),

    body('addresses.*.city')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('City must be between 2 and 100 characters'),

    body('addresses.*.state')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('State must be between 2 and 100 characters'),

    body('addresses.*.postalCode')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Postal code must be between 3 and 20 characters')
];

/**
 * Validation rules for getting a supplier by ID
 */
const getSupplierByIdValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid supplier ID')
];

/**
 * Validation rules for deleting a supplier
 */
const deleteSupplierValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid supplier ID')
];

/**
 * Validation rules for getting all suppliers with query params
 */
const getAllSuppliersValidator = [
    query('page')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional({ checkFalsy: true })
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('search')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be between 1 and 100 characters'),

    query('phone')
        .optional({ checkFalsy: true })
        .isNumeric()
        .withMessage('Phone must be a valid number'),

    query('email')
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage('Email must be valid')
];

module.exports = {
    createSupplierValidator,
    updateSupplierValidator,
    getSupplierByIdValidator,
    deleteSupplierValidator,
    getAllSuppliersValidator
};


