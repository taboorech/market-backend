import * as yup from 'yup';

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

export { createCategoryValidation };