const Stock = require('../models/stock.schema');

class StockService {
    /**
     * Calculate stock total from products array
     */
    calculateStockTotal(products) {
        return products.reduce((sum, item) => {
            return sum + (item.total || item.quantity * item.price);
        }, 0);
    }

    /**
     * Create a new stock entry
     */
    async createStock(stockData, tenantId) {
        try {
            // Normalize optional supplier field
            if (!stockData.supplier) {
                stockData.supplier = null;
            }

            // Attach tenant
            stockData.tenant = tenantId;

            // Auto-calculate total if not provided
            if (stockData.products && stockData.products.length > 0) {
                const calculatedTotal = this.calculateStockTotal(stockData.products);
                if (!stockData.total) {
                    stockData.total = calculatedTotal;
                }
            }

            const stock = new Stock(stockData);
            return await stock.save();
        } catch (error) {
            throw new Error(`Error creating stock: ${error.message}`);
        }
    }

    /**
     * Get all stock entries with optional filters and pagination
     */
    async getAllStocks(filters = {}, page = 1, limit = 10, tenantId) {
        try {
            const skip = (page - 1) * limit;
            const query = {
                tenant: tenantId
            };

            // Apply filters
            if (filters.supplier) {
                query.supplier = filters.supplier;
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
            if (filters.minTotal || filters.maxTotal) {
                query.total = {};
                if (filters.minTotal) query.total.$gte = Number(filters.minTotal);
                if (filters.maxTotal) query.total.$lte = Number(filters.maxTotal);
            }

            const stocks = await Stock.find(query)
                .populate('supplier', 'name email')
                .populate('products.product', 'name price category brand image')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await Stock.countDocuments(query);

            return {
                stocks,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Error fetching stocks: ${error.message}`);
        }
    }

    /**
     * Get a single stock entry by ID
     */
    async getStockById(stockId, tenantId) {
        try {
            const stock = await Stock.findOne({ _id: stockId, tenant: tenantId })
                .populate('supplier', 'name email phone')
                .populate('products.product', 'name price description category brand image');
            if (!stock) {
                throw new Error('Stock not found');
            }
            return stock;
        } catch (error) {
            throw new Error(`Error fetching stock: ${error.message}`);
        }
    }

    /**
     * Update a stock entry by ID
     */
    async updateStock(stockId, updateData, tenantId) {
        try {
            // Verify stock belongs to tenant
            const existingStock = await Stock.findOne({ _id: stockId, tenant: tenantId });
            if (!existingStock) {
                throw new Error('Stock not found');
            }

            // Prevent tenant change
            delete updateData.tenant;

            // Normalize optional supplier field on update
            if (Object.prototype.hasOwnProperty.call(updateData, 'supplier') && !updateData.supplier) {
                updateData.supplier = null;
            }

            const stock = await Stock.findByIdAndUpdate(
                stockId,
                updateData,
                { new: true, runValidators: true }
            )
                .populate('supplier', 'name email')
                .populate('products.product', 'name price category brand image');

            return stock;
        } catch (error) {
            throw new Error(`Error updating stock: ${error.message}`);
        }
    }

    /**
     * Delete a stock entry by ID
     */
    async deleteStock(stockId, tenantId) {
        try {
            const stock = await Stock.findOneAndDelete({ _id: stockId, tenant: tenantId });
            if (!stock) {
                throw new Error('Stock not found');
            }
            return stock;
        } catch (error) {
            throw new Error(`Error deleting stock: ${error.message}`);
        }
    }
}

module.exports = new StockService();


