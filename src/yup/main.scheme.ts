import * as yup from "yup";

const paginationValidation = yup.object({
  offset: yup.number().integer().min(0).default(0),
  limit: yup.number().integer().min(1).max(100).default(10),
  search: yup.string().trim().optional(),
  ids: yup.array().of(yup.string().uuid()).optional(),
});

export { paginationValidation };