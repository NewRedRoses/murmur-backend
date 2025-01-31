const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function getConversations(req, res) {
  jwt.verify(req.token, process.env.SECRET, async (error, authData) => {
    if (error) {
      res.sendStatus(401);
    } else {
      try {
        const conversationUserIds =
          await prisma.$queryRaw`SELECT DISTINCT user_id
FROM (
    SELECT "senderId" AS user_id FROM "Messages" WHERE "receiverId" = ${authData.id} 
    UNION
    SELECT "receiverId" AS user_id FROM "Messages" WHERE "senderId" = ${authData.id} 
) AS unique_users`;

        const conversations = await Promise.all(
          conversationUserIds.map(async (conversation) => {
            return await prisma.user.findFirst({
              where: {
                id: conversation.user_id,
              },
              select: {
                id: true,
                name: true,
                username: true,
              },
            });
          }),
        );
        res.json(conversations);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
    }
  });
}

function getUserMessages(req, res) {
  jwt.verify(req.token, process.env.SECRET, async (error, authData) => {
    if (error) {
      res.sendStatus(403).end();
    } else {
      // Works as a boolean check as well
      const senderUserData = await prisma.user.findFirst({
        where: {
          username: req.params.username,
        },
        select: {
          id: true,
          username: true,
          name: true,
          status: true,
        },
      });

      if (senderUserData != undefined) {
        const messages = await prisma.messages.findMany({
          where: {
            OR: [
              {
                AND: [
                  {
                    senderId: {
                      equals: senderUserData.id,
                    },
                  },
                  {
                    receiverId: {
                      equals: authData.id,
                    },
                  },
                ],
              },

              // Below here is where condition 2. will be handled
              {
                AND: [
                  {
                    senderId: {
                      equals: authData.id,
                    },
                  },
                  {
                    receiverId: {
                      equals: senderUserData.id,
                    },
                  },
                ],
              },
            ],
          },
        });
        res.json({ senderUserData, loggedInUserId: authData.id, messages });
      } else {
        console.log("user not found");
        res.send("not found");
      }
    }
  });
}
function postUserMessage(req, res) {
  jwt.verify(req.token, process.env.SECRET, async (error, authData) => {
    try {
      if (error) {
        return res.sendStatus(403);
      } else {
        const { msgReceiverId, msgSenderId, message } = req.body;
        if (message != "") {
          await prisma.messages.create({
            data: {
              receiverId: parseInt(msgReceiverId),
              senderId: parseInt(msgSenderId),
              content: message,
            },
          });

          res.json({ msg: "message sent successfully" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = { getUserMessages, getConversations, postUserMessage };
