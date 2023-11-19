import { formFn } from "../helpers/formFns.js";
export const convertToObj = (req, res, next) => {
    if (req.body &&
        req?.headers?.["content-type"]?.includes("multipart/form-data")) {
        const newBody = formFn.reConvert(req.body);
        req.body = newBody;
    }
    next();
};
//# sourceMappingURL=convertToObj.js.map