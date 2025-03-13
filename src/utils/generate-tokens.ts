import jwt, { SignOptions } from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import User from "../models/user.model";

const generateTokens = async (user: User) => {
  try {
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES } as SignOptions
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES } as SignOptions
    );

    const securedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await User.query().patchAndFetchById(user.id, {
      refreshToken: securedRefreshToken
    });

    return Promise.resolve({ accessToken, refreshToken });

  } catch (err) {
    return Promise.reject(err);
  }
};

export { generateTokens };