const { body, param, query } = require('express-validator');

/**
 * Validation rules for creating a customer
 */
const createCustomerValidator = [
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
 * Validation rules for updating a customer
 */
const updateCustomerValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid customer ID'),
    
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
 * Validation rules for getting a customer by ID
 */
const getCustomerByIdValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid customer ID')
];

/**
 * Validation rules for deleting a customer
 */
const deleteCustomerValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid customer ID')
];

/**
 * Validation rules for getting all customers with query params
 */
const getAllCustomersValidator = [
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
    
    query('email')
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage('Email must be valid'),
    
    query('phone')
        .optional({ checkFalsy: true })
        .isNumeric()
        .withMessage('Phone must be a valid number'),
    
    query('city')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('City must be between 2 and 100 characters'),
    
    query('state')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('State must be between 2 and 100 characters')
];

/**
 * Validation rules for adding an address
 */
const addAddressValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid customer ID'),
    
    body('streetAddress')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Street address must be between 5 and 200 characters'),
    
    body('streetAddress2')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 200 })
        .withMessage('Street address 2 must not exceed 200 characters'),
    
    body('city')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('City must be between 2 and 100 characters'),
    
    body('state')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('State must be between 2 and 100 characters'),
    
    body('postalCode')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Postal code must be between 3 and 20 characters')
];

/**
 * Validation rules for updating an address
 */
const updateAddressValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid customer ID'),
    
    param('addressId')
        .isMongoId()
        .withMessage('Invalid address ID'),
    
    body('streetAddress')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Street address must be between 5 and 200 characters'),
    
    body('streetAddress2')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 200 })
        .withMessage('Street address 2 must not exceed 200 characters'),
    
    body('city')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('City must be between 2 and 100 characters'),
    
    body('state')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('State must be between 2 and 100 characters'),
    
    body('postalCode')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Postal code must be between 3 and 20 characters')
];

/**
 * Validation rules for deleting an address
 */
const deleteAddressValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid customer ID'),
    
    param('addressId')
        .isMongoId()
        .withMessage('Invalid address ID')
];

/**
 * Validation rules for getting customer by email
 */
const getCustomerByEmailValidator = [
    param('email')
        .trim()
        .isEmail()
        .withMessage('Email must be valid')
        .normalizeEmail()
];

/**
 * Validation rules for getting customer by phone
 */
const getCustomerByPhoneValidator = [
    param('phone')
        .isNumeric()
        .withMessage('Phone must be a valid number')
        .isLength({ min: 10, max: 15 })
        .withMessage('Phone must be between 10 and 15 digits')
];

module.exports = {
    createCustomerValidator,
    updateCustomerValidator,
    getCustomerByIdValidator,
    deleteCustomerValidator,
    getAllCustomersValidator,
    addAddressValidator,
    updateAddressValidator,
    deleteAddressValidator,
    getCustomerByEmailValidator,
    getCustomerByPhoneValidator
};


