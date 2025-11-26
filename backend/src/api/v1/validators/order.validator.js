const { body, param, query } = require('express-validator');

/**
 * Validation rules for creating an order
 */
const createOrderValidator = [
    body('customer')
        .notEmpty()
        .withMessage('Customer ID is required')
        // .isMongoId()
        .withMessage('Invalid customer ID'),
    
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
        .notEmpty()
        .withMessage('Product total is required')
        .isFloat({ min: 0 })
        .withMessage('Total must be a positive number'),
    
    body('total')
        .notEmpty()
        .withMessage('Total is required')
        .isFloat({ min: 0 })
        .withMessage('Total must be a positive number'),
    
    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),
    
    body('shippingAddress')
        .optional({ checkFalsy: true })
        .isObject()
        .withMessage('Shipping address must be an object'),
    
    body('shippingAddress.streetAddress')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Street address must be between 5 and 200 characters'),
    
    body('shippingAddress.streetAddress2')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 200 })
        .withMessage('Street address 2 must not exceed 200 characters'),
    
    body('shippingAddress.city')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('City must be between 2 and 100 characters'),
    
    body('shippingAddress.state')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('State must be between 2 and 100 characters'),
    
    body('shippingAddress.postalCode')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Postal code must be between 3 and 20 characters'),
    
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
    
    body('hasInvoice')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('hasInvoice must be a boolean'),
    
    body('paymentMethod')
        .notEmpty()
        .withMessage('Payment method is required')
        .isIn(['cash', 'other', 'online'])
        .withMessage('Payment method must be cash, other, or online'),
    
    body('orderStatus')
        .optional({ checkFalsy: true })
        .isIn(['pending', 'completed', 'cancelled'])
        .withMessage('Order status must be pending, completed, or cancelled'),
    
    body('paymentStatus')
        .optional({ checkFalsy: true })
        .isIn(['pending', 'paid', 'partially_paid', 'failed'])
        .withMessage('Payment status must be pending, paid, partially_paid, or failed'),
    
    body('hasGST')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('hasGST must be a boolean'),
    
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
 * Validation rules for updating an order
 */
const updateOrderValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid order ID'),
    
    body('customer')
        .optional({ checkFalsy: true })
        .isMongoId()
        .withMessage('Invalid customer ID'),
    
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
    
    body('shippingAddress')
        .optional({ checkFalsy: true })
        .isObject()
        .withMessage('Shipping address must be an object'),
    
    body('shippingAddress.streetAddress')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Street address must be between 5 and 200 characters'),
    
    body('shippingAddress.streetAddress2')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 200 })
        .withMessage('Street address 2 must not exceed 200 characters'),
    
    body('shippingAddress.city')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('City must be between 2 and 100 characters'),
    
    body('shippingAddress.state')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('State must be between 2 and 100 characters'),
    
    body('shippingAddress.postalCode')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Postal code must be between 3 and 20 characters'),
    
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
    
    body('hasInvoice')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('hasInvoice must be a boolean'),
    
    body('paymentMethod')
        .optional({ checkFalsy: true })
        .isIn(['cash', 'other', 'online'])
        .withMessage('Payment method must be cash, other, or online'),
    
    body('orderStatus')
        .optional({ checkFalsy: true })
        .isIn(['pending', 'completed', 'cancelled'])
        .withMessage('Order status must be pending, completed, or cancelled'),
    
    body('paymentStatus')
        .optional({ checkFalsy: true })
        .isIn(['pending', 'paid', 'partially_paid', 'failed'])
        .withMessage('Payment status must be pending, paid, partially_paid, or failed'),
    
    body('hasGST')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('hasGST must be a boolean')
];

/**
 * Validation rules for getting an order by ID
 */
const getOrderByIdValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid order ID')
];

/**
 * Validation rules for deleting an order
 */
const deleteOrderValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid order ID')
];

/**
 * Validation rules for getting all orders with query params
 */
const getAllOrdersValidator = [
    query('page')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional({ checkFalsy: true })
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    query('customer')
        .optional({ checkFalsy: true })
        .isMongoId()
        .withMessage('Invalid customer ID'),
    
    query('orderStatus')
        .optional({ checkFalsy: true })
        .isIn(['pending', 'completed', 'cancelled'])
        .withMessage('Order status must be pending, completed, or cancelled'),
    
    query('paymentStatus')
        .optional({ checkFalsy: true })
        .isIn(['pending', 'paid', 'partially_paid', 'failed'])
        .withMessage('Payment status must be pending, paid, partially_paid, or failed'),
    
    query('paymentMethod')
        .optional({ checkFalsy: true })
        .isIn(['cash', 'other', 'online'])
        .withMessage('Payment method must be cash, other, or online'),
    
    query('hasInvoice')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('hasInvoice must be a boolean'),
    
    query('hasGST')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('hasGST must be a boolean'),
    
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
        }),
    
    query('search')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be between 1 and 100 characters')
];

/**
 * Validation rules for adding payment
 */
const addPaymentValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid order ID'),
    
    body('paymentDate')
        .notEmpty()
        .withMessage('Payment date is required')
        .isISO8601()
        .withMessage('Payment date must be a valid date'),
    
    body('creditAmount')
        .notEmpty()
        .withMessage('Credit amount is required')
        .isFloat({ min: 0 })
        .withMessage('Credit amount must be a positive number'),
    
    body('paymentMethod')
        .notEmpty()
        .withMessage('Payment method is required')
        .isIn(['cash', 'other', 'online'])
        .withMessage('Payment method must be cash, other, or online'),
    
    body('remainingAmount')
        .notEmpty()
        .withMessage('Remaining amount is required')
        .isFloat({ min: 0 })
        .withMessage('Remaining amount must be a positive number'),
    
    body('receiver')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Receiver name must be between 2 and 100 characters')
];

/**
 * Validation rules for updating order status
 */
const updateOrderStatusValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid order ID'),
    
    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['pending', 'completed', 'cancelled'])
        .withMessage('Status must be pending, completed, or cancelled')
];

/**
 * Validation rules for getting orders by customer
 */
const getOrdersByCustomerValidator = [
    param('customerId')
        .isMongoId()
        .withMessage('Invalid customer ID'),
    
    query('page')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional({ checkFalsy: true })
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
];

/**
 * Validation rules for getting order statistics
 */
const getOrderStatisticsValidator = [
    query('startDate')
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    
    query('endDate')
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((value, { req }) => {
            if (req.query.startDate && new Date(value) < new Date(req.query.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        })
];

module.exports = {
    createOrderValidator,
    updateOrderValidator,
    getOrderByIdValidator,
    deleteOrderValidator,
    getAllOrdersValidator,
    addPaymentValidator,
    updateOrderStatusValidator,
    getOrdersByCustomerValidator,
    getOrderStatisticsValidator
};

