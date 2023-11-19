import { IEventHandler } from "../types/index.js";
import { INotif } from "../types/index.js";


export const notificationEvents: IEventHandler = (io, socket, userStore) => {
  socket.on("send-notification", (notif: INotif) => {
    notif?.recievers?.forEach((reciever) => {
      const user = userStore.getUser(reciever);
      if (user && user.socketId) {
        io.to(user.socketId).emit("get-notification", { ...notif });
      }
    });
  });
};
