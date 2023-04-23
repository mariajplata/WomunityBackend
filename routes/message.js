const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth')
const messageController = require('../controllers/message_controller')

router.post("/create_message/:user_id", authMiddleware.verifyToken, messageController.createMessage);
router.get("/get_all_messages", authMiddleware.verifyToken, messageController.getAllMessages);
router.get("/get_messages/:user_id", authMiddleware.verifyToken, messageController.getAllMessages);
router.put("/update_message/:message_id/:user_id", authMiddleware.verifyToken, messageController.updateMessage);



module.exports = router;