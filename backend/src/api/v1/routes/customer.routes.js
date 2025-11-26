const express = require('express');
const router = express.Router();
const customerController = require('../controller/customer.controller');
const validate = require('../../../middlewares/validate');
const {
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
} = require('../validators/customer.validator');
const verifyToken = require('../../../middlewares/verifyToken');

router.use(verifyToken);    

// Statistics route (must be before /:id to avoid conflicts)
router.get(
    '/statistics',
    customerController.getCustomerStatistics
);

// Lookup routes (must be before /:id to avoid conflicts)
router.get(
    '/email/:email',
    getCustomerByEmailValidator,
    validate,
    customerController.getCustomerByEmail
);

router.get(
    '/phone/:phone',
    getCustomerByPhoneValidator,
    validate,
    customerController.getCustomerByPhone
);

// CRUD operations with validation
router.post(
    '/',
    createCustomerValidator,
    validate,
    customerController.createCustomer
);

router.get(
    '/',
    getAllCustomersValidator,
    validate,
    customerController.getAllCustomers
);

router.get(
    '/:id',
    getCustomerByIdValidator,
    validate,
    customerController.getCustomerById
);

router.put(
    '/:id',
    updateCustomerValidator,
    validate,
    customerController.updateCustomer
);

router.delete(
    '/:id',
    deleteCustomerValidator,
    validate,
    customerController.deleteCustomer
);

// Address management routes
router.post(
    '/:id/addresses',
    addAddressValidator,
    validate,
    customerController.addAddress
);

router.put(
    '/:id/addresses/:addressId',
    updateAddressValidator,
    validate,
    customerController.updateAddress
);

router.delete(
    '/:id/addresses/:addressId',
    deleteAddressValidator,
    validate,
    customerController.deleteAddress
);

module.exports = router;


