export const notificationEvents = (io, socket, userStore) => {
    socket.on("send-notification", (notif) => {
        notif?.recievers?.forEach((reciever) => {
            const user = userStore.getUser(reciever);
            if (user && user.socketId) {
                io.to(user.socketId).emit("get-notification", { ...notif });
            }
        });
    });
};
//# sourceMappingURL=notifications.js.map