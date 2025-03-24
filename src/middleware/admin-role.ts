import { NextFunction, Request, Response } from "express";
import { UserRole } from "../libs/enum/user-role.enum";
import { CustomError } from "../libs/classes/custom-error.class";

const adminRole = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== UserRole.ADMIN) {
    throw new CustomError(403, "Access denied. Admins only.");
  }
  next();
};

export default adminRole;