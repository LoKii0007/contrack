const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    console.log('connecting to MongoDB');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log('error connecting to MongoDB');
    console.log(err);
    throw err;
  }
};

module.exports = connectDB;
