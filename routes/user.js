const express = require("express");
const router = express.Router();
const userController = require('../controllers/user_controller')

router.post("/create_user", userController.createUser);
router.post("/login_user", userController.login);


module.exports = router;