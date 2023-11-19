var _a;
import { createError } from "../helpers/createError.js";
import { AuthService } from "../services/index.js";
import TokenService from "../services/TokenService.js";
const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
class AuthController {
}
_a = AuthController;
AuthController.register = async (req, res, next) => {
    try {
        const { refresh_token, access_token } = await AuthService.register(req.body);
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            maxAge: 30 * DAY_MILLISECONDS,
        });
        res.status(200).json({ access_token });
    }
    catch (err) {
        next(err);
    }
};
AuthController.login = async (req, res, next) => {
    try {
        const { refresh_token, access_token } = await AuthService.login(req.body);
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            maxAge: 30 * DAY_MILLISECONDS,
        });
        res.status(200).json({ access_token });
    }
    catch (err) {
        next(err);
    }
};
AuthController.logout = async (req, res, next) => {
    try {
        req.logout((err) => {
            if (err)
                throw err;
        });
        const { refresh_token } = req.cookies;
        await TokenService.remove(refresh_token);
        req._user = null;
        res.clearCookie("refresh_token");
        res.status(200).send("succesfully logged out");
    }
    catch (err) {
        next(err);
    }
};
AuthController.refresh = async (req, res, next) => {
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
    }
    catch (err) {
        next(err);
    }
};
AuthController.registerByGoogle = async (req, res, next) => {
    try {
        if (req.user) {
            const userData = {
                username: req.user?.name?.givenName,
                email: req.user?.emails?.[0]?.value,
                img: req.user?._json?.picture,
                googleId: req.user?.id,
            };
            const { refresh_token, ...rest } = await AuthService.registerByGoogle(userData);
            res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                maxAge: 30 * DAY_MILLISECONDS,
            });
            return res.status(200).json(rest);
        }
        next(createError(404, "No user got"));
    }
    catch (err) {
        next(err);
    }
};
export default AuthController;
//# sourceMappingURL=AuthController.js.map