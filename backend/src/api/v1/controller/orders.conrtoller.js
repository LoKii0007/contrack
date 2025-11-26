const orderService = require('../../../services/order.service');

class OrderController {
    async createOrder(req, res) {
        try {
            const order = await orderService.createOrder(req.body, req.user.id);
            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getAllOrders(req, res) {
        try {
            const { page, limit, ...filters } = req.query;
            const result = await orderService.getAllOrders(
                filters,
                page || 1,
                limit || 10,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Orders fetched successfully',
                data: result.orders,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getOrderById(req, res) {
        try {
            const order = await orderService.getOrderById(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Order fetched successfully',
                data: order
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateOrder(req, res) {
        try {
            const order = await orderService.updateOrder(
                req.params.id,
                req.body,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Order updated successfully',
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteOrder(req, res) {
        try {
            await orderService.deleteOrder(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Order deleted successfully'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async addPayment(req, res) {
        try {
            const order = await orderService.addPayment(
                req.params.id,
                req.body,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Payment added successfully',
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const order = await orderService.updateOrderStatus(
                req.params.id,
                req.body.status,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Order status updated successfully',
                data: order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getOrdersByCustomer(req, res) {
        try {
            const { page, limit } = req.query;
            const result = await orderService.getOrdersByCustomer(
                req.params.customerId,
                page || 1,
                limit || 10,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Customer orders fetched successfully',
                data: result.orders,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getOrderStatistics(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const statistics = await orderService.getOrderStatistics(startDate, endDate, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Order statistics fetched successfully',
                data: statistics
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new OrderController();

