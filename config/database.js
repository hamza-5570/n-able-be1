const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongouri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB is Connnected");
  } catch (error) {
    console.error(error.message);
  }
};
module.exports = connectDB;
