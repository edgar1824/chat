import dotenv from "dotenv";
dotenv.config();
// export const accessControlConfig = (req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   // res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// };
export const accessControlConfig = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
};
//# sourceMappingURL=accessControlConfig.js.map