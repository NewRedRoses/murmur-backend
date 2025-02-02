const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

const app = express();

const PORT = 3000;

app.use(cors());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));

const messagesRouter = require("./routes/messagesRouter");
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");

app.use("/api/messages?", messagesRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.get("/api/test", (req, res) => {
  res.send("Backend API responded successful");
});
app.listen(PORT, () => console.log(`Launched on ${PORT}`));
