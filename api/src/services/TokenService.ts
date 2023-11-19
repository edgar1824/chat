import jwt from "jsonwebtoken";
import Token from "../models/Token.js";

class TokenService {
  static generateTokens = (data) => {
    const access_token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });
    const refresh_token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });
    return { access_token, refresh_token };
  };
  static validateRefreshToken = (token) => {
    const data = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return data;
  };
  static validateAccessToken = (token) => {
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return data;
  };
  static saveToken = async (id, token) => {
    const candidate = await Token.findOne({ userId: id });
    if (candidate) {
      candidate.token = token;
      await candidate.save();
      return candidate;
    }
    const refresh_token = new Token({ token, userId: id });
    await refresh_token.save();
    return refresh_token;
  };
  static remove = async (token) => {
    const deleted = await Token.deleteOne({ token });
    return deleted;
  };
}

export default TokenService;
