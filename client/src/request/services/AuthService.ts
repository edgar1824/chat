import { redirect } from "react-router-dom";
import instance from "request/api";
import { IUser } from "types";

export class AuthService {
  static #route = "auth";

  static async logout() {
    await instance.get(`${this.#route}/logout`);
    localStorage.removeItem("access_token");
    return redirect("/auth/login");
  }

  static async login(values: FormData | Record<string, any>) {
    await instance.post(`${this.#route}/login`, values);
    return redirect("/");
  }

  static async register(values: FormData | Record<string, any>) {
    await instance.post(`${this.#route}/register`, values);
    return redirect("/");
  }

  static async getMyInfo() {
    const res = await instance.get<IUser>(`users/my-info`);
    return res.data;
  }
}
