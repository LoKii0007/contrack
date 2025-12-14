const Orders = require("../models/order.schema");
const Product = require("../models/product.schema");
const Customer = require("../models/customer.schema");
const mongoose = require("mongoose");

class AnalyticsService {
  /**
   * Build date filter for createdAt using optional start/end
   */
  buildDateFilter(startDate, endDate) {
    const createdAt = {};
    if (startDate) {
      createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      createdAt.$lte = new Date(endDate);
    }
    return Object.keys(createdAt).length ? { createdAt } : {};
  }

  /**
   * Build period grouping fields based on frequency
   */
  buildPeriodGroup(frequency) {
    switch (frequency) {
      case "daily":
        return {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        };
      case "weekly":
        return {
          year: { $isoWeekYear: "$createdAt" },
          week: { $isoWeek: "$createdAt" },
        };
      case "monthly":
        return {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        };
      case "quarter":
      case "3m":
        return {
          year: { $year: "$createdAt" },
          quarter: {
            $ceil: {
              $divide: [{ $month: "$createdAt" }, 3],
            },
          },
        };
      case "half_yearly":
        return {
          year: { $year: "$createdAt" },
          half: {
            $cond: [{ $lte: [{ $month: "$createdAt" }, 6] }, 1, 2],
          },
        };
      case "yearly":
      case "ytd":
        return {
          year: { $year: "$createdAt" },
        };
      default:
        // default to monthly
        return {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        };
    }
  }

  /**
   * Product-wise analytics
   * - Quantity and amount per product over time
   */
  async getProductSalesAnalytics(params, tenantId) {
    const {
      startDate,
      endDate,
      frequency = "monthly",
      productId,
      category,
      brand,
    } = params;

    const match = {
      tenant: new mongoose.Types.ObjectId(tenantId),
    };

    // ✅ Date filter on Orders
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const pipeline = [
      { $match: match },

      // ✅ explode products array
      { $unwind: "$products" },

      // ✅ lookup product
      {
        $lookup: {
          from: "products", // ⚠️ hardcode collection name (safer)
          localField: "products.product",
          foreignField: "_id",
          as: "product",
        },
      },

      // ❗ remove orders where lookup failed
      { $unwind: "$product" },

      // ✅ product-level filters
      {
        $match: {
          ...(productId && {
            "product._id": new mongoose.Types.ObjectId(productId),
          }),
          ...(category && { "product.category": category }),
          ...(brand && { "product.brand": brand }),
        },
      },

      // ✅ compute line total safely
      {
        $addFields: {
          lineTotal: {
            $cond: [
              { $gt: ["$products.total", 0] },
              "$products.total",
              {
                $multiply: [
                  { $ifNull: ["$products.quantity", 0] },
                  { $ifNull: ["$products.price", 0] },
                ],
              },
            ],
          },
        },
      },

      // ✅ group by product + time
      {
        $group: {
          _id: {
            productId: "$product._id",
            productName: "$product.name",
            category: "$product.category",
            brand: "$product.brand",
            ...this.buildPeriodGroup(frequency),
          },
          totalQuantity: { $sum: "$products.quantity" },
          totalAmount: { $sum: "$lineTotal" },
        },
      },

      // ✅ final shape
      {
        $project: {
          _id: 0,
          productId: "$_id.productId",
          productName: "$_id.productName",
          category: "$_id.category",
          brand: "$_id.brand",
          period: {
            year: "$_id.year",
            month: "$_id.month",
            week: "$_id.week",
            day: "$_id.day",
            quarter: "$_id.quarter",
            half: "$_id.half",
          },
          totalQuantity: 1,
          totalAmount: 1,
        },
      },

      {
        $sort: {
          "period.year": 1,
          "period.month": 1,
          "period.week": 1,
          "period.day": 1,
        },
      },
    ];

    return Orders.aggregate(pipeline);
  }

  /**
   * Customer-wise analytics
   * - How much each customer bought (quantity, amount, orders)
   */
  async getCustomerSalesAnalytics(params, tenantId) {
    const { startDate, endDate, frequency = "monthly", customerId } = params;

    const match = {
      tenant: new mongoose.Types.ObjectId(tenantId),
    };

    Object.assign(match, this.buildDateFilter(startDate, endDate));
    if (customerId) {
      match.customer = Customer.db.base.Types.ObjectId(customerId);
    }

    const pipeline = [
      { $match: match },
      { $unwind: "$products" },
      {
        $addFields: {
          lineTotal: {
            $cond: [
              { $gt: ["$products.total", 0] },
              "$products.total",
              { $multiply: ["$products.quantity", "$products.price"] },
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            customerId: "$customer",
            ...this.buildPeriodGroup(frequency),
          },
          totalQuantity: { $sum: "$products.quantity" },
          totalAmount: { $sum: "$lineTotal" },
          orderCount: { $addToSet: "$_id" },
        },
      },
      {
        $lookup: {
          from: Customer.collection.name,
          localField: "_id.customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $project: {
          _id: 0,
          customerId: "$_id.customerId",
          customerName: "$customer.name",
          customerEmail: "$customer.email",
          customerPhone: "$customer.phone",
          period: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
            week: "$_id.week",
            quarter: "$_id.quarter",
            half: "$_id.half",
          },
          totalQuantity: 1,
          totalAmount: 1,
          orderCount: { $size: "$orderCount" },
        },
      },
      {
        $sort: {
          "period.year": 1,
          "period.month": 1,
          "period.week": 1,
          "period.day": 1,
        },
      },
    ];

    return Orders.aggregate(pipeline);
  }

  /**
   * Order-wise analytics
   * - Number of orders and total amount over time
   */
  async getOrderAnalytics(params, tenantId) {
    const { startDate, endDate, frequency = "monthly" } = params;

    const match = {
      tenant: new mongoose.Types.ObjectId(tenantId),
    };

    Object.assign(match, this.buildDateFilter(startDate, endDate));

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: this.buildPeriodGroup(frequency),
          orderCount: { $sum: 1 },
          totalAmount: { $sum: "$total" },
        },
      },
      {
        $project: {
          _id: 0,
          period: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
            week: "$_id.week",
            quarter: "$_id.quarter",
            half: "$_id.half",
          },
          orderCount: 1,
          totalAmount: 1,
        },
      },
      {
        $sort: {
          "period.year": 1,
          "period.month": 1,
          "period.week": 1,
          "period.day": 1,
        },
      },
    ];

    return Orders.aggregate(pipeline);
  }
}

module.exports = new AnalyticsService();
