const Product = require('../models/product.schema');

class ProductService {
    /**
     * Create a new product
     */
    async createProduct(productData, tenantId) {
        try {
            const product = new Product({
                ...productData,
                tenant: tenantId
            });
            return await product.save();
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    /**
     * Get all products with optional filters and pagination
     */
    async getAllProducts(filters = {}, page = 1, limit = 10, tenantId) {
        try {
            const skip = (page - 1) * limit;
            const query = {
                tenant: tenantId
            };

            // Apply filters
            if (filters.category) {
                query.category = filters.category;
            }
            if (filters.brand) {
                query.brand = filters.brand;
            }
            if (filters.minPrice || filters.maxPrice) {
                query.price = {};
                if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
                if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
            }
            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } }
                ];
            }

            const products = await Product.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await Product.countDocuments(query);

            return {
                products,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }

    /**
     * Get a single product by ID
     */
    async getProductById(productId, tenantId) {
        try {
            const product = await Product.findOne({ _id: productId, tenant: tenantId });
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error(`Error fetching product: ${error.message}`);
        }
    }

    /**
     * Update a product by ID
     */
    async updateProduct(productId, updateData, tenantId) {
        try {
            // Verify product belongs to tenant
            const existingProduct = await Product.findOne({ _id: productId, tenant: tenantId });
            if (!existingProduct) {
                throw new Error('Product not found');
            }

            // Prevent tenant change
            delete updateData.tenant;

            const product = await Product.findByIdAndUpdate(
                productId,
                updateData,
                { new: true, runValidators: true }
            );
            return product;
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    /**
     * Delete a product by ID
     */
    async deleteProduct(productId, tenantId) {
        try {
            const product = await Product.findOneAndDelete({ _id: productId, tenant: tenantId });
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }

    /**
     * Get unique categories
     */
    async getCategories(tenantId) {
        try {
            const categories = await Product.distinct('category', { tenant: tenantId });
            return categories;
        } catch (error) {
            throw new Error(`Error fetching categories: ${error.message}`);
        }
    }

    /**
     * Get unique brands
     */
    async getBrands(tenantId) {
        try {
            const brands = await Product.distinct('brand', { tenant: tenantId });
            return brands;
        } catch (error) {
            throw new Error(`Error fetching brands: ${error.message}`);
        }
    }
}

module.exports = new ProductService();

