const express = require('express');
const router = express.Router();

const analyticsController = require('../controller/analytics.controller');
const validate = require('../../../middlewares/validate');
const verifyToken = require('../../../middlewares/verifyToken');

const {
    getProductSalesAnalyticsValidator,
    getCustomerSalesAnalyticsValidator,
    getOrderAnalyticsValidator
} = require('../validators/analytics.validator');

router.use(verifyToken);

// 1 - Product-wise analytics
router.get(
    '/products',
    getProductSalesAnalyticsValidator,
    validate,
    analyticsController.getProductSales
);

// 2 - Customer-wise analytics
router.get(
    '/customers',
    getCustomerSalesAnalyticsValidator,
    validate,
    analyticsController.getCustomerSales
);

// 3 - Order-wise analytics
router.get(
    '/orders',
    getOrderAnalyticsValidator,
    validate,
    analyticsController.getOrderAnalytics
);

module.exports = router;


