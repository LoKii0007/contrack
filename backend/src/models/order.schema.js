const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
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
    shippingAddress: {
      streetAddress: {
        type: String,
      },
      streetAddress2: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      postalCode: {
        type: String,
      },
    },
    phone: {
      type: Number,
    },
    email: {
      type: String,
    },
    hasInvoice: {
      type: Boolean,
      default: false,
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
    hasGST: {
      type: Boolean,
      default: false,
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

const Orders = mongoose.model("Orders", orderSchema);

module.exports = Orders;
