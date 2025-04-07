import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { getCart } from '../../repository/cart';
import { CustomError } from '../../libs/classes/custom-error.class';
import Order from '../../models/order.model';
import { OrderStatus } from '../../libs/enum/order-status.enum';
import OrderItem from '../../models/order-item.model';
import Cart from '../../models/cart.model';
import { updateOrderStatusValidation } from '../../yup/order.scheme';

const createOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.id;

  const cartItems = await getCart(req.user);

  if (cartItems.length === 0) {
    throw new CustomError(400, "Your cart is empty");
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (+item.product?.price || 0) * item.quantity, 0);

  await Order.transaction(async (trx) => {
    const newOrder = await Order.query(trx).insert({
      user_id: userId,
      total_price: totalPrice,
      status: OrderStatus.PENDING,
    });

    const orderItems = cartItems.map((item) => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: +item.product?.price || 0,
    }));

    await OrderItem
      .query(trx)
      .toKnexQuery()
      .insert(orderItems)
      .onConflict()
      .ignore();

    await Cart.query(trx).where("user_id", userId).del();

    res.sendStatus(201);
  });
});

const updateOrderStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { order: orderId, status } = await updateOrderStatusValidation.validate({ ...req.params, ...req.body });

  const order = await Order.query().findById(orderId);

  if (!order) {
    throw new CustomError(404, "Order not found");
  }

  await order.$query().patchAndFetch({ status });

  res.sendStatus(200);
});

export { createOrder, updateOrderStatus };