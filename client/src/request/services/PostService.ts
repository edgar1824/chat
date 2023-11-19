import { formFn } from "helpers";
import instance from "request/api";
import { IPost, IUser } from "types";
import { IService } from "types/requests";

export class PostService {
  static #route = "posts";
  static async create(values: IPost, config?: IService["config"]) {
    const fd = formFn.toFormData(values);
    const res = await instance.post<IPost>(this.#route, fd, config);
    return res;
  }
  static async getMine(config?: IService["config"]) {
    const res = await instance.get<IPost[]>(`${this.#route}/my-posts`, config);
    return res;
  }
  static async getNewPosts(config?: IService["config"]) {
    const newPosts = await instance.get<IPost<IUser>[]>(
      `${this.#route}/get-new-posts`,
      config
    );
    return newPosts;
  }
  static async getById(id: string, config?: IService["config"]) {
    const post = await instance.get<IPost<IUser>[]>(
      `${this.#route}/${id}`,
      config
    );
    return post;
  }
  static async addLike(postId: string, config?: IService["config"]) {
    const post = await instance.put<IPost>(
      `${this.#route}/add-like`,
      { postId },
      config
    );
    return post;
  }
  static async deleteLike(postId: string, config?: IService["config"]) {
    const post = await instance.put<IPost>(
      `${this.#route}/delete-like`,
      { postId },
      config
    );
    return post;
  }
  static async addWatched(postId: string, config?: IService["config"]) {
    const post = await instance.put<IPost>(
      `${this.#route}/add-watched`,
      { postId },
      config
    );
    return post;
  }
}

// PostService.getById("6537ac42795428cbacaf2678")
//   .then((e) => {
//     console.log(e);
//   })
//   .catch((err) => {
//     console.error(err);
//   });
