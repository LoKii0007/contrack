const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');
const validate = require('../../../middlewares/validate');
const {
    createProductValidator,
    updateProductValidator,
    getProductByIdValidator,
    deleteProductValidator,
    getAllProductsValidator
} = require('../validators/product.validator');
const verifyToken = require('../../../middlewares/verifyToken');

router.use(verifyToken);    

// CRUD operations with validation
router.post(
    '/',
    createProductValidator,
    validate,
    productController.createProduct
);

router.get(
    '/',
    getAllProductsValidator,
    validate,
    productController.getAllProducts
);

router.get(
    '/:id',
    getProductByIdValidator,
    validate,
    productController.getProductById
);

router.put(
    '/:id',
    updateProductValidator,
    validate,
    productController.updateProduct
);

router.delete(
    '/:id',
    deleteProductValidator,
    validate,
    productController.deleteProduct
);

module.exports = router;

