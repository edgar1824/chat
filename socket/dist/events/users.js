export const userEvents = (io, socket, userStore) => {
    socket.on("add-user", (userId, username, conversationId) => {
        userStore.addUser(userId, socket.id, username, conversationId);
        socket.join(conversationId);
        io.emit("get-users", userStore.users);
    });
    socket.on("join", (userId, conversationId) => {
        const user = userStore.getUser(userId);
        if (user && user?.conversationId) {
            socket.leave(user.conversationId);
        }
        userStore.join(userId, conversationId);
        socket.join(conversationId);
    });
    socket.on("add-friend", ({ friendId }) => {
        const friend = userStore.getUser(friendId);
        if (friend && friend.socketId) {
            io.to(friend.socketId).emit("get-friend", friendId);
        }
    });
    socket.on("remove-friend", ({ friendId }) => {
        const friend = userStore.getUser(friendId);
        if (friend && friend.socketId) {
            io.to(friend.socketId).emit("remove-friend", friendId);
        }
    });
};
//# sourceMappingURL=users.js.map