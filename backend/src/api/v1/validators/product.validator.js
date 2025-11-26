const { body, param, query } = require('express-validator');

/**
 * Validation rules for creating a product
 */
const createProductValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be between 2 and 100 characters'),
    
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    
    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),
    
    body('image')
        .optional({ checkFalsy: true })
        .trim()
        .isURL()
        .withMessage('Image must be a valid URL'),
    
    body('category')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Category must be between 2 and 50 characters'),
    
    body('brand')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Brand must be between 2 and 50 characters'),
    
    body('weight')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Weight must be a positive number')
];

/**
 * Validation rules for updating a product
 */
const updateProductValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid product ID'),
    
    body('name')
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty()
        .withMessage('Product name cannot be empty')
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be between 2 and 100 characters'),
    
    body('price')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    
    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),
    
    body('image')
        .optional({ checkFalsy: true })
        .trim()
        .isURL()
        .withMessage('Image must be a valid URL'),
    
    body('category')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Category must be between 2 and 50 characters'),
    
    body('brand')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Brand must be between 2 and 50 characters'),
    
    body('weight')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Weight must be a positive number')
];

/**
 * Validation rules for getting a product by ID
 */
const getProductByIdValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid product ID')
];

/**
 * Validation rules for deleting a product
 */
const deleteProductValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid product ID')
];

/**
 * Validation rules for getting all products with query params
 */
const getAllProductsValidator = [
    query('page')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional({ checkFalsy: true })
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    query('category')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Category must be between 2 and 50 characters'),
    
    query('brand')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Brand must be between 2 and 50 characters'),
    
    query('minPrice')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be a positive number'),
    
    query('maxPrice')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be a positive number')
        .custom((value, { req }) => {
            if (req.query.minPrice && parseFloat(value) < parseFloat(req.query.minPrice)) {
                throw new Error('Maximum price must be greater than minimum price');
            }
            return true;
        }),
    
    query('search')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be between 1 and 100 characters')
];

module.exports = {
    createProductValidator,
    updateProductValidator,
    getProductByIdValidator,
    deleteProductValidator,
    getAllProductsValidator
};

