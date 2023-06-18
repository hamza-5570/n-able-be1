const messageUtil = require("../utilities/message");
const productService = require("../services/productService");
const {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
  badRequestErrorResponse,
} = require("../utilities/response");

class Product {
  CreateProduct = async (req, res) => {
    let errors =[];
    const {
      product_name,
      description,
      amount,
    } = req.body;

    if (!product_name) {
      errors.push("Product Name");
    }

    if (!description) {
      errors.push("Discription");
    }

    if (!amount) {
      errors.push("Amount");
    }
    
    if (errors.length > 0) {
      errors = errors.join(", ");
      return badRequestErrorResponse(res, messageUtil.empytyField+errors);
    }
    try {
      let product = await productService.create({
        ...req.body,
      });

      if(!product){
        return badRequestErrorResponse(res, messageUtil.recordNotCreated)
      }
      
      return successResponse(res, messageUtil.QuoteAdded, product);
    } catch (err) {
      console.log("error", err);
      return serverErrorResponse(res, err);
    }
  };

  GetAllProducts = async (req, res) => {
    try {
      let product = await productService.getAll({...req.body});
      if (!product) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.ok, product);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };

  GetProductById = async (req, res) => {
    const { id } = req.params;
    try {
      let product = await productService.getOne({ _id: id });
      if (!product) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.ok, product);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };
  UpdateProduct = async (req, res) => {
    const { id } = req.params;
    try {
      let product = await productService.update({ _id: id }, { ...req.body });
      if (!product) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.updateSuccess, product);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };
  Deleteproduct = async (req, res) => {
    const { id } = req.params;
    let product;
    try {
      product = await productService.delete({ _id: id });
      if (!product) {
        return notFoundResponse(res, messageUtil.NotFound);
      } else {
        return successResponse(res, messageUtil.deleteSuccess, product);
      }
    } catch (err) {
      return serverErrorResponse(res, err);
    }
  };
}
module.exports = new Product();
