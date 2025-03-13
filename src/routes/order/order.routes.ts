import { Router } from "express";
import { authMiddleware } from "../../middleware/auth-middleware";
import { createOrder, updateOrderStatus } from "./order.controller";

const createOrderRoutes = () => {
  const router = Router();

  router.post('/', authMiddleware, createOrder);
  router.patch('/:order', authMiddleware, updateOrderStatus);

  return router;
};

export { createOrderRoutes };