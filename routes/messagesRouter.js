const { Router } = require("express");

const verifyToken = require("../middlewares/verifyToken.js");
const messagesRouter = Router();

const {
  getConversations,
  getUserMessages,
  postUserMessage,
} = require("../controllers/messagesController.js");

messagesRouter.get("/", verifyToken, getConversations);
messagesRouter.get("/chat/:username", verifyToken, getUserMessages);
messagesRouter.post("/chat/:username", verifyToken, postUserMessage);

module.exports = messagesRouter;
