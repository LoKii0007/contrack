const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
  addresses: [
    {
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
  ],
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
  },
}, {
  timestamps: true,
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;

