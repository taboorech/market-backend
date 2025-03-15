import { Router } from "express";
import multer from "multer";
import { multerStorage } from "../../libs/constantas/multer.const";
import { getAllUsers, getCart, getOrders, getUserInfo, updateUserInfo, updateUserRole } from "./user.controller";
import adminRole from "../../middleware/admin-role";

const createUserRoutes = () => {
  const router = Router();

  const uploads = multer({ storage: multerStorage });
  
  router.get('/', getUserInfo);
  router.get('/all', getAllUsers);
  router.patch('/', uploads.single('image'), updateUserInfo);
  router.get('/cart', getCart);
  router.get('/orders', getOrders);
  router.patch('/role/:user', adminRole, updateUserRole);

  return router;
};

export { createUserRoutes };