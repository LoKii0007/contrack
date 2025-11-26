const express = require('express');
const router = express.Router();

// Import route modules
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const customerRoutes = require('./customer.routes');
const tenantRoutes = require('./tenant.routes');
const tenantAdminRoutes = require('./tenantAdmin.routes');

// Mount routes
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/customers', customerRoutes);
router.use('/tenant', tenantRoutes);
router.use('/tenant-admin', tenantAdminRoutes);

module.exports = router;

