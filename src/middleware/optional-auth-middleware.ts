import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import User from "../models/user.model";
import { CustomError } from "../libs/classes/custom-error.class";

const optionalAuthMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next();
  }

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as User;
    req.user = user;
  } catch (error) {
    if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
      return next();
    } else {
      throw new CustomError(500, "Authentication error. Please try again later.");
    }
  }
  next();
});

export { optionalAuthMiddleware };
