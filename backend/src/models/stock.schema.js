const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      // required: true,
      default: null,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    phone: {
      type: Number,
    },
    email: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "other", "online"],
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partially_paid", "failed"],
      default: "pending",
    },
    paymentHistory: [
      {
        paymentDate: {
          type: Date,
          required: true,
        },
        creditAmount: {
          type: Number,
          required: true,
        },
        paymentMethod: {
          type: String,
          enum: ["cash", "other", "online"],
          required: true,
        },
        remainingAmount: {
          type: Number,
          required: true,
        },
        receiver: {
          type: String,
        },
      },
    ],
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
