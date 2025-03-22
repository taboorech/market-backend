import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Category from '../../models/category.model';
import { createCategory as createCategoryRepository } from '../../repository/category';
import { createCategoryValidation, getAllCategoriesValidation } from '../../yup/category.scheme';

const createCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { title, parentId } = await createCategoryValidation.validate(req.body, { abortEarly: false });

  await createCategoryRepository({ category: title, parentId });

  res.sendStatus(201);
});

const getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { offset, limit, search, ids } = await getAllCategoriesValidation.validate(req.query, { abortEarly: false });

  const categoriesRequest = Category.query()
    .modify(builder => {
      if (search) {
        builder.whereILike("title", `%${search}%`);
      }
    
      if (ids && ids.length > 0) {
        builder.whereIn("id", ids);
      }
    });

  const total = await categoriesRequest.resultSize();
  const categories = await categoriesRequest.offset(offset).limit(limit);

  res.json({
    total,
    data: categories
  });
});

export { createCategory, getAll }