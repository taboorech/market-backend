import { Router } from "express";
import { optionalAuthMiddleware } from "../../middleware/optional-auth-middleware";
import { authMiddleware } from "../../middleware/auth-middleware";
import { createComment, deleteComment, getCommentsByProduct, updateComment } from "./comment.controller";

const createCommentRoutes = () => {
  const router = Router();

  router.get('/:product', optionalAuthMiddleware, getCommentsByProduct);
  router.post('/:product', authMiddleware, createComment);
  router.patch('/:id', authMiddleware, updateComment);
  router.delete('/:id', authMiddleware, deleteComment);

  return router;
};

export { createCommentRoutes };