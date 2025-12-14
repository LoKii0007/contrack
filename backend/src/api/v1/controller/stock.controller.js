const stockService = require('../../../services/stock.service');

class StockController {
    async createStock(req, res) {
        try {
            const stock = await stockService.createStock(req.body, req.user.id);
            res.status(201).json({
                success: true,
                message: 'Stock entry created successfully',
                data: stock
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getAllStocks(req, res) {
        try {
            const { page, limit, ...filters } = req.query;
            const result = await stockService.getAllStocks(
                filters,
                page || 1,
                limit || 10,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Stock entries fetched successfully',
                data: result.stocks,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getStockById(req, res) {
        try {
            const stock = await stockService.getStockById(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Stock entry fetched successfully',
                data: stock
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateStock(req, res) {
        try {
            const stock = await stockService.updateStock(
                req.params.id,
                req.body,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Stock entry updated successfully',
                data: stock
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteStock(req, res) {
        try {
            await stockService.deleteStock(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Stock entry deleted successfully'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new StockController();


