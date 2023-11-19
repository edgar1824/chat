var _a;
import bcrypt from "bcryptjs";
import { createError } from "../helpers/createError.js";
import Token from "../models/Token.js";
import User from "../models/User.js";
import TokenService from "./TokenService.js";
export class AuthService {
}
_a = AuthService;
AuthService.register = async (body) => {
    const user = await User.findOne({
        username: body.username,
        email: body.email,
    });
    if (user)
        throw createError(401, "email or username is already taken");
    if (body.password) {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword;
    }
    const newUser = new User({ ...body });
    await newUser.save();
    const tokens = TokenService.generateTokens({
        _id: newUser._id,
        isAdmin: newUser.isAdmin,
    });
    await TokenService.saveToken(newUser._id, tokens.refresh_token);
    return { ...tokens };
};
AuthService.registerByGoogle = async (body) => {
    let user;
    const candidate = await User.findOne({
        email: body.email,
        googleId: body.googleId,
    });
    if (candidate) {
        user = candidate;
    }
    else {
        user = new User({ ...body });
        await user.save();
    }
    const tokens = TokenService.generateTokens({
        _id: user._id,
        isAdmin: user.isAdmin,
    });
    await TokenService.saveToken(user._id, tokens.refresh_token);
    return { ...tokens };
};
AuthService.login = async (body) => {
    const user = await User.findOne({ username: body.username });
    if (!user)
        throw createError(404, "User not found");
    const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
    if (!isPasswordCorrect)
        throw createError(400, "Password is incorrect");
    const tokens = TokenService.generateTokens({
        _id: user._id,
        isAdmin: user.isAdmin,
    });
    await TokenService.saveToken(user._id, tokens.refresh_token);
    return { ...tokens };
};
AuthService.refresh = async (refresh_token) => {
    const token_data = TokenService.validateRefreshToken(refresh_token);
    if (!token_data)
        throw createError(401, "Not Authenticated");
    const userData = await Token.findOne({ userId: token_data._id });
    if (!userData)
        throw createError(401, "Not Authenticated");
    const user = await User.findOne({ _id: userData.userId });
    const tokens = TokenService.generateTokens({
        _id: user._id,
        isAdmin: user.isAdmin,
    });
    await TokenService.saveToken(user._id, tokens.refresh_token);
    const { password, ...rest } = user;
    return { user: { ...rest }, tokens };
};
//# sourceMappingURL=AuthService.js.map