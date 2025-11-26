const Tenant = require('../models/tenant.schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class TenantService {
    /**
     * Register a new tenant
     */
    async register(tenantData) {
        try {
            // Check if tenant with email already exists
            const existingTenant = await Tenant.findOne({ email: tenantData.email });
            if (existingTenant) {
                throw new Error('Tenant with this email already exists');
            }

            // Check if tenant with phone already exists
            const existingTenantByPhone = await Tenant.findOne({ phone: tenantData.phone });
            if (existingTenantByPhone) {
                throw new Error('Tenant with this phone number already exists');
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(tenantData.password, saltRounds);

            // Create tenant
            const tenant = new Tenant({
                ...tenantData,
                password: hashedPassword
            });

            const savedTenant = await tenant.save();

            // Remove password from response
            const tenantResponse = savedTenant.toObject();
            delete tenantResponse.password;

            return tenantResponse;
        } catch (error) {
            throw new Error(`Error registering tenant: ${error.message}`);
        }
    }

    /**
     * Login tenant
     */
    async login(email, password) {
        try {
            // Find tenant by email
            const tenant = await Tenant.findOne({ email });
            if (!tenant) {
                throw new Error('Invalid email or password');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, tenant.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    id: tenant._id,
                    email: tenant.email,
                    role: tenant.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Remove password from response
            const tenantResponse = tenant.toObject();
            delete tenantResponse.password;

            return {
                tenant: tenantResponse,
                token
            };
        } catch (error) {
            throw new Error(`Error logging in: ${error.message}`);
        }
    }

    /**
     * Get tenant by ID
     */
    async getTenantById(tenantId) {
        try {
            const tenant = await Tenant.findById(tenantId).select('-password -__v');
            if (!tenant) {
                throw new Error('Tenant not found');
            }
            return tenant;
        } catch (error) {
            throw new Error(`Error fetching tenant: ${error.message}`);
        }
    }
}

module.exports = new TenantService();


