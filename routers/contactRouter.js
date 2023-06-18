var express = require("express");
const contact = require("../controllers/contactController");

var router = express.Router();

router.post("/createContact", contact.CreateContact);
router.get("/allContact", contact.GetAllContact);
router.get("/getOne/:id", contact.GetContactById);
router.put("/updateContact/:id", contact.UpdateContact);
router.delete("/deleteContact/:id",contact.DeleteContact);
module.exports = router;