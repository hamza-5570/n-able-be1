const ContactSchema = require("../models/contact");

exports.create = async (query) => {
  return await ContactSchema.create(query);
};

exports.getOne = async (query) => {
  return await ContactSchema.findOne(query);
};


exports.update = async (query, data) => {
  return await ContactSchema.findOneAndUpdate(query, data, {
    new: true,
  }).select("-__v -createdAt -updatedAt");
};

exports.delete = async (query) => {
  return await ContactSchema.findOneAndDelete(query).select("-__v -createdAt -updatedAt");
};

exports.getAll = async (query) => {
  return await ContactSchema.find(query);
};
