const { Router } = require("express");

const authRouter = Router();
const verifyToken = require("../middlewares/verifyToken.js");

const {
  loginPost,
  signupPost,
  logoutGet,
  profileGet,
  profilePost,
} = require("../controllers/authController");

authRouter.post("/login", loginPost);
authRouter.post("/signup", signupPost);
authRouter.get("/logout", logoutGet);
authRouter.get("/profile", verifyToken, profileGet);
authRouter.post("/profile", verifyToken, profilePost);

module.exports = authRouter;
