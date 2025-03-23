import * as yup from 'yup';
import { paginationValidation } from './main.scheme';

const createGroupValidation = yup.object().shape({
  title: yup.string().required(),
  attributes: yup.array().of(yup.string().required()).optional(),
});

const createAttributeValidation = yup.object().shape({
  title: yup.string().required(),
  group_id: yup.number().integer().required(),
});

const deleteAttributeGroupValidation = yup.object().shape({
  id: yup.number().required(),
});

const getGroupsValidation = yup.object().shape({}).concat(paginationValidation);

const getAttributesByGroupValidation = yup.object().shape({
  group_id: yup.number().integer().required(),
}).concat(paginationValidation);

export { createGroupValidation, createAttributeValidation, getGroupsValidation, getAttributesByGroupValidation, deleteAttributeGroupValidation };