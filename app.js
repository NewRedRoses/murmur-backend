const express = require("express");
const session = require("express-session");
const passport = require("passport");

const app = express();

const PORT = 3000;

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // TODO: get ID from db that matches the id in the parameter.
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const messagesRouter = require("./routes/messagesRouter");
const authRouter = require("./routes/authRouter");

app.use("/api/messages?", messagesRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => console.log(`Launched on ${PORT}`));
