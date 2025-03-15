import * as yup from "yup";
import { UserRole } from "../libs/enum/user-role.enum";
import { paginationValidation } from "./main.scheme";

const createUserValidation = yup.object().shape({
  email: yup.string().trim().email().required('Email is required'),
  firstName: yup.string().trim().required('Firstname is required'),
  lastName: yup.string().trim().required('Lastname is required'),
  password: yup.string().required('Password is required').min(3, 'Password must be at least 8 characters long'),
});

const loginUserValidation = yup.object().shape({
  email: yup.string().trim().email().required('Email is required'),
  password: yup.string().required('Password is required')
});

const refreshUserTokenValidation = yup.string().required("Enter your refreshToken");

const editProfileValidation = yup.object().shape({
  email: yup.string().trim().email().optional(),
  firstName: yup.string().trim().optional(),
  lastName: yup.string().trim().optional(),
  phoneNumber: yup.string().min(4, 'Phone number can\'t contain less than 4 numbers').optional(),
  password: yup.string().optional().min(8, 'Password must be at least 8 characters long'),
});

const changeUserRoleValidation = yup.object().shape({
  user: yup.number().required('User id must contain a value'),
  role: yup.mixed<UserRole>().oneOf(Object.values(UserRole), `Role must be one of the values: ${Object.values(UserRole).join(', ')}`).required('User role must contain a value')
});

const updateUserInfoValidation = yup.object().shape({
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  password: yup.string().optional(),
});

const getUsersValidation = yup.object({}).concat(paginationValidation);

export { 
  getUsersValidation,
  createUserValidation, 
  loginUserValidation, 
  refreshUserTokenValidation, 
  editProfileValidation, 
  changeUserRoleValidation,
  updateUserInfoValidation 
};