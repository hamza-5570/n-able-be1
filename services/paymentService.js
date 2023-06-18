const PaymentSchema = require("../models/payment");

exports.create = async (query) => {
  return await PaymentSchema.create(query);
};

exports.getOne = async (query) => {
  return await PaymentSchema.findOne(query);
};


exports.update = async (query, data) => {
  return await PaymentSchema.findOneAndUpdate(query, data, {
    new: true,
  }).select("-__v -createdAt -updatedAt");
};

exports.delete = async (query) => {
  return await PaymentSchema.findOneAndDelete(query).select("-__v -createdAt -updatedAt");
};

exports.getAll = async (query) => {
  return await PaymentSchema.find(query);
};
