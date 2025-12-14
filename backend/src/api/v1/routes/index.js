const express = require('express');
const router = express.Router();

// Import route modules
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const customerRoutes = require('./customer.routes');
const tenantRoutes = require('./tenant.routes');
const tenantAdminRoutes = require('./tenantAdmin.routes');
const stockRoutes = require('./stock.routes');
const supplierRoutes = require('./supplier.routes');
const analyticsRoutes = require('./analytics.routes');

// Mount routes
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/customers', customerRoutes);
router.use('/tenant', tenantRoutes);
router.use('/tenant-admin', tenantAdminRoutes);
router.use('/stocks', stockRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;

