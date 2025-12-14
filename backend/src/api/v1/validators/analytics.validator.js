const { query } = require('express-validator');

const frequencyValues = [
    'daily',
    'weekly',
    'monthly',
    '3m',
    'quarter',
    'half_yearly',
    'yearly',
    'ytd'
];

const commonDateFilters = [
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
        }),

    query('frequency')
        .optional({ checkFalsy: true })
        .isIn(frequencyValues)
        .withMessage(
            `Frequency must be one of: ${frequencyValues.join(', ')}`
        )
];

// 1 - Product-wise analytics validators
const getProductSalesAnalyticsValidator = [
    ...commonDateFilters,

    query('productId')
        .optional({ checkFalsy: true })
        .isMongoId()
        .withMessage('Invalid product ID'),

    query('category')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Category must be between 1 and 100 characters'),

    query('brand')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Brand must be between 1 and 100 characters')
];

// 2 - Customer-wise analytics validators
const getCustomerSalesAnalyticsValidator = [
    ...commonDateFilters,

    query('customerId')
        .optional({ checkFalsy: true })
        .isMongoId()
        .withMessage('Invalid customer ID')
];

// 3 - Order-wise analytics validators
const getOrderAnalyticsValidator = [...commonDateFilters];

module.exports = {
    getProductSalesAnalyticsValidator,
    getCustomerSalesAnalyticsValidator,
    getOrderAnalyticsValidator
};


