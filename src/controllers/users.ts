import { RequestHandler } from 'express';
import createError from 'http-errors';

import { User, UserModel } from '../models/User';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Create user
// @route   POST /api/v1/users
// @access  Public
export const createOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await UserModel.create({
      name,
      email,
      password,
    } as User);

    res.status(201).json({
      success: true,
      data: user,
    });
  },
);

// @desc    Get users
// @route   GET /api/v1/users
// @access  Private, Admin
export const getMany: RequestHandler = asyncHandler(async (req, res, next) => {
  const users = await UserModel.find({});
  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc    Get user
// @route   GET /api/v1/users/:id
// @access  Private, Admin
export const getOne: RequestHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await UserModel.findById(id).populate('items');

  if (!user) {
    return next(createError(404, `Can not find resource`));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user
// @route   GET /api/v1/users/:id
// @access  Private
export const updateOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    const user = await UserModel.findById(id);

    if (!user) {
      return next(createError(404, `Can not find resource`));
    }

    user.name = name;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  },
);

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private, Creator
export const deleteOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    const user = await UserModel.findById(id);

    if (!user) {
      return next(createError(404, `Can not find resource`));
    }

    await user.remove();

    res.status(200).json({
      success: true,
      data: null,
    });
  },
);
