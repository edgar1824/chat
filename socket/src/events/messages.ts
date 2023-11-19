import { DBDocument, IEventHandler, IMessage } from "../types/index.js";

export const messageEvents: IEventHandler = (io, socket, userStore) => {
  socket.on(
    "send-message",
    ({
      sender,
      conversationId,
      ...rest
    }: {
      sender: string;
      audio: File;
      text: string;
      conversationId: string;
      username: string;
      device: string;
      members: string[];
      message: string;
    } & DBDocument) => {
      const message = {
        sender,
        conversationId,
        ...rest,
      };
      io.to(conversationId).emit("get-message", message);
    }
  );
  socket.on(
    "last-message",
    (members: string[], conversationId: string, message: IMessage) => {
      const mySender = userStore.getUser(message?.sender);
      const socketMembers = members
        .map((m) => userStore.getUser(m)?.socketId!)
        .filter((e) => !!e);

      io.to(socketMembers).emit("get-last-message", conversationId, {
        ...message,
        username: mySender?.username,
      });
    }
  );
  socket.on(
    "typing",
    ({
      userId,
      conversationId,
      isTyping,
      members,
    }: {
      userId: string;
      conversationId: string;
      isTyping: boolean;
      members: string[];
    }) => {
      const socketFrineds = members
        .map((m) => userStore.getUser(m)?.socketId!)
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
    }
  );
  socket.on("message-watched", (message: IMessage) => {
    io.to(message?.conversationId!).emit("get-message-watched", message);
  });
  socket.on("delete-message", (messageId: string, convId: string) => {
    io.to(convId).emit("deleted-message", messageId, convId);
  });
};
