const { Router } = require("express");
const { doesUserExist } = require("../controllers/profileController.js");

const verifyToken = require("../middlewares/verifyToken.js");
const profileRouter = Router();

profileRouter.get("/:username", verifyToken, doesUserExist);

module.exports = profileRouter;
