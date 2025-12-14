const { body, param, query } = require('express-validator');

/**
 * Validation rules for creating a stock entry
 * Note: user is NOT required here; tenant is taken from auth (req.user.id)
 */
const createStockValidator = [
    body('supplier')
        .optional({ checkFalsy: true })
        .isMongoId()
        .withMessage('Invalid supplier ID'),
        
    body('products')
        .notEmpty()
        .withMessage('Products are required')
        .isArray({ min: 1 })
        .withMessage('Products must be a non-empty array'),

    body('products.*.product')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID'),

    body('products.*.quantity')
        .notEmpty()
        .withMessage('Product quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),

    body('products.*.price')
        .notEmpty()
        .withMessage('Product price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),

    body('products.*.total')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Total must be a positive number'),

    body('total')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Total must be a positive number'),

    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),

    body('phone')
        .optional({ checkFalsy: true })
        .isNumeric()
        .withMessage('Phone must be a valid number'),

    body('email')
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage('Email must be valid')
        .normalizeEmail(),

    body('paymentMethod')
        .notEmpty()
        .withMessage('Payment method is required')
        .isIn(['cash', 'other', 'online'])
        .withMessage('Payment method must be cash, other, or online'),

    body('orderStatus')
        .optional({ checkFalsy: true })
        .isIn(['pending', 'completed', 'cancelled'])
        .withMessage('Status must be pending, completed, or cancelled'),

    body('paymentStatus')
        .optional({ checkFalsy: true })
        .isIn(['pending', 'paid', 'partially_paid', 'failed'])
        .withMessage('Payment status must be pending, paid, partially_paid, or failed'),

    body('paymentHistory')
        .optional({ checkFalsy: true })
        .isArray()
        .withMessage('Payment history must be an array'),

    body('paymentHistory.*.paymentDate')
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage('Payment date must be a valid date'),

    body('paymentHistory.*.creditAmount')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Credit amount must be a positive number'),

    body('paymentHistory.*.paymentMethod')
        .optional({ checkFalsy: true })
        .isIn(['cash', 'other', 'online'])
        .withMessage('Payment method must be cash, other, or online'),

    body('paymentHistory.*.remainingAmount')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Remaining amount must be a positive number'),

    body('paymentHistory.*.receiver')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Receiver name must be between 2 and 100 characters')
];

/**
 * Validation rules for updating a stock entry
 */
const updateStockValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid stock ID'),

    body('supplier')
        .optional({ checkFalsy: true })
        .isMongoId()
        .withMessage('Invalid supplier ID'),

    body('products')
        .optional({ checkFalsy: true })
        .isArray({ min: 1 })
        .withMessage('Products must be a non-empty array'),

    body('products.*.product')
        .optional({ checkFalsy: true })
        .isMongoId()
        .withMessage('Invalid product ID'),

    body('products.*.quantity')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),

    body('products.*.price')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),

    body('products.*.total')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Total must be a positive number'),

    body('total')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Total must be a positive number'),

    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),

    body('phone')
        .optional({ checkFalsy: true })
        .isNumeric()
        .withMessage('Phone must be a valid number'),

    body('email')
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage('Email must be valid')
        .normalizeEmail(),

    body('paymentMethod')
        .optional({ checkFalsy: true })
        .isIn(['cash', 'other', 'online'])
        .withMessage('Payment method must be cash, other, or online'),

    body('orderStatus')
        .optional({ checkFalsy: true })
        .isIn(['pending', 'completed', 'cancelled'])
        .withMessage('Status must be pending, completed, or cancelled'),

    body('paymentStatus')
        .optional({ checkFalsy: true })
        .isIn(['pending', 'paid', 'partially_paid', 'failed'])
        .withMessage('Payment status must be pending, paid, partially_paid, or failed')
];

/**
 * Validation rules for getting a stock entry by ID
 */
const getStockByIdValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid stock ID')
];

/**
 * Validation rules for deleting a stock entry
 */
const deleteStockValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid stock ID')
];

/**
 * Validation rules for getting all stock entries with query params
 */
const getAllStocksValidator = [
    query('page')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional({ checkFalsy: true })
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('supplier')
        .optional({ checkFalsy: true })
        .isMongoId()
        .withMessage('Invalid supplier ID'),

    query('orderStatus')
        .optional({ checkFalsy: true })
        .isIn(['pending', 'completed', 'cancelled'])
        .withMessage('Status must be pending, completed, or cancelled'),

    query('paymentStatus')
        .optional({ checkFalsy: true })
        .isIn(['pending', 'paid', 'partially_paid', 'failed'])
        .withMessage('Payment status must be pending, paid, partially_paid, or failed'),

    query('paymentMethod')
        .optional({ checkFalsy: true })
        .isIn(['cash', 'other', 'online'])
        .withMessage('Payment method must be cash, other, or online'),

    query('minTotal')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Minimum total must be a positive number'),

    query('maxTotal')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Maximum total must be a positive number')
        .custom((value, { req }) => {
            if (req.query.minTotal && parseFloat(value) < parseFloat(req.query.minTotal)) {
                throw new Error('Maximum total must be greater than minimum total');
            }
            return true;
        })
];

module.exports = {
    createStockValidator,
    updateStockValidator,
    getStockByIdValidator,
    deleteStockValidator,
    getAllStocksValidator
};


