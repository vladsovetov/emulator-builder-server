import { RequestHandler } from 'express';
import createError from 'http-errors';

import { Prop, PropModel } from '../models/Prop';
import asyncHandler from '../middleware/asyncHandler';
import { canMutateEntity } from '../utils/permissionsValidator';

// @desc    Create prop
// @route   POST /api/v1/props
// @access  Private, Creator
export const createOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { name, value } = req.body;

    const prop = await PropModel.create({
      name: name,
      value: value,
      user: req.user?.sub,
    } as Prop);

    res.status(201).json({
      success: true,
      data: prop,
    });
  },
);

// @desc    Get props
// @route   GET /api/v1/props
// @access  Public
export const getMany: RequestHandler = asyncHandler(async (req, res, next) => {
  const props = await PropModel.find({});
  res.status(200).json({
    success: true,
    data: props,
  });
});

// @desc    Get prop
// @route   GET /api/v1/props/:id
// @access  Public
export const getOne: RequestHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const prop = await PropModel.findById(id);

  if (!prop) {
    const err = createError(404, `Can not find resource`);
    console.log(err.statusCode);
    return next(err);
  }

  res.status(200).json({
    success: true,
    data: prop,
  });
});

// @desc    Update prop
// @route   GET /api/v1/props/:id
// @access  Private, Creator
export const updateOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const { name, value } = req.body;

    const prop = await PropModel.findById(id);

    if (!prop) {
      return next(createError(404, `Can not find resource`));
    }
    if (!name && typeof value === 'undefined') {
      return next(createError(400, `Provided bad fields for the resource`));
    }
    if (!canMutateEntity(prop, req.user)) {
      return next(createError(403, `Forbidden to access`));
    }
    if (name) {
      prop.name = name;
    }
    if (typeof value !== 'undefined') {
      prop.value = value;
    }
    await prop.save();

    res.status(200).json({
      success: true,
      data: prop,
    });
  },
);

// @desc    Delete prop
// @route   DELETE /api/v1/props/:id
// @access  Private, Creator
export const deleteOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    const prop = await PropModel.findById(id);

    if (!prop) {
      return next(createError(404, `Can not find resource`));
    }

    if (!canMutateEntity(prop, req.user)) {
      return next(createError(403, `Forbidden to access`));
    }

    await prop.remove();

    res.status(200).json({
      success: true,
      data: null,
    });
  },
);
