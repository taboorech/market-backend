import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Order from '../../models/order.model';
import { getCart as getCartDB } from '../../repository/cart';
import { changeUserRoleValidation, deleteUserValidation, getOrdersValidation, getUsersValidation, updateUserInfoValidation } from '../../yup/user.scheme';
import User from '../../models/user.model';
import { CustomError } from '../../libs/classes/custom-error.class';
import * as bcrypt from 'bcrypt';
import { unlink } from 'fs/promises';
import { basename } from 'path';

const getUserInfo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await User.query().findById(req.user.id).select("id", "firstName", "lastName", "email", "role", "image", "created_at");

  if (!user) {
    throw new CustomError(404, "User not found");
  }

  res.json(user);
});

const getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { offset, limit, search, ids } = await getUsersValidation.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
  });

  const usersRequest = User.query()
    .modify(builder => {
      if (ids && ids.length > 0) {
        builder.whereIn("id", ids);
      }

      if (search) {
        builder.where((builder) => {
          builder
            .whereILike("firstName", `%${search}%`)
            .orWhereILike("lastName", `%${search}%`)
            .orWhereILike("email", `%${search}%`);
        });
      }
    })

  const users = await usersRequest.offset(offset).limit(limit);
  const usersCount = await usersRequest.resultSize();
  
  res.json({ 
    data: users,
    total: usersCount
  });
});

const updateUserInfo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, password } = await updateUserInfoValidation.validate(req.body, { abortEarly: false });

  const user = await User.query().findById(req.user.id);

  if (!user) {
    throw new CustomError(404, "User not found");
  }

  const updatedData: Partial<User> = {};
  if (firstName) updatedData.firstName = firstName;
  if (lastName) updatedData.lastName = lastName;
  if (password) updatedData.password = await bcrypt.hash(password, 10);

  if(req.file) {
    const serverHost = `${req.protocol}://${req.get("host")}`;
    updatedData.image = `${serverHost}/${req.file.filename}`;

    if(!!user.image) {
      await unlink(`${process.env.UPLOADS_FOLDER}/${basename(user.image)}`);
    }
  }

  await user.$query().patch(updatedData);

  res.sendStatus(200);
});

const getCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const cartItems = await getCartDB(req.user);

  const formattedCart = cartItems.map((item) => ({
    product_id: item.product_id,
    title: item.product?.title,
    price: item.product?.price,
    quantity: item.quantity,
  }));

  res.json(formattedCart);
});

const getOrders = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { offset, limit, search, ids } = await getOrdersValidation.validate(req.query, { 
    abortEarly: false,
    stripUnknown: true
  });

  const ordersRequest = Order.query()
  .where("user_id", req.user.id)
  .withGraphFetched("[items.product, user]")
  .modifyGraph("items.product", (builder) => {
    builder.select("id", "title", "price");
  })
  .modifyGraph('user', builder => {
    builder.select("id", "firstName", "lastName")
  })
  .modify((builder) => {
    if (ids && ids.length > 0) {
      builder.whereIn("id", ids);
    }

    if (search) {
      builder.whereILike("id", `%${search}%`)
        .orWhereExists(
          Order.relatedQuery("items")
            .joinRelated("product")
            .whereILike("product.title", `%${search}%`)
        );
    }
  })
  .orderBy("created_at", "desc");

  const orders = await ordersRequest.offset(offset).limit(limit);
  const total = await ordersRequest.resultSize();

  res.json({
    total,
    data: orders
  });
});

const updateUserRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { user: userId, role } = await changeUserRoleValidation.validate({ ...req.params, ...req.body });

  const user = await User.query().findById(userId);

  if (!user) {
    throw new CustomError(404, "User not found");
  }

  await user.$query().patch({ role });

  res.sendStatus(200);
});

const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { user: userId } = await deleteUserValidation.validate(req.params, { abortEarly: false });

  const foundUser = await User.query().findOne({ id: userId });

  if(!foundUser)
    throw new CustomError(404, 'User not found');

  await foundUser.$query().delete();

  res.sendStatus(200);
})

export { getUserInfo, getAllUsers, updateUserInfo, getCart, getOrders, updateUserRole, deleteUser };