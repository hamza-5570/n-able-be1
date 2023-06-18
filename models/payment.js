const mongoose = require("mongoose");
const paymentSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    gbs:{
      type: Number,
    },
    sure_name:{
      type: String,
    },
    
    customer_id: {
      type: String,
      required: true,
      trim: true,
    },

    product_id: {
      type: String,
      required: true,
      trim: true,
    },
    subscription_id: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("payment", paymentSchema);
