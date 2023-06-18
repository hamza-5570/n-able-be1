var express = require("express");
const payment = require("../controllers/paymentController");

var router = express.Router();

router.post("/CreateSubscription", payment.CreateSubscription);
router.get("/allPayment", payment.GetAllPayment);
router.get("/getOne/:id", payment.GetPaymentById);
router.put("/updatePayment/:id", payment.UpdatePayment);
router.put("/updateCustomer/:id", payment.UpdateCard);
router.put("/updateSubscription/:id", payment.UpdateSubscription);
router.delete("/deletePayment/:id",payment.DeletePayment);
module.exports = router;
