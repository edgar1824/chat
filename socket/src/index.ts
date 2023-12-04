import { Server } from "socket.io";
import { UserStore } from "./services/index.js";
import dotenv from "dotenv";
dotenv.config();
import {
  userEvents,
  conversationEvents,
  messageEvents,
  notificationEvents,
} from "./events/index.js";
import http from "http";
import express from "express";

const userStore = new UserStore();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

app.get("/check", (req, res, next) => {
  res.status(200).json({ connected: true });
});

io.on("connection", (socket) => {
  console.log("Socket Connected");
  // ################ USERS ################
  userEvents(io, socket, userStore);

  // ############### MESSAGES ##############
  messageEvents(io, socket, userStore);

  // ############ CONVERSATIONS ############
  conversationEvents(io, socket, userStore);

  // ############ NOTIFICATIONS ############
  notificationEvents(io, socket, userStore);

  // when dissconnected
  socket.on("disconnect", () => {
    console.log("User Disconnected");
    userStore.removeUser(socket.id);
    io.emit("get-users", userStore.users);
    socket.disconnect();
  });
});

server.listen(4000, () => {
  console.log("Socket Server Connected");
});
