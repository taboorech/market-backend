import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Category from '../../models/category.model';
import { createCategory as createCategoryRepository, deleteCategory as deleteCategoryRepository } from '../../repository/category';
import { createCategoryValidation, deleteCategoryValidation, getAllCategoriesValidation } from '../../yup/category.scheme';

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

const deleteCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = await deleteCategoryValidation.validate(req.params, { abortEarly: false });

  await deleteCategoryRepository(id);

  res.sendStatus(200);
});

export { createCategory, getAll, deleteCategory }