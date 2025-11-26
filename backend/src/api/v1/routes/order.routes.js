const express = require('express');
const router = express.Router();
const orderController = require('../controller/orders.conrtoller');
const validate = require('../../../middlewares/validate');
const {
    createOrderValidator,
    updateOrderValidator,
    getOrderByIdValidator,
    deleteOrderValidator,
    getAllOrdersValidator,
    addPaymentValidator,
    updateOrderStatusValidator,
    getOrdersByCustomerValidator,
    getOrderStatisticsValidator
} = require('../validators/order.validator');
const verifyToken = require('../../../middlewares/verifyToken');

router.use(verifyToken);


// CRUD operations with validation
router.post(
    '/',
    createOrderValidator,
    validate,
    orderController.createOrder
);

router.get(
    '/',
    getAllOrdersValidator,
    validate,
    orderController.getAllOrders
);

router.get(
    '/:id',
    getOrderByIdValidator,
    validate,
    orderController.getOrderById
);

router.put(
    '/:id',
    updateOrderValidator,
    validate,
    orderController.updateOrder
);

router.delete(
    '/:id',
    deleteOrderValidator,
    validate,
    orderController.deleteOrder
);

// Additional order-specific routes
router.post(
    '/:id/payment',
    addPaymentValidator,
    validate,
    orderController.addPayment
);

router.patch(
    '/:id/status',
    updateOrderStatusValidator,
    validate,
    orderController.updateOrderStatus
);

router.get(
    '/customer/:customerId',
    getOrdersByCustomerValidator,
    validate,
    orderController.getOrdersByCustomer
);

module.exports = router;

