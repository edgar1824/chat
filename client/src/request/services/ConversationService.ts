import { formFn } from "helpers";
import instance from "request/api";
import { socket } from "socket";
import { IService } from "types/requests";
import { MessageService } from "./MessageService";
import { IUser } from "types";
import { redirect } from "react-router-dom";

type IData = IService<{
  sender?: string;
  audio?: string;
  text?: string;
  conversationId?: string;
  username?: string;
  device?: string;
  members: string[];
}>;

export class ConversationService {
  static #route: string = "conversations";
  static async create(data: IData["model"]) {
    const formData = formFn.toFormData({ ...data });
    const res = await instance.post<IData["model"]>(this.#route, formData);
    socket.emit("create-conversation", { ...res.data });
    return res;
  }
  static async createDialogue({ id }: { id?: string }) {
    const conv = await instance.post("conversations/to-dialogue", {
      friendId: id,
    });
    if (conv.data?.new) {
      socket.emit("create-conversation", conv.data);
    }
    return redirect(`/chat/${conv.data?._id}`);
  }
  static async delete({
    conversationId,
    members,
  }: {
    conversationId: string;
    members: string;
  }) {
    const res = await instance.delete(`${this.#route}/${conversationId}`);
    console.log(res);
    socket.emit("delete-conversation", conversationId, members);
    return redirect("/chat");
  }
  static async addUser({
    id,
    currentConv,
    members,
    user,
    conversationId,
    me,
  }: {
    id?: string;
    currentConv?: Record<string, any>;
    members?: string[];
    user?: IUser;
    conversationId?: string;
    me?: IUser;
  }) {
    const res = await instance.put<IData["model"]>(
      `${this.#route}/add-user/${conversationId}`,
      { userId: id }
    );

    await MessageService.create({
      conversationId: conversationId,
      text: `${me?.username} added ${user?.username} to group`,
      sender: process.env.REACT_APP_CHAT_GROUP_MESSAGE_ID,
    });
    socket.emit("add-user-to-conversation", {
      conversation: { ...currentConv, members },
      user,
    });
    return { ...res, message: "User added succesfully" };
  }
  static async deleteUser({
    id,
    members,
    user,
    conversationId,
    me,
  }: {
    id?: string;
    members: string[];
    user?: IUser;
    conversationId?: string;
    me?: IUser;
  }) {
    const res = await instance.put(
      `conversations/delete-user/${conversationId}`,
      { userId: id }
    );

    await MessageService.create({
      conversationId: conversationId,
      text: `${me?.username} removed ${user?.username} from the group`,
      sender: process.env.REACT_APP_CHAT_GROUP_MESSAGE_ID,
    });
    socket.emit("leave-conversation", {
      conversationId: conversationId,
      userId: id,
      members,
    });
    return { message: "User removed succesfully", ...res };
  }
  static async edit({
    conversationId,
    formData,
  }: {
    conversationId?: string;
    formData?: FormData;
  }) {
    const res = await instance.put<IData["model"]>(
      `${this.#route}/edit/${conversationId}`,
      formData
    );
    socket.emit("edit-conversation", res.data);
    return { message: "Edited succesfully", ...res };
  }
  static async leave({
    conversationId,
    members,
    me,
  }: {
    conversationId?: string;
    members: string[];
    me?: IUser;
  }) {
    const res = await instance.put(
      `${this.#route}/delete-user/${conversationId}`,
      { userId: me?._id }
    );

    if (res.data?.type === "removed") {
      socket.emit("delete-conversation", conversationId, members);
      return redirect("/chat");
    }

    await MessageService.create({
      conversationId: conversationId,
      text: `${me?.username} left the group`,
      sender: process.env.REACT_APP_CHAT_GROUP_MESSAGE_ID,
    });

    socket.emit("leave-conversation", {
      conversationId: conversationId,
      userId: me?._id,
      members,
    });
    return redirect("/chat");
  }
  static async setAdmin({
    conversationId,
    userId,
  }: {
    conversationId?: string;
    userId?: string;
  }) {
    const res = await instance.put(
      `${this.#route}/make-admin/${conversationId}`,
      {
        userId,
      }
    );
    return { message: "User changed to admin", ...res };
  }
  static async unsetAdmin({
    conversationId,
    userId,
  }: {
    conversationId?: string;
    userId?: string;
  }) {
    const res = await instance.put(
      `conversations/unmake-admin/${conversationId}`,
      { userId }
    );
    return { message: "Admin changed to user", ...res };
  }
  static async setLastMessage(convId?: string) {
    const res = await instance.put(`${this.#route}/last-message/${convId}`);
    return res.data;
  }
}
