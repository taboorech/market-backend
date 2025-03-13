import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Category from '../../models/category.model';
import { createCategory as createCategoryRepository } from '../../repository/category';
import { createCategoryValidation } from '../../yup/category.scheme';

const createCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { title, parentId } = await createCategoryValidation.validate(req.body, { abortEarly: false });

  await createCategoryRepository({ category: title, parentId });

  res.sendStatus(201);
});

const getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const categories = await Category.query();

  res.json(categories);
});

export { createCategory, getAll }