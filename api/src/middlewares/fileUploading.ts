import { UploadedFile } from "express-fileupload";
import { formFn } from "../helpers/formFns.js";
import path from "path";
import * as url from "url";
import pkg from "uuid";
import { RequestHandler } from "types/index.js";
const { v4: uuidv4 } = pkg;
const __dirname = url.fileURLToPath(new URL("../..", import.meta.url));

export const fileUploading: RequestHandler = (req, res, next) => {
  if (req?.files) {
    const files = Object.values(req.files).flat(Infinity);
    if (files?.length) {
      let myFiles = {};
      Object.entries(req.files).forEach(
        ([key, file]: [string, UploadedFile]) => {
          const name = `${uuidv4()}${path.extname(file.name)}`;
          const uploadPath = `${__dirname}/${path.join("public", name)}`;
          const httpName = `${process.env.API_URL}/${path.join(
            "public",
            name
          )}`;
          file.mv(uploadPath, (err) => {
            if (err) return next(err);
          });
          myFiles = Object.assign(myFiles, { [key]: httpName });
        }
      );
      req.files = formFn.reConvert(myFiles);
    }
  }

  next();
};
