const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

passport.use(
  new localStrategy(async (username, password, done) => {
    try {
      // db query to get user name
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      // compare password to hashed
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

function loginPost(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })(req, res, next);
}
function signupPost(req, res) {
  res.send("WIP - signup");
}
function logoutGet(req, res) {
  res.send("WIP - logout");
}

module.exports = { loginPost, signupPost, logoutGet };
