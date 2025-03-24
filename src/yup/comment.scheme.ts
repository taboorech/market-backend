import * as yup from 'yup';
import { paginationValidation } from './main.scheme';

const getCommentsByProductValidation = yup.object().shape({
  product: yup.number().required('Product ID can\'t be empty')
}).concat(paginationValidation);

const createCommentValidation = yup.object().shape({
  product: yup.number().required('Product ID can\'t be empty'),
  content: yup.string().required('Comment content can\'t be empty').min(1).max(1000),
});

const updateCommentValidation = yup.object({
  id: yup.number().required('Comment ID can\'t be empty'),
  content: yup.string().required('Comment content can\'t be empty').min(1).max(1000),
});

const deleteCommentValidation = yup.object({
  id: yup.number().required('Comment ID can\'t be empty'),
});

export { getCommentsByProductValidation, createCommentValidation, updateCommentValidation, deleteCommentValidation };