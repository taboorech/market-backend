import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { createCommentValidation, deleteCommentValidation, getCommentsByProductValidation, updateCommentValidation } from '../../yup/comment.scheme';
import Product from '../../models/product.model';
import { CustomError } from '../../libs/classes/custom-error.class';
import Comment from '../../models/comment.model';
import { UserRole } from '../../libs/enum/user-role.enum';
import { assertUserAccess } from '../../utils/check-role';

const getCommentsByProduct = asyncHandler(async (req: Request, res: Response) => {
  const { 
    product: product_id, 
    limit, 
    offset, 
    ids 
  } = await getCommentsByProductValidation.validate({ ...req.params, ...req.query }, { abortEarly: false });

  const commentsRequest = Comment.query()
    .where("product_id", product_id)
    .withGraphFetched("user")
    .modifyGraph('user', builder => {
      builder.select('id', 'firstName', 'lastName', 'role', 'image')
    })
    .modify(builder => {
      if(ids) {
        builder.whereIn('id', ids);
      }
    })
    .orderBy("created_at", "desc");

  const total = await commentsRequest.resultSize();
  const comments = await commentsRequest.limit(limit).offset(offset);

  res.json({
    total,
    data: comments
  });
});

const createComment = asyncHandler(async (req: Request, res: Response) => {
  const { product: product_id, content } = await createCommentValidation.validate({ ...req.params, ...req.body }, { abortEarly: false });

  const product = await Product.query().findOne({ id: product_id });

  if(!product) {
    throw new CustomError(404, 'Product not found');
  }

  const comment = await Comment.query().insert({
    user_id: req.user.id,
    product_id: product.id,
    content
  });

  res.sendStatus(201);
});

const updateComment = asyncHandler(async (req: Request, res: Response) => {
  const { id, content } = await updateCommentValidation.validate({ ...req.params, ...req.body }, { abortEarly: false });

  const comment = await Comment.query().findOne({ id });

  if (!comment) {
    throw new CustomError(404, "Comment not found");
  }

  assertUserAccess({
    user: req.user,
    ownerId: comment.user_id,
    allowedRoles: [UserRole.ADMIN],
    message: "You are not allowed to update this comment",
  });

  await Comment
    .query()
    .patch({ id, content })

  res.sendStatus(200);
});

const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = await deleteCommentValidation.validate(req.params, { abortEarly: false });

  const comment = await Comment.query().findOne({ id });
  if (!comment) {
    throw new CustomError(404, "Comment not found");
  } 

  assertUserAccess({
    user: req.user,
    ownerId: comment.user_id,
    allowedRoles: [UserRole.ADMIN],
    message: "You are not allowed to delete this comment",
  });

  await comment.$query().delete();

  res.sendStatus(200);
});

export { getCommentsByProduct, createComment, updateComment, deleteComment };