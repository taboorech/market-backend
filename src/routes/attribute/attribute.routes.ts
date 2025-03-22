import { Router } from "express";
import { authMiddleware } from "../../middleware/auth-middleware";
import sellerRole from "../../middleware/seller-role";
import { createAttribute, createGroup, getAttributesByGroup, getGroups } from "./attribute.controller";

const createAttributeRoutes = () => {
  const router = Router();

  router.post('/group', authMiddleware, sellerRole, createGroup);
  router.post('/', authMiddleware, sellerRole, createAttribute);
  router.get('/groups', authMiddleware, sellerRole, getGroups);
  router.get('/attributes-by-group', authMiddleware, sellerRole, getAttributesByGroup);

  return router;
};

export { createAttributeRoutes };