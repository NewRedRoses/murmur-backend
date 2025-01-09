const { Router } = require("express");

const authRouter = Router();

const {
  loginPost,
  signupPost,
  logoutGet,
} = require("../controllers/authController");

authRouter.post("/login", loginPost);
authRouter.post("/signup", signupPost);
authRouter.get("/logout", logoutGet);

module.exports = authRouter;
