import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from "express";
import { UserRole } from "../libs/enum/user-role.enum";

const sellerRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== UserRole.SELLER && req.user.role !== UserRole.ADMIN)) {
    res.status(403).json({ message: "Access denied. Seller or admin only." });
    return;
  }
  next();
});

export default sellerRole;