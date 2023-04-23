const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth')
const messageController = require('../controllers/message_controller')

router.post("/create_message/:user_id", authMiddleware.verifyToken, messageController.createMessage);
router.get("/get_all_messages", authMiddleware.verifyToken, messageController.getAllMessages);


module.exports = router;