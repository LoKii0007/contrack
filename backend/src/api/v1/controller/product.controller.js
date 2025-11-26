const productService = require('../../../services/product.service');

class ProductController {
    async createProduct(req, res) {
        try {
            const product = await productService.createProduct(req.body, req.user.id);
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getAllProducts(req, res) {
        try {
            const { page, limit, ...filters } = req.query;
            const result = await productService.getAllProducts(
                filters,
                page || 1,
                limit || 10,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Products fetched successfully',
                data: result.products,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    async getProductById(req, res) {
        try {
            const product = await productService.getProductById(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Product fetched successfully',
                data: product
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }


    async updateProduct(req, res) {
        try {
            const product = await productService.updateProduct(
                req.params.id,
                req.body,
                req.user.id
            );
            res.status(200).json({
                success: true,
                message: 'Product updated successfully',
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }


    async deleteProduct(req, res) {
        try {
            await productService.deleteProduct(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ProductController();

