import { Router } from "express";
import { optionalAuthMiddleware } from "../../middleware/optional-auth-middleware";
import { createCategory, getAll } from "./category.controller";
import { authMiddleware } from "../../middleware/auth-middleware";
import sellerRole from "../../middleware/seller-role";

const createCategoryRoutes = () => {
  const router = Router();

  router.post('/', authMiddleware, sellerRole, createCategory);
  router.get('/', optionalAuthMiddleware, getAll);

  return router;
};

export { createCategoryRoutes };