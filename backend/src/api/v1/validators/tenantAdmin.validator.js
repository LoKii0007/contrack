const { body, param, query } = require('express-validator');

/**
 * Validation rules for creating a tenant admin
 */
const createTenantAdminValidator = [
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
        .withMessage('Role must be one of: admin, manager, staff'),
    
    body('isVerified')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('isVerified must be a boolean')
];

/**
 * Validation rules for updating a tenant admin
 */
const updateTenantAdminValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid tenant admin ID'),
    
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
    
    body('password')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
    body('role')
        .optional({ checkFalsy: true })
        .isIn(['admin', 'manager', 'staff'])
        .withMessage('Role must be one of: admin, manager, staff'),
    
    body('isVerified')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('isVerified must be a boolean')
];

/**
 * Validation rules for getting a tenant admin by ID
 */
const getTenantAdminByIdValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid tenant admin ID')
];

/**
 * Validation rules for deleting a tenant admin
 */
const deleteTenantAdminValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid tenant admin ID')
];

/**
 * Validation rules for getting all tenant admins with query params
 */
const getAllTenantAdminsValidator = [
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
    
    query('role')
        .optional({ checkFalsy: true })
        .isIn(['admin', 'manager', 'staff'])
        .withMessage('Role must be one of: admin, manager, staff'),
    
    query('isVerified')
        .optional({ checkFalsy: true })
        .isBoolean()
        .withMessage('isVerified must be a boolean')
];

/**
 * Validation rules for tenant admin login
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
    createTenantAdminValidator,
    updateTenantAdminValidator,
    getTenantAdminByIdValidator,
    deleteTenantAdminValidator,
    getAllTenantAdminsValidator,
    loginValidator
};

