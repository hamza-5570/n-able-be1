var express = require("express");
const user = require("../controllers/userController");
const { checkToken } = require("../utilities/authToken");

var router = express.Router();

router.post("/login", user.UserLogin);
router.post("/adminLogin", user.UserLogin);
router.post("/signUp", user.UserSignUp);
router.get("/allUsers", user.GetAllUsers);
router.get("/auth", checkToken, user.UserAuth);
router.get("/getOne/:customerId", user.GetUserById);
router.put("/updateUser/:customerId", user.UpdateUser);
router.put("/updatePassword/:customerId", user.UpdateUserPassword);
router.delete("/deleteUser/:customerId", checkToken,user.DeleteUser);
module.exports = router;
