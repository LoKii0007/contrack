const express = require('express');
const router = express.Router();
const stockController = require('../controller/stock.controller');
const validate = require('../../../middlewares/validate');
const {
    createStockValidator,
    updateStockValidator,
    getStockByIdValidator,
    deleteStockValidator,
    getAllStocksValidator
} = require('../validators/stock.validator');
const verifyToken = require('../../../middlewares/verifyToken');

router.use(verifyToken);

// CRUD operations with validation
router.post(
    '/',
    createStockValidator,
    validate,
    stockController.createStock
);

router.get(
    '/',
    getAllStocksValidator,
    validate,
    stockController.getAllStocks
);

router.get(
    '/:id',
    getStockByIdValidator,
    validate,
    stockController.getStockById
);

router.put(
    '/:id',
    updateStockValidator,
    validate,
    stockController.updateStock
);

router.delete(
    '/:id',
    deleteStockValidator,
    validate,
    stockController.deleteStock
);

module.exports = router;


