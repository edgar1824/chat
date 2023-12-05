import https from "https";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import { createError } from "../helpers/createError.js";

const app_url = new URL(process.env.SOCKET_URL!);

const options = {
  hostname: app_url.hostname,
  port: app_url.port ? app_url.port : app_url.protocol === "https:" ? 443 : 80,
  path: "/check",
  method: "GET",
};

export const requestSocket = () => {
  let data = "";

  // return https
  return (options.hostname === "localhost" ? http : https)
    .request(options, (res) => {
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (!!data && !JSON?.parse?.(data)?.connected) {
          throw createError(404, "Socket didn't connect!");
        }
        console.log("Socket turned on");
      });
    })
    .on("error", (error) => console.error(error))
    .end();

  //   return data;
};
