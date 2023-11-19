import { Axios, AxiosRequestConfig } from "axios";
import { formFn } from "helpers";
import instance from "request/api";
import { socket } from "socket";
import { IService } from "types/requests";

type IData = IService<{
  sender?: string;
  audio?: File;
  text?: string;
  conversationId?: string;
  username?: string;
  device?: string;
  members?: string[];
  message?: string;
}>;

export class MessageService {
  static #route: string = "messages";

  static async create(values?: IData["model"], config?: IData["config"]) {
    let message: any = values;
    Object.entries(message).forEach(
      ([k, v]) => v ?? delete message[k as keyof IData["model"]]
    );
    if (message?.audio) message = formFn.toFormData(message);

    const res = await instance.post<IData["model"]>(this.#route, message);
    socket.emit("send-message", res.data);
    if (values?.members) {
      socket.emit(
        "last-message",
        values.members,
        values.conversationId,
        res.data
      );
    }

    return res.data;
  }

  static async watched(
    id?: string,
    userId?: string,
    config?: AxiosRequestConfig
  ) {
    const res = await instance.put<IData["model"]>(
      `${this.#route}/watched/${id}`,
      { userId },
      config
    );
    socket.emit("message-watched", res.data);
    return { message: "Message has been watched", ...res };
  }

  static async delete({
    messageId,
    convId,
  }: {
    messageId?: string;
    convId?: string;
  }) {
    const res = await instance.delete<IData["resp"]>(
      `messages/delete/${messageId}`
    );
    socket.emit("delete-message", messageId, convId);
    return res;
  }
}
