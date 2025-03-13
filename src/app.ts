import express from 'express';
import bodyParser from 'body-parser';
import { errorHandler } from './middleware/error-handler';
import cors from "cors";
import { createCategoryRoutes } from './routes/category/category.routes';
import { createAuthRoutes } from './routes/auth/auth.routes';
import { createProductRoutes } from './routes/product/product.routes';
import { authMiddleware } from './middleware/auth-middleware';
import { createUserRoutes } from './routes/user/user.routes';
import { createOrderRoutes } from './routes/order/order.routes';

function createServer() {
  const app = express();

  app.use(cors({
    origin: [
      'http://localhost:5173'
    ]
  }));

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('uploads'));

  // routes
  app.use('/auth', createAuthRoutes());
  app.use('/category', createCategoryRoutes());
  app.use('/product', createProductRoutes());
  app.use('/user', authMiddleware, createUserRoutes());
  app.use('/order', createOrderRoutes());

  // error handler
  app.use(errorHandler);

  return app;
}

export { createServer };