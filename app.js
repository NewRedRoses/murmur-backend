const express = require("express");
const app = express();

const PORT = 3000;

const messagesRouter = require("./routes/messagesRouter");
const authRouter = require("./routes/authRouter");

app.use("/api/messages?", messagesRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => console.log(`Launched on ${PORT}`));
