import { formFn } from "../helpers/formFns.js";
import path from "path";
import * as url from "url";
import pkg from "uuid";
const { v4: uuidv4 } = pkg;
const __dirname = url.fileURLToPath(new URL("../..", import.meta.url));
export const fileUploading = (req, res, next) => {
    if (req?.files) {
        const files = Object.values(req.files).flat(Infinity);
        if (files?.length) {
            let myFiles = {};
            Object.entries(req.files).forEach(([key, file]) => {
                const name = `${uuidv4()}${path.extname(file.name)}`;
                const uploadPath = `${__dirname}/public/${name}`;
                const httpName = `${process.env.API_URL}/public/${name}`;
                file.mv(uploadPath, (err) => {
                    if (err)
                        return next(err);
                });
                myFiles = Object.assign(myFiles, { [key]: httpName });
            });
            req.files = formFn.reConvert(myFiles);
        }
    }
    next();
};
//# sourceMappingURL=fileUploading.js.map