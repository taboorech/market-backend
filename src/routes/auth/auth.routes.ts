import { Router } from "express";
import { signUp, login, logout, refreshTokens } from "./auth.controller";
import { authMiddleware, refreshMiddleware } from "../../middleware/auth-middleware";

const createAuthRoutes = () => {
  const router = Router();

  router.post('/signup', signUp);
  router.post('/login', login);
  router.get('/logout', authMiddleware, logout);
  router.get('/refresh', refreshMiddleware, refreshTokens);

  return router;
};

export { createAuthRoutes };