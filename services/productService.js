const ProductSchema = require("../models/product");

exports.create = async (query) => {
  return await ProductSchema.create(query);
};

exports.getOne = async (query) => {
  return await ProductSchema.findOne(query);
};


exports.update = async (query, data) => {
  return await ProductSchema.findOneAndUpdate(query, data, {
    new: true,
  }).select("-__v -createdAt -updatedAt");
};

exports.delete = async (query) => {
  return await ProductSchema.findOneAndDelete(query).select("-__v -createdAt -updatedAt");
};

exports.getAll = async (query) => {
  return await ProductSchema.find(query);
};
