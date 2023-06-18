const mongoose = require("mongoose");
const product_Schema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
        },  
    },
    { timestamps: true }
    );

    module.exports = mongoose.model("Product", product_Schema);
    