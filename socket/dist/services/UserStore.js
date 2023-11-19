export class UserStore {
    constructor() {
        this.users = [];
    }
    addUser(userId, socketId, username, conversationId) {
        if (!this.users.some((user) => user.userId === userId)) {
            this.users.push({ userId, socketId, username, conversationId });
            return 1;
        }
    }
    join(userId, conversationId) {
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
    removeUser(socketId) {
        if (this.users.length) {
            this.users = this.users.filter((u) => u.socketId !== socketId);
        }
    }
    getUser(userId) {
        return this.users.find((u) => u.userId === userId);
    }
}
//# sourceMappingURL=UserStore.js.map