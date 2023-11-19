import { createError } from "../helpers/createError.js";
import TokenService from "../services/TokenService.js";
import { RequestHandler } from "../types/index.js";

export const verifyToken: RequestHandler = (req, res, next) => {
  const authorizationHeaders = req.headers.authorization;
  if (!authorizationHeaders) {
    return next(createError(401, "You are not authenticated!"));
  }
  const access_token = authorizationHeaders.split(" ")[1];
  if (!access_token) {
    return next(createError(401, "You are not authenticated!"));
  }
  const userData = TokenService.validateAccessToken(access_token);
  if (!userData) {
    return next(createError(403, "Token is not valid!"));
  }
  req._user = userData;
  next();
};

export const verifyUser = [
  verifyToken,
  ((req, res, next) => {
    if (req._user._id.toString() === req.params.id || req._user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
    // })
  }) as RequestHandler,
];

export const verifyAdmin = [
  verifyToken,
  ((req, res, next) => {
    if (req._user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not Admin!"));
    }
  }) as RequestHandler,
];
