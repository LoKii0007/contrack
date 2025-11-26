const Orders = require('../models/order.schema');
const Customer = require('../models/customer.schema');

class OrderService {
    /**
     * Calculate order total from products array
     */
    calculateOrderTotal(products) {
        return products.reduce((sum, item) => {
            return sum + (item.total || item.quantity * item.price);
        }, 0);
    }

    /**
     * Create a new order
     */
    async createOrder(orderData, tenantId) {
        try {
            // Handle new customer creation if isNewCustomer is true
            if (orderData.isNewUser && orderData.customer) {
                // Create new customer with the provided nam
                const newCustomer = new Customer({
                    name: orderData.customer,
                    email: orderData.email || undefined,
                    phone: orderData.phone || undefined,
                    tenant: tenantId
                });
                
                const savedCustomer = await newCustomer.save();
                
                // Replace customer name with customer ID
                orderData.customer = savedCustomer._id;
            }

            // Remove isNewCustomer field from orderData before saving
            delete orderData.isNewCustomer;
            
            // Add tenant to order
            orderData.tenant = tenantId;

            // Auto-calculate total if not provided or validate if provided
            if (orderData.products && orderData.products.length > 0) {
                const calculatedTotal = this.calculateOrderTotal(orderData.products);
                
                if (!orderData.total) {
                    orderData.total = calculatedTotal;
                }
            }

            // Handle payment history if provided
            if (orderData.paymentHistory && Array.isArray(orderData.paymentHistory) && orderData.paymentHistory.length > 0) {
                // Calculate total amount paid from payment history
                const totalAmountPaid = orderData.paymentHistory.reduce((sum, payment) => {
                    return sum + (payment.creditAmount || 0);
                }, 0);

                // Update payment status based on total amount paid
                if (totalAmountPaid >= orderData.total) {
                    orderData.paymentStatus = 'paid';
                } else if (totalAmountPaid > 0) {
                    orderData.paymentStatus = 'partially_paid';
                } else {
                    orderData.paymentStatus = orderData.paymentStatus || 'pending';
                }

                // Ensure remaining amounts are calculated correctly
                let cumulativePaid = 0;
                orderData.paymentHistory = orderData.paymentHistory.map((payment) => {
                    cumulativePaid += payment.creditAmount || 0;
                    return {
                        ...payment,
                        remainingAmount: Math.max(0, orderData.total - cumulativePaid),
                        paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : new Date(),
                    };
                });
            }

            const order = new Orders(orderData);
            return await order.save();
        } catch (error) {
            console.log("error", error);    
            throw new Error(`Error creating order: ${error.message}`);
        }
    }

