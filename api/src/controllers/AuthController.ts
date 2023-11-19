import { RequestHandler } from "types/index.js";
import { createError } from "../helpers/createError.js";
import { AuthService } from "../services/index.js";
import TokenService from "../services/TokenService.js";

const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;

class AuthController {
  static register: RequestHandler = async (req, res, next) => {
    try {
      const { refresh_token, access_token } = await AuthService.register(
        req.body
      );
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        maxAge: 30 * DAY_MILLISECONDS,
      });
      res.status(200).json({ access_token });
    } catch (err) {
      next(err);
    }
  };
  static login: RequestHandler = async (req, res, next) => {
    try {
      const { refresh_token, access_token } = await AuthService.login(req.body);
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        maxAge: 30 * DAY_MILLISECONDS,
      });
      res.status(200).json({ access_token });
    } catch (err) {
      next(err);
    }
  };
  static logout: RequestHandler = async (req, res, next) => {
    try {
      req.logout((err) => {
        if (err) throw err;
      });
      const { refresh_token } = req.cookies;
      await TokenService.remove(refresh_token);
      req._user = null;
      res.clearCookie("refresh_token");
      res.status(200).send("succesfully logged out");
    } catch (err) {
      next(err);
    }
  };
  static refresh: RequestHandler = async (req, res, next) => {
    const { refresh_token } = req.cookies;
    try {
      const { tokens, user } = await AuthService.refresh(refresh_token);
      res
        .cookie("refresh_token", refresh_token, {
          httpOnly: true,
          maxAge: 7 * DAY_MILLISECONDS,
        })
        .status(200)
        .json({
          access_token: tokens.access_token,
        });
    } catch (err) {
      next(err);
    }
  };
  static registerByGoogle: RequestHandler = async (req, res, next) => {
    try {
      if (req.user) {
        const userData = {
          username: req.user?.name?.givenName,
          email: req.user?.emails?.[0]?.value,
          img: req.user?._json?.picture,
          googleId: req.user?.id,
        };
        const { refresh_token, ...rest } = await AuthService.registerByGoogle(
          userData
        );
        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          maxAge: 30 * DAY_MILLISECONDS,
        });
        return res.status(200).json(rest);
      }
      next(createError(404, "No user got"));
    } catch (err) {
      next(err);
    }
  };
}

export default AuthController;
