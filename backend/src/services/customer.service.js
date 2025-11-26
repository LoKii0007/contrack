const Customer = require('../models/customer.schema');

class CustomerService {
    /**
     * Create a new customer
     */
    async createCustomer(customerData, tenantId) {
        try {
            const customer = new Customer({
                ...customerData,
                tenant: tenantId
            });
            return await customer.save();
        } catch (error) {
            throw new Error(`Error creating customer: ${error.message}`);
        }
    }

    /**
     * Get all customers with optional filters and pagination
     */
    async getAllCustomers(filters = {}, page = 1, limit = 10, tenantId) {
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
            if (filters.email) {
                query.email = { $regex: filters.email, $options: 'i' };
            }
            if (filters.city) {
                query['addresses.city'] = { $regex: filters.city, $options: 'i' };
            }
            if (filters.state) {
                query['addresses.state'] = { $regex: filters.state, $options: 'i' };
            }

            const customers = await Customer.find(query)
                .select('-__v')
                .skip(skip)
                .limit(limit)
                .sort({ name: 1 });

            const total = await Customer.countDocuments(query);

            return {
                customers,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Error fetching customers: ${error.message}`);
        }
    }

    /**
     * Get a single customer by ID
     */
    async getCustomerById(customerId, tenantId) {
        try {
            const customer = await Customer.findOne({ _id: customerId, tenant: tenantId })
                .populate('orders', 'total orderStatus paymentStatus createdAt')
                .select('-__v');
            if (!customer) {
                throw new Error('Customer not found');
            }
            return customer;
        } catch (error) {
            throw new Error(`Error fetching customer: ${error.message}`);
        }
    }

    /**
     * Update a customer by ID
     */
    async updateCustomer(customerId, updateData, tenantId) {
        try {
            // Verify customer belongs to tenant
            const existingCustomer = await Customer.findOne({ _id: customerId, tenant: tenantId });
            if (!existingCustomer) {
                throw new Error('Customer not found');
            }

            // Prevent tenant change
            delete updateData.tenant;

            const customer = await Customer.findByIdAndUpdate(
                customerId,
                updateData,
                { new: true, runValidators: true }
            )
                .select('-__v');
            return customer;
        } catch (error) {
            throw new Error(`Error updating customer: ${error.message}`);
        }
    }

    /**
     * Delete a customer by ID
     */
    async deleteCustomer(customerId, tenantId) {
        try {
            const customer = await Customer.findOneAndDelete({ _id: customerId, tenant: tenantId });
            if (!customer) {
                throw new Error('Customer not found');
            }
            return customer;
        } catch (error) {
            throw new Error(`Error deleting customer: ${error.message}`);
        }
    }

    /**
     * Add an address to customer
     */
    async addAddress(customerId, addressData, tenantId) {
        try {
            const customer = await Customer.findOne({ _id: customerId, tenant: tenantId });
            if (!customer) {
                throw new Error('Customer not found');
            }

            customer.addresses.push(addressData);
            return await customer.save();
        } catch (error) {
            throw new Error(`Error adding address: ${error.message}`);
        }
    }

    /**
     * Update an address for a customer
     */
    async updateAddress(customerId, addressId, addressData, tenantId) {
        try {
            const customer = await Customer.findOne({ _id: customerId, tenant: tenantId });
            if (!customer) {
                throw new Error('Customer not found');
            }

            const address = customer.addresses.id(addressId);
            if (!address) {
                throw new Error('Address not found');
            }

            Object.assign(address, addressData);
            return await customer.save();
        } catch (error) {
            throw new Error(`Error updating address: ${error.message}`);
        }
    }

    /**
     * Delete an address from customer
     */
    async deleteAddress(customerId, addressId, tenantId) {
        try {
            const customer = await Customer.findOne({ _id: customerId, tenant: tenantId });
            if (!customer) {
                throw new Error('Customer not found');
            }

            const address = customer.addresses.id(addressId);
            if (!address) {
                throw new Error('Address not found');
            }

            address.remove();
            return await customer.save();
        } catch (error) {
            throw new Error(`Error deleting address: ${error.message}`);
        }
    }

    /**
     * Get customer by email
     */
    async getCustomerByEmail(email, tenantId) {
        try {
            const customer = await Customer.findOne({ email, tenant: tenantId })
                .populate('orders', 'total orderStatus paymentStatus createdAt')
                .select('-__v');
            if (!customer) {
                throw new Error('Customer not found');
            }
            return customer;
        } catch (error) {
            throw new Error(`Error fetching customer: ${error.message}`);
        }
    }

    /**
     * Get customer by phone
     */
    async getCustomerByPhone(phone, tenantId) {
        try {
            const customer = await Customer.findOne({ phone, tenant: tenantId })
                .populate('orders', 'total orderStatus paymentStatus createdAt')
                .select('-__v');
            if (!customer) {
                throw new Error('Customer not found');
            }
            return customer;
        } catch (error) {
            throw new Error(`Error fetching customer: ${error.message}`);
        }
    }

    /**
     * Get customer statistics
     */
    async getCustomerStatistics(tenantId) {
        try {
            const baseQuery = { tenant: tenantId };
            const totalCustomers = await Customer.countDocuments(baseQuery);
            
            const customersWithOrders = await Customer.countDocuments({
                ...baseQuery,
                orders: { $exists: true, $ne: [] }
            });

            const customersWithoutOrders = totalCustomers - customersWithOrders;

            // Customers with email
            const customersWithEmail = await Customer.countDocuments({
                ...baseQuery,
                email: { $exists: true, $ne: null, $ne: '' }
            });

            // Customers with phone
            const customersWithPhone = await Customer.countDocuments({
                ...baseQuery,
                phone: { $exists: true, $ne: null }
            });

            // Customers with addresses
            const customersWithAddresses = await Customer.countDocuments({
                ...baseQuery,
                addresses: { $exists: true, $ne: [] }
            });

            return {
                totalCustomers,
                customersWithOrders,
                customersWithoutOrders,
                customersWithEmail,
                customersWithPhone,
                customersWithAddresses
            };
        } catch (error) {
            throw new Error(`Error fetching customer statistics: ${error.message}`);
        }
    }
}

module.exports = new CustomerService();


