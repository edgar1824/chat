import { AxiosRequestConfig } from "axios";
import instance from "request/api";
import { socket } from "socket";
import { INotif, IUser } from "types";

export class NotificationService {
  static #route = "notifications";

  static async delete(id: string) {
    const resp = await instance.delete(`${this.#route}/${id}`);
    return { ...resp, message: "Notification was deleted succesfully" };
  }

  static async create(notif: Record<string, any>) {
    const res = await instance.post<INotif>(this.#route, notif);
    socket.emit("send-notification", res.data);
    return { ...res, message: "Notification is sent" };
  }

  static async getSentNotifs() {
    const res = await instance.get<INotif<string, IUser[]>[]>(
      `${this.#route}/sent-notifs`
    );
    return res.data;
  }

  static async getNotifs(config: AxiosRequestConfig) {
    const res = await instance.get<Omit<INotif, "recievers" | "sender">>(
      `${this.#route}/in-box`,
      config
    );
    return res.data;
  }
}
