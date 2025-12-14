const supplierService = require('../../../services/supplier.service');

class SupplierController {
    async createSupplier(req, res) {
        try {
            const supplier = await supplierService.createSupplier(req.body, req.user.id);
            res.status(201).json({
                success: true,
                message: 'Supplier created successfully',
                data: supplier
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getAllSuppliers(req, res) {
        try {
            const { page, limit, ...filters } = req.query;
            const result = await supplierService.getAllSuppliers(
                filters,
                page || 1,
                limit || 10,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Suppliers fetched successfully',
                data: result.suppliers,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getSupplierById(req, res) {
        try {
            const supplier = await supplierService.getSupplierById(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Supplier fetched successfully',
                data: supplier
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateSupplier(req, res) {
        try {
            const supplier = await supplierService.updateSupplier(
                req.params.id,
                req.body,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Supplier updated successfully',
                data: supplier
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteSupplier(req, res) {
        try {
            await supplierService.deleteSupplier(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Supplier deleted successfully'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new SupplierController();


