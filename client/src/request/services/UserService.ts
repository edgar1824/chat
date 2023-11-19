import { redirect } from "react-router-dom";
import instance from "request/api";
import { socket } from "socket";
import { NotificationService } from "./NotificationService";
import { AxiosRequestConfig } from "axios";
import { convertSearchParamsStr } from "helpers";

export class UserService {
  static #route = "users";

  static async addFriend({
    notifId,
    friendId,
  }: {
    notifId: string;
    friendId: string;
  }) {
    const resp = await NotificationService.delete(notifId);
    const res = await instance.put(`users/add-friend`, { friendId });
    socket.emit("send-notification", res.data.notif);
    socket.emit("add-friend", res.data);
    return redirect("/notifications/inbox");
  }

  static async deleteFriend({ friendId }: { friendId: string }) {
    const res = await instance.put("users/delete-friend", { friendId });
    socket.emit("send-notification", res.data.notif);
    socket.emit("remove-friend", res.data);
    if (res.data?.deletedConv) {
      socket.emit("delete-conversation", res.data?.deletedConv);
    }
    return res;
  }
  static async getFriends(
    { page = 1, limit = 6 } = {},
    config?: AxiosRequestConfig<any>
  ) {
    const friends = await instance.get(
      `users/friends?${convertSearchParamsStr({ page, limit })}`,
      config
    );
    return friends.data;
  }
  // { page, limit, exclude, select, include }
  static async getUsers(query: Record<string, any>) {
    const search = convertSearchParamsStr({ ...query });
    const users = await instance.get(`users/not-private?${search}`);
    return users.data;
  }
}
