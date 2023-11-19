import { IConv, IEventHandler, IUser } from "../types/index.js";

export const conversationEvents: IEventHandler = (io, socket, userStore) => {
  socket.on(
    "create-conversation",
    ({
      members,
      _id,
      title,
      img,
    }: {
      members: string[];
      _id?: string;
      title?: string;
      img?: string;
    }) => {
      const socketMembers = members
        ?.map((member) => userStore.getUser(member)?.socketId)
        .filter(Boolean) as string[];
      io.to(socketMembers).emit("get-conversations", [
        { members, _id, title, img },
      ]);
    }
  );
  socket.on("delete-conversation", (convId: string, members: string[]) => {
    const socketUsers = userStore.users
      .filter((user) =>
        members?.length ? members?.includes(user?.userId!) : true
      )
      .map((user) => user.socketId) as string[];
    io.to(socketUsers).emit("removed-conversation", convId);
  });
  socket.on(
    "leave-conversation",
    ({
      conversationId,
      userId,
      members,
    }: {
      conversationId: string;
      userId: string;
      members: string[];
    }) => {
      console.log(members);

      const socketMembers = members?.map(
        (member) => userStore.getUser(member)?.socketId!
      );

      io.to(socketMembers).emit(
        "conversation-members",
        members?.filter((m) => m !== userId),
        conversationId
      );

      const onlineUser = userStore.getUser(userId);
      if (onlineUser && onlineUser.socketId) {
        io.to(onlineUser.socketId).emit("removed-conversation", conversationId);
      }
    }
  );
  socket.on(
    "add-user-to-conversation",
    ({ conversation, user }: { conversation: IConv; user: IUser }) => {
      io.to(conversation?._id!).emit(
        "conversation-members",
        [...conversation?.members!, user?._id],
        conversation._id
      );
      const isUser = userStore.getUser(user?._id);
      if (isUser && isUser.socketId) {
        io.to(isUser.socketId).emit("get-conversations", [conversation]);
      }
    }
  );
  socket.on("edit-conversation", (conversation: IConv) => {
    const socketMembers = conversation
      .members!.map((m) => userStore.getUser(m)?.socketId!)
      .filter((e) => !!e);
    io.to(socketMembers).emit("edited-conversation", conversation);
  });
};
