const tenantService = require('../../../services/tenant.service');

class TenantController {
    async register(req, res) {
        try {
            const tenant = await tenantService.register(req.body);
            res.status(201).json({
                success: true,
                message: 'Tenant registered successfully',
                data: tenant
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await tenantService.login(email, password);
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
            const tenant = await tenantService.getTenantById(req.user.id);
            res.status(200).json({
                success: true,
                message: 'Tenant profile fetched successfully',
                data: tenant
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new TenantController();