    /**
     * Get all orders with optional filters and pagination
     */
    async getAllOrders(filters = {}, page = 1, limit = 10, tenantId) {
        try {
            const skip = (page - 1) * limit;
            const query = {
                tenant: tenantId
            };

            // Apply filters
            if (filters.customer) {
                query.customer = filters.customer;
            }
            if (filters.orderStatus) {
                query.orderStatus = filters.orderStatus;
            }
            if (filters.paymentStatus) {
                query.paymentStatus = filters.paymentStatus;
            }
            if (filters.paymentMethod) {
                query.paymentMethod = filters.paymentMethod;
            }
            if (filters.hasInvoice !== undefined) {
                query.hasInvoice = filters.hasInvoice === 'true';
            }
            if (filters.hasGST !== undefined) {
                query.hasGST = filters.hasGST === 'true';
            }
            if (filters.minTotal || filters.maxTotal) {
                query.total = {};
                if (filters.minTotal) query.total.$gte = Number(filters.minTotal);
                if (filters.maxTotal) query.total.$lte = Number(filters.maxTotal);
            }
            if (filters.search) {
                query.$or = [
                    { email: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } }
                ];
            }

            const orders = await Orders.find(query)
                .populate('customer', 'name email')
                .populate('products.product', 'name price category brand image')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await Orders.countDocuments(query);

            return {
                orders,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Error fetching orders: ${error.message}`);
        }
    }

    /**
     * Get a single order by ID
     */
    async getOrderById(orderId, tenantId) {
        try {
            const order = await Orders.findOne({ _id: orderId, tenant: tenantId })
                .populate('customer', 'name email phone')
                .populate('products.product', 'name price description category brand image');
            if (!order) {
                throw new Error('Order not found');
            }
            return order;
        } catch (error) {
            throw new Error(`Error fetching order: ${error.message}`);
        }
    }

    /**
     * Update an order by ID
     */
    async updateOrder(orderId, updateData, tenantId) {
        try {
            // Verify order belongs to tenant
            const existingOrder = await Orders.findOne({ _id: orderId, tenant: tenantId });
            if (!existingOrder) {
                throw new Error('Order not found');
            }

            // Prevent tenant change
            delete updateData.tenant;

            const order = await Orders.findByIdAndUpdate(
                orderId,
                updateData,
                { new: true, runValidators: true }
            )
                .populate('customer', 'name email')
                .populate('products.product', 'name price category brand image');

            // Calculate total amount paid from payment history
            const totalAmountPaid = order.paymentHistory.reduce((sum, payment) => {
                return sum + (payment.creditAmount || 0);
            }, 0);

            // Check if amount paid matches total and update payment status
            if (totalAmountPaid !== order.total) {
                order.paymentStatus = 'partially_paid';
                await order.save();
            } else if (totalAmountPaid === order.total && totalAmountPaid > 0) {
                order.paymentStatus = 'paid';
                await order.save();
            }

            // Return the updated order with populated fields
            return await Orders.findById(order._id)
                .populate('customer', 'name email')
                .populate('products.product', 'name price category brand image');
        } catch (error) {
            throw new Error(`Error updating order: ${error.message}`);
        }
    }

    /**
     * Delete an order by ID
     */
    async deleteOrder(orderId, tenantId) {
        try {
            const order = await Orders.findOneAndDelete({ _id: orderId, tenant: tenantId });
            if (!order) {
                throw new Error('Order not found');
            }
            return order;
        } catch (error) {
            throw new Error(`Error deleting order: ${error.message}`);
        }
    }

    /**
     * Add payment to order's payment history
     */
    async addPayment(orderId, paymentData, tenantId) {
        try {
            const order = await Orders.findOne({ _id: orderId, tenant: tenantId });
            if (!order) {
                throw new Error('Order not found');
            }

            order.paymentHistory.push(paymentData);
            
            // Update payment status based on remaining amount
            if (paymentData.remainingAmount === 0) {
                order.paymentStatus = 'paid';
            } else if (paymentData.remainingAmount < order.total) {
                order.paymentStatus = 'partially_paid';
            }

            const savedOrder = await order.save();
            
            // Populate and return the updated order
            return await Orders.findById(savedOrder._id)
                .populate('customer', 'name email')
                .populate('products.product', 'name price category brand image');
        } catch (error) {
            throw new Error(`Error adding payment: ${error.message}`);
        }
    }

    /**
     * Update order status
     */
    async updateOrderStatus(orderId, status, tenantId) {
        try {
            // Verify order belongs to tenant
            const existingOrder = await Orders.findOne({ _id: orderId, tenant: tenantId });
            if (!existingOrder) {
                throw new Error('Order not found');
            }

            const order = await Orders.findByIdAndUpdate(
                orderId,
                { orderStatus: status },
                { new: true, runValidators: true }
            )
                .populate('customer', 'name email')
                .populate('products.product', 'name price category brand image');
            return order;
        } catch (error) {
            throw new Error(`Error updating order status: ${error.message}`);
        }
    }

    /**
     * Get orders by customer ID
     */
    async getOrdersByCustomer(customerId, page = 1, limit = 10, tenantId) {
        try {
            const skip = (page - 1) * limit;
            
            const orders = await Orders.find({ customer: customerId, tenant: tenantId })
                .populate('products.product', 'name price category brand image')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await Orders.countDocuments({ customer: customerId, tenant: tenantId });

            return {
                orders,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Error fetching customer orders: ${error.message}`);
        }
    }

    /**
     * Get order statistics
     */
    async getOrderStatistics(startDate, endDate, tenantId) {
        try {
            const query = { tenant: tenantId };
            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate) query.createdAt.$gte = new Date(startDate);
                if (endDate) query.createdAt.$lte = new Date(endDate);
            }

            const totalOrders = await Orders.countDocuments(query);
            
            const statusCounts = await Orders.aggregate([
                { $match: query },
                { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
            ]);

            const paymentStatusCounts = await Orders.aggregate([
                { $match: query },
                { $group: { _id: '$paymentStatus', count: { $sum: 1 } } }
            ]);

            const revenueData = await Orders.aggregate([
                { $match: { ...query, paymentStatus: { $in: ['paid', 'partially_paid'] } } },
                { 
                    $group: { 
                        _id: null, 
                        totalRevenue: { $sum: '$total' },
                        averageOrderValue: { $avg: '$total' }
                    } 
                }
            ]);

            return {
                totalOrders,
                ordersByStatus: statusCounts.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                ordersByPaymentStatus: paymentStatusCounts.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                revenue: {
                    total: revenueData[0]?.totalRevenue || 0,
                    average: revenueData[0]?.averageOrderValue || 0
                }
            };
        } catch (error) {
            throw new Error(`Error fetching order statistics: ${error.message}`);
        }
    }
}

module.exports = new OrderService();

