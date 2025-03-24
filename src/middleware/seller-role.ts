import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from "express";
import { UserRole } from "../libs/enum/user-role.enum";
import { CustomError } from '../libs/classes/custom-error.class';

const sellerRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== UserRole.SELLER && req.user.role !== UserRole.ADMIN)) {
    throw new CustomError(403, "Access denied. Seller or admin only.");
  }
  next();
});

export default sellerRole;