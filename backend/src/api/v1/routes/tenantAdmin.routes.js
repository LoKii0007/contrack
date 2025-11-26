const express = require('express');
const router = express.Router();
const tenantAdminController = require('../controller/tenantAdmin.controller');
const validate = require('../../../middlewares/validate');
const verifyToken = require('../../../middlewares/verifyToken');
const {
    createTenantAdminValidator,
    updateTenantAdminValidator,
    getTenantAdminByIdValidator,
    deleteTenantAdminValidator,
    getAllTenantAdminsValidator,
    loginValidator
} = require('../validators/tenantAdmin.validator');

// Public route
router.post(
    '/login',
    loginValidator,
    validate,
    tenantAdminController.login
);

// Protected routes
router.use(verifyToken);

// Profile route (must be before /:id to avoid conflicts)
router.get(
    '/profile',
    tenantAdminController.getProfile
);

// CRUD operations with validation
router.post(
    '/',
    createTenantAdminValidator,
    validate,
    tenantAdminController.createTenantAdmin
);

router.get(
    '/',
    getAllTenantAdminsValidator,
    validate,
    tenantAdminController.getAllTenantAdmins
);

router.get(
    '/:id',
    getTenantAdminByIdValidator,
    validate,
    tenantAdminController.getTenantAdminById
);

router.put(
    '/:id',
    updateTenantAdminValidator,
    validate,
    tenantAdminController.updateTenantAdmin
);

router.delete(
    '/:id',
    deleteTenantAdminValidator,
    validate,
    tenantAdminController.deleteTenantAdmin
);

module.exports = router;

