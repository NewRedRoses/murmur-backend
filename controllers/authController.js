const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

async function loginPost(req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      res.status(400).json({ message: info?.message || "Login failed!" });
    } else {
      const token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: "24h",
      });
      res.json({
        token,
      });
    }
  })(req, res, next);
}
async function signupPost(req, res) {
  try {
    const { fullname, username, password } = req.body;
    if (fullname !== "" && username !== "" && password !== "") {
      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
          res.sendStatus(500);
        } else {
          await prisma.user.create({
            data: {
              name: fullname,
              username: username,
              password: hashedPassword,
            },
          });
        }
      });
      res.sendStatus(200);
    } else {
      // allegedly  this is for client-side validation errors
      res.sendStatus(403);
    }
  } catch (err) {
    console.log(err);
  }
}

function profileGet(req, res) {
  jwt.verify(req.token, process.env.SECRET, async (error, authData) => {
    if (error) {
      res.status(401).end();
    } else {
      const userData = await prisma.user.findUnique({
        where: {
          id: authData.id,
        },
        select: {
          name: true,
          username: true,
          status: true,
        },
      });
      res.json(userData);
    }
  });
}
function profilePost(req, res) {
  jwt.verify(req.token, process.env.SECRET, async (error, authData) => {
    try {
      if (error) {
        res.status(300).end();
      } else {
        const { name, username, status } = req.body;
        if (name != "" && username != "") {
          const isUsernameInDb = await checkUsernameInDb(username);
          if (!isUsernameInDb) {
            await prisma.user.update({
              where: {
                id: authData.id,
              },
              data: {
                name,
                username,
                status,
              },
            });
            res.status(200).end();
          } else {
            res
              .status(500)
              .send("Username already in database. Try a different one.");
          }
        } else {
          res.status(500).send("Name & Username cannot be empty.");
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(err);
    }
  });
}

const checkUsernameInDb = async (username) => {
  const profile = await prisma.user.findFirst({
    where: {
      username,
    },
  });
  return profile != null ? true : false;
};

module.exports = { loginPost, signupPost, profileGet, profilePost };
