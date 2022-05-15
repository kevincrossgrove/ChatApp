const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 8080;
const cors = require("cors");
const authRouter = require("./routes/AuthRouter");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Connect to the database
mongoose.connect(process.env.MDB_CONNECT, { useNewUrlParser: true }, (err) => {
  if (err) return console.log(err);
  console.log("Connected to Database");
});

io.use(async (socket, next) => {
  const user = socket.handshake.auth.user;

  if (!user) return next(new Error("No User"));

  socket.userID = user._id;
  socket.userName = user.email;
  next();
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Join the userID room
  socket.join(socket.userID);

  socket.on("disconnect", (data) => {
    console.log(data);

    socket.broadcast.emit("user-connected", {
      userID: socket.userID,
      userName: socket.userName,
      connected: true,
      messages: [],
    });
  });

  socket.on("chat-message", (msg) => {
    socket.broadcast.emit("chat-message", msg);
  });

  socket.broadcast.emit("user-connected", {
    userID: socket.userID,
    userName: socket.userName,
    connected: true,
    messages: [],
  });
});

// Routes
app.use("/auth", authRouter);

server.listen(PORT, () => {
  console.log("listening on *:", PORT);
});
