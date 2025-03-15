import { Router } from "express";
import multer from "multer";
import { multerStorage } from "../../libs/constantas/multer.const";
import { deleteUser, getAllUsers, getCart, getOrders, getUserInfo, updateUserInfo, updateUserRole } from "./user.controller";
import adminRole from "../../middleware/admin-role";

const createUserRoutes = () => {
  const router = Router();

  const uploads = multer({ storage: multerStorage });
  
  router.get('/', getUserInfo);
  router.get('/all', adminRole, getAllUsers);
  router.patch('/', uploads.single('image'), updateUserInfo);
  router.get('/cart', getCart);
  router.get('/orders', getOrders);
  router.patch('/role/:user', adminRole, updateUserRole);
  router.delete('/:user', adminRole, deleteUser);

  return router;
};

export { createUserRoutes };