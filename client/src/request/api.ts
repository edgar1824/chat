import axios, { AxiosError } from "axios";
import { userHandler } from "../helpers";

const baseURL = process.env.REACT_APP_API_URL;

let reloadCount = 0;
const instance = axios.create({
  baseURL,
  withCredentials: true,

  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

// instance.defaults.withCredentials = true;

instance.interceptors.request.use(
  (config) => {
    if (userHandler.getToken()) {
      config.headers.Authorization = `Bearer ${userHandler.getToken()}`;
    }
    return config;
  },
  (err) => {
    throw err;
  }
);

instance.interceptors.response.use(
  (config) => {
    const data = config.data;
    if (data?.access_token) {
      userHandler.setToken(data.access_token);
    }
    return config;
  },
  async (err) => {
    if (err?.response?.data?.message === "jwt expired") {
      try {
        const res = await axios.get(`${baseURL}auth/refresh`, {
          withCredentials: true,
        });
        const { access_token } = res.data;
        userHandler.setToken(access_token);

        return await instance.request(err.config);
      } catch (error) {
        if (
          error instanceof AxiosError &&
          error?.response?.data?.status === 401
        ) {
          window.open("/auth/login", "_self");
        } else {
          console.log(error);
          throw error;
        }
      }
    } else if (err?.response?.data?.status === 401) {
      window.open(`/auth/login`, "_self");
    }

    console.log(err);
    throw err;
  }
);

export default instance;
