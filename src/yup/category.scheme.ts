import * as yup from 'yup';
import { paginationValidation } from './main.scheme';

const getAllCategoriesValidation = yup.object().shape({}).concat(paginationValidation);

const createCategoryValidation = yup.object().shape({
  title: yup
    .string()
    .min(3, 'Category title must contain at least 3 symbols')
    .max(30, 'Category title must contain at most 30 symbols')
    .required('Title must contain value'),
  parentId: yup
    .number()
    .integer()
    .nullable()
    .optional()
});

const deleteCategoryValidation = yup.object().shape({
  id: yup.number().required('Category id can\'t be empty'),
});

export { getAllCategoriesValidation, createCategoryValidation, deleteCategoryValidation };