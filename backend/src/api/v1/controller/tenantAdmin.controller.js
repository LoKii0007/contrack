const tenantAdminService = require('../../../services/tenantAdmin.service');

class TenantAdminController {
    async createTenantAdmin(req, res) {
        try {
            const tenantAdmin = await tenantAdminService.createTenantAdmin(req.body, req.user.id);
            res.status(201).json({
                success: true,
                message: 'Tenant admin created successfully',
                data: tenantAdmin
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getAllTenantAdmins(req, res) {
        try {
            const { page, limit, ...filters } = req.query;
            const result = await tenantAdminService.getAllTenantAdmins(
                filters,
                page || 1,
                limit || 10,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Tenant admins fetched successfully',
                data: result.tenantAdmins,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getTenantAdminById(req, res) {
        try {
            const tenantAdmin = await tenantAdminService.getTenantAdminById(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Tenant admin fetched successfully',
                data: tenantAdmin
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateTenantAdmin(req, res) {
        try {
            const tenantAdmin = await tenantAdminService.updateTenantAdmin(
                req.params.id,
                req.body,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Tenant admin updated successfully',
                data: tenantAdmin
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteTenantAdmin(req, res) {
        try {
            await tenantAdminService.deleteTenantAdmin(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Tenant admin deleted successfully'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await tenantAdminService.login(email, password);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    async getProfile(req, res) {
        try {
            const tenantAdmin = await tenantAdminService.getTenantAdminById(req.user.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Tenant admin profile fetched successfully',
                data: tenantAdmin
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new TenantAdminController();

