const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function doesUserExist(req, res) {
  jwt.verify(req.token, process.env.SECRET, async (error, authData) => {
    if (error) {
      res.sendStatus(401);
    } else {
      try {
        const profile = await prisma.user.findFirst({
          where: {
            username: req.params.username,
          },
        });
        if (profile) {
          res.sendStatus(200).end();
        } else {
          res.sendStatus(404).end();
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
}

module.exports = { doesUserExist };
