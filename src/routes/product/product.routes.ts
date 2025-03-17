import { Router } from "express";
import { optionalAuthMiddleware } from "../../middleware/optional-auth-middleware";
import { authMiddleware } from "../../middleware/auth-middleware";
import sellerRole from "../../middleware/seller-role";
import multer from "multer";
import { multerStorage } from "../../libs/constantas/multer.const";
import { manageCart, createProduct, getProduct, getProductsByCategory, getAllProducts } from "./product.controller";

const createProductRoutes = () => {
  const router = Router();

  const uploads = multer({ storage: multerStorage });
  
  router.get('/all', optionalAuthMiddleware, getAllProducts);
  router.get('/:id', optionalAuthMiddleware, getProduct);
  router.get('/category/:category', optionalAuthMiddleware, getProductsByCategory);
  router.post('/', authMiddleware, sellerRole, uploads.array('images'), createProduct);
  router.post('/cart/:product', authMiddleware, manageCart);

  return router;
};

export { createProductRoutes };