import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import User from "../models/user.model";
import { CustomError } from "../libs/classes/custom-error.class";

const authMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (token === null || !token) {
    throw new CustomError(401, "There is no token in header");
  }

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as User;
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new CustomError(401, "Token has expired. Please log in again.");
    } else if (error instanceof JsonWebTokenError) {
      throw new CustomError(401, "Invalid token. Please log in again.");
    } else {
      throw new CustomError(500, "Authentication error. Please try again later.");
    }
  }
});

const refreshMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (token === null || !token) {
    throw new CustomError(401, "There is no token in header");
  }

  const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET) as User;
  if (!user) {
    throw new CustomError(401, "Token is Expired Login Again.");
  }

  req.user = user;
  next();
})

export { authMiddleware, refreshMiddleware };