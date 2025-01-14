const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

passport.use(
  new localStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      });
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

function loginPost(req, res, next) {
  console.log(res.get("origin"));
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
  })(req, res, next);
}
async function signupPost(req, res) {
  try {
    const { fullname, username, password } = req.body;
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      await prisma.user.create({
        data: {
          name: fullname,
          username: username,
          password: hashedPassword,
        },
      });
    });
    res.end();
  } catch (err) {
    console.log(err);
  }
}
function logoutGet(req, res) {
  res.send("WIP - logout");
}

module.exports = { loginPost, signupPost, logoutGet };
