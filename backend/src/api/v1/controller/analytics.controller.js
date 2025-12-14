const analyticsService = require('../../../services/analytics.service');

class AnalyticsController {
    // 1 - Product-wise analytics: quantity and amount per product with date & product filters
    async getProductSales(req, res) {
        try {
            const {
                startDate,
                endDate,
                frequency,
                productId,
                category,
                brand
            } = req.query;

            const data = await analyticsService.getProductSalesAnalytics(
                { startDate, endDate, frequency, productId, category, brand },
                req.user.id
            );

            res.status(200).json({
                success: true,
                message: 'Product sales analytics fetched successfully',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 2 - Customer-wise analytics: how much each customer has bought
    async getCustomerSales(req, res) {
        try {
            const { startDate, endDate, frequency, customerId } = req.query;

            const data = await analyticsService.getCustomerSalesAnalytics(
                { startDate, endDate, frequency, customerId },
                req.user.id
            );

            res.status(200).json({
                success: true,
                message: 'Customer sales analytics fetched successfully',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 3 - Order-wise analytics: number of orders and total amount
    async getOrderAnalytics(req, res) {
        try {
            const { startDate, endDate, frequency } = req.query;

            const data = await analyticsService.getOrderAnalytics(
                { startDate, endDate, frequency },
                req.user.id
            );

            res.status(200).json({
                success: true,
                message: 'Order analytics fetched successfully',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new AnalyticsController();


