const { Router } = require("express");

const messagesRouter = Router();

messagesRouter.get("/", (req, res) => {
  res.send("hi from router");
});

module.exports = messagesRouter;
