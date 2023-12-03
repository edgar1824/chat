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

const userStore = new UserStore();
const server = http.createServer((req, res) => {
  switch (req.url) {
    case "/check": {
      res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
      res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, POST, GET, PUT, DELETE"
      );
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Content-Type", "application/json");

      res.statusCode = 200;
      res.end(JSON.stringify({ connected: true }));
      break;
    }
    default: {
      res.end("Socket server connected");
      break;
    }
  }
});

const io = new Server(server, {
  cors: {
    credentials: true,
    origin: [process.env.CLIENT_URL],
  },
});

server.listen(4000, () => {
  console.log("Socket Server Connected");
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
