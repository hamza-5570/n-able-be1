const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
    },

    last_name: {
      type: String,
    },
    
    email: {
      type: String,
      required: true
    },

    password: {
      type: String,
    },

    company: {
      type: String,
    },

    data_storage: {
      type: String,
      enum: ["pc","computer", "external"]
    },

    useage:{
      type: String,
      enum: ["personal", "business"]
    },


    telephone:{
      type: String
    },

    vat_id:{
      type: String
    },

    address:{
      type: String
    },

    website:{
      type: String
    },

    postal_code:{
      type: String
    },

    country:{
      type: String
    },

    skype:{
      type: String
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },

    payment_status: {
      type: Boolean,
      default: false,
    },

    payment_id:{
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      trim: true,
      ref: "payment"
    },
    
    sure_name:{
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
