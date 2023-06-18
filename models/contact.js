const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    sure_name: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },  
    message: {
        type: String,
        required: true
    },
    authorized: {
        type: Boolean,
        required: true
    },
        
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
