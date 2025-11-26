const customerService = require('../../../services/customer.service');

class CustomerController {
    async createCustomer(req, res) {
        try {
            const customer = await customerService.createCustomer(req.body, req.user.id);
            res.status(201).json({
                success: true,
                message: 'Customer created successfully',
                data: customer
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getAllCustomers(req, res) {
        try {
            const { page, limit, ...filters } = req.query;
            const result = await customerService.getAllCustomers(
                filters,
                page || 1,
                limit || 10,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Customers fetched successfully',
                data: result.customers,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getCustomerById(req, res) {
        try {
            const customer = await customerService.getCustomerById(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Customer fetched successfully',
                data: customer
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateCustomer(req, res) {
        try {
            const customer = await customerService.updateCustomer(
                req.params.id,
                req.body,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Customer updated successfully',
                data: customer
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteCustomer(req, res) {
        try {
            await customerService.deleteCustomer(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Customer deleted successfully'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async addAddress(req, res) {
        try {
            const customer = await customerService.addAddress(
                req.params.id,
                req.body,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Address added successfully',
                data: customer
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateAddress(req, res) {
        try {
            const customer = await customerService.updateAddress(
                req.params.id,
                req.params.addressId,
                req.body,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Address updated successfully',
                data: customer
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteAddress(req, res) {
        try {
            const customer = await customerService.deleteAddress(
                req.params.id,
                req.params.addressId,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Address deleted successfully',
                data: customer
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async getCustomerByEmail(req, res) {
        try {
            const customer = await customerService.getCustomerByEmail(req.params.email, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Customer fetched successfully',
                data: customer
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async getCustomerByPhone(req, res) {
        try {
            const customer = await customerService.getCustomerByPhone(req.params.phone, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Customer fetched successfully',
                data: customer
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async getCustomerStatistics(req, res) {
        try {
            const statistics = await customerService.getCustomerStatistics(req.user.id);
            res.status(200).json({
                success: true,
                message: 'Customer statistics fetched successfully',
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

module.exports = new CustomerController();


