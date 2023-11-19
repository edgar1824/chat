export const conversationEvents = (io, socket, userStore) => {
    socket.on("create-conversation", ({ members, _id, title, img, }) => {
        const socketMembers = members
            ?.map((member) => userStore.getUser(member)?.socketId)
            .filter(Boolean);
        io.to(socketMembers).emit("get-conversations", [
            { members, _id, title, img },
        ]);
    });
    socket.on("delete-conversation", (convId, members) => {
        const socketUsers = userStore.users
            .filter((user) => members?.length ? members?.includes(user?.userId) : true)
            .map((user) => user.socketId);
        io.to(socketUsers).emit("removed-conversation", convId);
    });
    socket.on("leave-conversation", ({ conversationId, userId, members, }) => {
        console.log(members);
        const socketMembers = members?.map((member) => userStore.getUser(member)?.socketId);
        io.to(socketMembers).emit("conversation-members", members?.filter((m) => m !== userId), conversationId);
        const onlineUser = userStore.getUser(userId);
        if (onlineUser && onlineUser.socketId) {
            io.to(onlineUser.socketId).emit("removed-conversation", conversationId);
        }
    });
    socket.on("add-user-to-conversation", ({ conversation, user }) => {
        io.to(conversation?._id).emit("conversation-members", [...conversation?.members, user?._id], conversation._id);
        const isUser = userStore.getUser(user?._id);
        if (isUser && isUser.socketId) {
            io.to(isUser.socketId).emit("get-conversations", [conversation]);
        }
    });
    socket.on("edit-conversation", (conversation) => {
        const socketMembers = conversation
            .members.map((m) => userStore.getUser(m)?.socketId)
            .filter((e) => !!e);
        io.to(socketMembers).emit("edited-conversation", conversation);
    });
};
//# sourceMappingURL=conversations.js.map