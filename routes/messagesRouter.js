const { Router } = require("express");

const verifyToken = require("../middlewares/verifyToken.js");
const messagesRouter = Router();

const {
  getConversations,
  getMessages,
} = require("../controllers/messagesController.js");

messagesRouter.get("/", verifyToken, getConversations);

module.exports = messagesRouter;
