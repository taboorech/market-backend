import { NextFunction, Request, Response } from "express";
import { UserRole } from "../libs/enum/user-role.enum";

const adminRole = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== UserRole.ADMIN) {
    res.status(403).json({ message: "Access denied. Admins only." });
    return;
  }
  next();
};

export default adminRole;