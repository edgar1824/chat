import { ISocketUser } from "../types/index.js";

export class UserStore {
  users: ISocketUser[];
  constructor() {
    this.users = [];
  }

  addUser(
    userId: ISocketUser["userId"],
    socketId: ISocketUser["socketId"],
    username?: ISocketUser["username"],
    conversationId?: ISocketUser["conversationId"]
  ) {
    if (!this.users.some((user) => user.userId === userId)) {
      this.users.push({ userId, socketId, username, conversationId });
      return 1;
    }
  }

  join(
    userId: ISocketUser["userId"],
    conversationId: ISocketUser["conversationId"]
  ) {
    if (this.users.some((user) => user.userId === userId)) {
      this.users = this.users.map((p) => {
        if (p.userId === userId) {
          return {
            ...p,
            conversationId: conversationId,
          };
        }
        return { ...p, conversationId: "" };
      });
    }
  }
  removeUser(socketId: ISocketUser["socketId"]) {
    if (this.users.length) {
      this.users = this.users.filter((u) => u.socketId !== socketId);
    }
  }
  getUser(userId: ISocketUser["userId"]) {
    return this.users.find((u) => u.userId === userId);
  }
}
