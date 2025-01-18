const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function getConversations(req, res) {
  jwt.verify(req.token, process.env.SECRET, async (error, authData) => {
    if (error) {
      res.sendStatus(401);
    } else {
      try {
        const conversationUserIds = await prisma.messages.groupBy({
          by: ["senderId"],
          where: {
            receiverId: authData.id,
          },
        });
        const conversations = await Promise.all(
          conversationUserIds.map(async (conversation) => {
            return await prisma.user.findFirst({
              where: {
                id: conversation.senderId,
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

function getMessages(req, res) {
  jwt.verify(req.token, process.env.SECRET, async (error, authData) => {
    if (error) {
      res.sendStatus(401);
    } else {
      res.json({ message: "WIP" });
    }
  });
}

module.exports = { getMessages, getConversations };
