import instance from "request/api";
import { IComment } from "types";

export class CommentService {
  static #route = "comments";

  static async getOfPost<T>(postId: string) {
    const resp = await instance.get<T[]>(`${this.#route}/of-post/${postId}`);
    return { ...resp };
  }

  static async create(comment: Required<Pick<IComment, "desc" | "postId">>) {
    const res = await instance.post<IComment>(this.#route, comment);
    return { ...res };
  }
}
