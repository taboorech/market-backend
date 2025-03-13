import asyncHandler from 'express-async-handler';
import { Request, Response } from "express";
import { createUserValidation, loginUserValidation, refreshUserTokenValidation } from '../../yup/user.scheme';
import * as bcrypt from "bcrypt";
import User from '../../models/user.model';
import { CustomError } from '../../libs/classes/custom-error.class';
import { generateTokens } from '../../utils/generate-tokens';

const signUp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, firstName, lastName, password } = await createUserValidation.validate(req.body, { abortEarly: false })

  const securedPassword = await bcrypt.hash(password, 10);

  const user = await User.query().insert({
    email,
    firstName,
    lastName,
    password: securedPassword
  });

  res.status(201).json(user);
});

const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = await loginUserValidation.validate(req.body, { abortEarly: false });
  
  const user = await User.query().findOne({ email });

  if(!user) {
    throw new CustomError(404, 'Wrong user');
  }

  const comparedPasswords = await bcrypt.compare(password, user.password);

  if(!comparedPasswords) {
    throw new CustomError(403, 'Wrong password');
  }

  const tokens = await generateTokens(user);

  res.status(200).json(tokens);
});

const refreshTokens = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const refreshToken = await refreshUserTokenValidation.validate(req.headers.authorization.replace("Bearer ", ""));

  const user = await User.query().findById(req.user.id);

  if(!user) {
    throw new CustomError(404, 'User not found');
  }

  const verifyToken = await bcrypt.compare(refreshToken, user.refreshToken);

  if(!verifyToken) {
    throw new CustomError(403, 'Wrong refresh token');
  }

  const tokens = await generateTokens(user);

  res.status(200).json(tokens);
});

const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await User.query().patchAndFetchById(req.user.id, { refreshToken: null });
  res.status(200).send("Logout successfully");
});

export { signUp, login, logout, refreshTokens };