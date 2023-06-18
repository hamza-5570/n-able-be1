const UserSchema = require("../models/user");

exports.createUser = async (query) => {
  return await UserSchema.create(query);
};

exports.getUser = async (query) => {
  return await UserSchema.findOne(query).populate("payment_id");
};

exports.getUserDetails = async (query) => {
  return await UserSchema.findOne(query).select(
    "-__v -createdAt -updatedAt -password"
  );
};

exports.updateUserById = async (query, data) => {
  return await UserSchema.findOneAndUpdate(query, data, {
    new: true,
  }).select("-__v -createdAt -updatedAt");
};

exports.deleteUserById = async (query) => {
  return await UserSchema.findOneAndDelete(query).select("-__v -createdAt -updatedAt");
};

exports.getAllUsers = async (query) => {
  return await UserSchema.find(query);
};
