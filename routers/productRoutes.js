var express = require("express");
const product = require("../controllers/productController");

var router = express.Router();

router.post("/createProduct", product.CreateProduct);
router.get("/allProducts", product.GetAllProducts);
router.get("/getOne/:id", product.GetProductById);
router.put("/updateProduct/:id", product.UpdateProduct);
router.delete("/deleteProduct/:id",product.Deleteproduct);
module.exports = router;
