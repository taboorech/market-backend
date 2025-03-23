import * as yup from 'yup';
import { ManageCartType } from '../libs/enum/manage-cart-type.enum';
import { paginationValidation } from './main.scheme';

const createProductValidation = yup.object().shape({
  title: yup
    .string()
    .trim()
    .min(3, 'Title must contain more than 2 symbols')
    .max(50, 'Title must contain less than 16 symbols')
    .required('Title is required'),
  description: yup
    .string()
    .trim()
    .nullable(),
  upc: yup
    .string()
    .matches(/^\d+$/, 'UPC must contain only numbers')
    .optional(),
  category_id: yup
    .number()
    .integer('Category ID must be an integer')
    .required('Category is required'),
  price: yup
    .number()
    .min(0, 'Price must be greater than or equal to 0')
    .max(9999999999.99, 'Price must be less than or equal to 9999999999.99')
    .required('Price is required'),
  seller_id: yup
    .number()
    .integer('Seller ID must be an integer')
    .required('Seller ID is required'),
  main_image: yup
    .string()
    .min(3, 'Can\'t containt less than 3 symbols')
    .optional(),
  attributes: yup.array().of(
    yup.object({
      attribute_id: yup.number().required(),
      value: yup.string().required()
    })
  ).optional(),
});

const getProductsByCategoryValidation = yup.object().shape({
  category: yup.number().required('Category id can\'t be empty'), 
}).concat(paginationValidation);

const manageCartValidation = yup.object().shape({
  product: yup.number().required('Product id can\'t be empty'), 
  type: yup.mixed<ManageCartType>().oneOf(Object.values(ManageCartType), `The type must be one of the following ${Object.values(ManageCartType).join(', ')}`).default(ManageCartType.ADD),
  quantity: yup.number().default(1)
});

const getAllProductsValidation = yup.object().shape({}).concat(paginationValidation);

export { getAllProductsValidation, createProductValidation, getProductsByCategoryValidation, manageCartValidation };