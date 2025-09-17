var express = require('express');
var router = express.Router();

<<<<<<< HEAD
/* GET home page. */
const userController = require("../controller/usercontroller");
const verifyToken = require("../middleware/authMiddleware");

router.post("/add",  userController.InsertData);
router.post("/login", userController.Login);
router.get("/",  userController.getData);
router.post("/update", userController.updateData);
router.post("/delete", userController.deleteData);   

module.exports = router;
=======
var controller = require('../controller/usercontroller');

router.get('/', controller.student);

router.post('/add', controller.Insert);

router.post('/update', controller.Update); 

router.post('/delete', controller.Delete);


module.exports = router;

>>>>>>> 6155596 (mongo atlas issue)
