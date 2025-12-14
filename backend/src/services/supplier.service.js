const Supplier = require('../models/supplier.schema');

class SupplierService {
    /**
     * Create a new supplier
     */
    async createSupplier(supplierData, tenantId) {
        try {
            const supplier = new Supplier({
                ...supplierData,
                tenant: tenantId
            });
            return await supplier.save();
        } catch (error) {
            throw new Error(`Error creating supplier: ${error.message}`);
        }
    }

    /**
     * Get all suppliers with optional filters and pagination
     */
    async getAllSuppliers(filters = {}, page = 1, limit = 10, tenantId) {
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
            if (filters.phone) {
                query.phone = filters.phone;
            }

            const suppliers = await Supplier.find(query)
                .select('-__v')
                .skip(skip)
                .limit(limit)
                .sort({ name: 1 });

            const total = await Supplier.countDocuments(query);

            return {
                suppliers,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Error fetching suppliers: ${error.message}`);
        }
    }

    /**
     * Get a single supplier by ID
     */
    async getSupplierById(supplierId, tenantId) {
        try {
            const supplier = await Supplier.findOne({ _id: supplierId, tenant: tenantId })
                .select('-__v');
            if (!supplier) {
                throw new Error('Supplier not found');
            }
            return supplier;
        } catch (error) {
            throw new Error(`Error fetching supplier: ${error.message}`);
        }
    }

    /**
     * Update a supplier by ID
     */
    async updateSupplier(supplierId, updateData, tenantId) {
        try {
            // Verify supplier belongs to tenant
            const existingSupplier = await Supplier.findOne({ _id: supplierId, tenant: tenantId });
            if (!existingSupplier) {
                throw new Error('Supplier not found');
            }

            // Prevent tenant change
            delete updateData.tenant;

            const supplier = await Supplier.findByIdAndUpdate(
                supplierId,
                updateData,
                { new: true, runValidators: true }
            )
                .select('-__v');
            return supplier;
        } catch (error) {
            throw new Error(`Error updating supplier: ${error.message}`);
        }
    }

    /**
     * Delete a supplier by ID
     */
    async deleteSupplier(supplierId, tenantId) {
        try {
            const supplier = await Supplier.findOneAndDelete({ _id: supplierId, tenant: tenantId });
            if (!supplier) {
                throw new Error('Supplier not found');
            }
            return supplier;
        } catch (error) {
            throw new Error(`Error deleting supplier: ${error.message}`);
        }
    }
}

module.exports = new SupplierService();


