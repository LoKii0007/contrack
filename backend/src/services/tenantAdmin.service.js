const TenantAdmin = require('../models/tenatAdmin.schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class TenantAdminService {
    /**
     * Create a new tenant admin
     */
    async createTenantAdmin(tenantAdminData, tenantId) {
        try {
            // Check if tenant admin with email already exists
            const existingTenantAdmin = await TenantAdmin.findOne({ email: tenantAdminData.email });
            if (existingTenantAdmin) {
                throw new Error('Tenant admin with this email already exists');
            }

            // Check if tenant admin with phone already exists
            const existingTenantAdminByPhone = await TenantAdmin.findOne({ phone: tenantAdminData.phone });
            if (existingTenantAdminByPhone) {
                throw new Error('Tenant admin with this phone number already exists');
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(tenantAdminData.password, saltRounds);

            // Create tenant admin
            const tenantAdmin = new TenantAdmin({
                ...tenantAdminData,
                password: hashedPassword,
                tenant: tenantId
            });

            const savedTenantAdmin = await tenantAdmin.save();

            // Remove password from response
            const tenantAdminResponse = savedTenantAdmin.toObject();
            delete tenantAdminResponse.password;

            return tenantAdminResponse;
        } catch (error) {
            throw new Error(`Error creating tenant admin: ${error.message}`);
        }
    }

    /**
     * Get all tenant admins with optional filters and pagination
     */
    async getAllTenantAdmins(filters = {}, page = 1, limit = 10, tenantId) {
        try {
            const skip = (page - 1) * limit;
            const query = {
                tenant: tenantId
            };

            // Apply filters
            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { email: { $regex: filters.search, $options: 'i' } }
                ];
            }
            if (filters.email) {
                query.email = { $regex: filters.email, $options: 'i' };
            }
            if (filters.phone) {
                query.phone = filters.phone;
            }
            if (filters.role) {
                query.role = filters.role;
            }
            if (filters.isVerified !== undefined) {
                query.isVerified = filters.isVerified === 'true';
            }

            const tenantAdmins = await TenantAdmin.find(query)
                .select('-password -__v')
                .populate('tenant', 'name email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await TenantAdmin.countDocuments(query);

            return {
                tenantAdmins,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Error fetching tenant admins: ${error.message}`);
        }
    }

    /**
     * Get a single tenant admin by ID
     */
    async getTenantAdminById(tenantAdminId, tenantId) {
        try {
            const tenantAdmin = await TenantAdmin.findOne({ _id: tenantAdminId, tenant: tenantId })
                .select('-password -__v')
                .populate('tenant', 'name email');
            if (!tenantAdmin) {
                throw new Error('Tenant admin not found');
            }
            return tenantAdmin;
        } catch (error) {
            throw new Error(`Error fetching tenant admin: ${error.message}`);
        }
    }

    /**
     * Update a tenant admin by ID
     */
    async updateTenantAdmin(tenantAdminId, updateData, tenantId) {
        try {
            // Verify tenant admin belongs to tenant
            const existingTenantAdmin = await TenantAdmin.findOne({ _id: tenantAdminId, tenant: tenantId });
            if (!existingTenantAdmin) {
                throw new Error('Tenant admin not found');
            }

            // Prevent tenant change
            delete updateData.tenant;

            // If password is being updated, hash it
            if (updateData.password) {
                const saltRounds = 10;
                updateData.password = await bcrypt.hash(updateData.password, saltRounds);
            }

            // Check if email is being changed and if it already exists
            if (updateData.email && updateData.email !== existingTenantAdmin.email) {
                const emailExists = await TenantAdmin.findOne({ 
                    email: updateData.email,
                    _id: { $ne: tenantAdminId }
                });
                if (emailExists) {
                    throw new Error('Tenant admin with this email already exists');
                }
            }

            // Check if phone is being changed and if it already exists
            if (updateData.phone && updateData.phone !== existingTenantAdmin.phone) {
                const phoneExists = await TenantAdmin.findOne({ 
                    phone: updateData.phone,
                    _id: { $ne: tenantAdminId }
                });
                if (phoneExists) {
                    throw new Error('Tenant admin with this phone number already exists');
                }
            }

            const tenantAdmin = await TenantAdmin.findByIdAndUpdate(
                tenantAdminId,
                updateData,
                { new: true, runValidators: true }
            )
                .select('-password -__v')
                .populate('tenant', 'name email');
            return tenantAdmin;
        } catch (error) {
            throw new Error(`Error updating tenant admin: ${error.message}`);
        }
    }

    /**
     * Delete a tenant admin by ID
     */
    async deleteTenantAdmin(tenantAdminId, tenantId) {
        try {
            const tenantAdmin = await TenantAdmin.findOneAndDelete({ _id: tenantAdminId, tenant: tenantId });
            if (!tenantAdmin) {
                throw new Error('Tenant admin not found');
            }
            return tenantAdmin;
        } catch (error) {
            throw new Error(`Error deleting tenant admin: ${error.message}`);
        }
    }

    /**
     * Login tenant admin
     */
    async login(email, password) {
        try {
            // Find tenant admin by email
            const tenantAdmin = await TenantAdmin.findOne({ email }).populate('tenant', 'name email');
            if (!tenantAdmin) {
                throw new Error('Invalid email or password');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, tenantAdmin.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    id: tenantAdmin._id,
                    email: tenantAdmin.email,
                    role: tenantAdmin.role,
                    tenant: tenantAdmin.tenant._id
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Remove password from response
            const tenantAdminResponse = tenantAdmin.toObject();
            delete tenantAdminResponse.password;

            return {
                tenantAdmin: tenantAdminResponse,
                token
            };
        } catch (error) {
            throw new Error(`Error logging in: ${error.message}`);
        }
    }
}

module.exports = new TenantAdminService();

