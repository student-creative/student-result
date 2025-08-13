var express = require('express');
var router = express.Router();

/* GET home page. */
const userController = require("../controller/usercontroller");
const verifyToken = require("../middleware/authMiddleware");

router.post("/add",  userController.InsertData);
router.post("/login", userController.Login);
router.get("/",  userController.getData);
router.post("/update", userController.updateData);
router.post("/delete", userController.deleteData);   

module.exports = router;
