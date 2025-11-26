const express = require('express');
const router = express.Router();
const tenantController = require('../controller/tenant.controller');
const validate = require('../../../middlewares/validate');
const verifyToken = require('../../../middlewares/verifyToken');
const {
    registerValidator,
    loginValidator
} = require('../validators/tenant.validator');

// Public routes
router.post(
    '/register',
    registerValidator,
    validate,
    tenantController.register
);

router.post(
    '/login',
    loginValidator,
    validate,
    tenantController.login
);

// Protected route

router.get(
    '/profile',
    verifyToken,
    tenantController.getProfile
);

module.exports = router;


