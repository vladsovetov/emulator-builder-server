import { RequestHandler, Response } from 'express';
import createError from 'http-errors';
import { DocumentType } from '@typegoose/typegoose';

import { User, UserModel } from '../models/User';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Sign up
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup: RequestHandler = asyncHandler(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(createError(400, `Passwords do not match`));
  }

  const user = await UserModel.create({
    email,
    password,
  } as User);

  responseWithJWT(res, 201, user);
});

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public
export const login: RequestHandler = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createError(400, `Missed required fields`));
  }
  const user = await UserModel.findOne({ email }).select('+password');

  if (!user) {
    return next(createError(401, `Invalid credentials`));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(createError(401, `Invalid credentials`));
  }

  responseWithJWT(res, 201, user);
});

// @desc    Logout
// @route   GET /api/v1/auth/logout
// @access  Private
export const logout: RequestHandler = asyncHandler(async (req, res, next) => {
  res
    .cookie('token', 'none', {
      expires: new Date(Date.now() + 1000),
    })
    .json({
      success: true,
    });
});

function responseWithJWT(
  res: Response<any>,
  status: number,
  user: DocumentType<User>,
) {
  const token = user.getJWT();
  res
    .status(status)
    .cookie('token', token, {
      expires: new Date(
        Date.now() + +process.env.JWT_COOKIE_EXPIRE! * 24 * 60 * 60 * 1000,
      ),
    })
    .json({
      success: true,
      data: token,
    });
}
