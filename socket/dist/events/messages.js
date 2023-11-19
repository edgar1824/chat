export const messageEvents = (io, socket, userStore) => {
    socket.on("send-message", ({ sender, conversationId, ...rest }) => {
        const message = {
            sender,
            conversationId,
            ...rest,
        };
        io.to(conversationId).emit("get-message", message);
    });
    socket.on("last-message", (members, conversationId, message) => {
        const mySender = userStore.getUser(message?.sender);
        const socketMembers = members
            .map((m) => userStore.getUser(m)?.socketId)
            .filter((e) => !!e);
        io.to(socketMembers).emit("get-last-message", conversationId, {
            ...message,
            username: mySender?.username,
        });
    });
    socket.on("typing", ({ userId, conversationId, isTyping, members, }) => {
        const socketFrineds = members
            .map((m) => userStore.getUser(m)?.socketId)
            .filter((e) => !!e);
        const user = userStore.getUser(userId);
        io.to(socketFrineds).emit("conv-typing", {
            username: user?.username,
            isTyping,
            convId: conversationId,
            userId,
        });
        io.to(conversationId).emit("messages-typing", {
            username: user?.username,
            isTyping,
            userId,
        });
    });
    socket.on("message-watched", (message) => {
        io.to(message?.conversationId).emit("get-message-watched", message);
    });
    socket.on("delete-message", (messageId, convId) => {
        io.to(convId).emit("deleted-message", messageId, convId);
    });
};
//# sourceMappingURL=messages.js.map