const express = require('express');
const router = express.Router();
const supplierController = require('../controller/supplier.controller');
const validate = require('../../../middlewares/validate');
const {
    createSupplierValidator,
    updateSupplierValidator,
    getSupplierByIdValidator,
    deleteSupplierValidator,
    getAllSuppliersValidator
} = require('../validators/supplier.validator');
const verifyToken = require('../../../middlewares/verifyToken');

router.use(verifyToken);

// CRUD operations with validation
router.post(
    '/',
    createSupplierValidator,
    validate,
    supplierController.createSupplier
);

router.get(
    '/',
    getAllSuppliersValidator,
    validate,
    supplierController.getAllSuppliers
);

router.get(
    '/:id',
    getSupplierByIdValidator,
    validate,
    supplierController.getSupplierById
);

router.put(
    '/:id',
    updateSupplierValidator,
    validate,
    supplierController.updateSupplier
);

router.delete(
    '/:id',
    deleteSupplierValidator,
    validate,
    supplierController.deleteSupplier
);

module.exports = router;


