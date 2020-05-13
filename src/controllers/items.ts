import { RequestHandler } from 'express';
import createError from 'http-errors';

import { Item, ItemModel } from '../models/Item';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Create item
// @route   POST /api/v1/items
// @access  Private, Creator
export const createOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { type } = req.body;

    const item = await ItemModel.create({
      type: type,
    } as Item);

    res.status(201).json({
      success: true,
      data: item,
    });
  },
);

// @desc    Get items
// @route   GET /api/v1/items
// @access  Public
export const getMany: RequestHandler = asyncHandler(async (req, res, next) => {
  const items = await ItemModel.find({});
  res.status(200).json({
    success: true,
    data: items,
  });
});

// @desc    Get item
// @route   GET /api/v1/items/:id
// @access  Public
export const getOne: RequestHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const item = await ItemModel.findById(id);

  if (!item) {
    return next(createError(404, `Can not find resource`));
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});

// @desc    Update item
// @route   GET /api/v1/items/:id
// @access  Private, Creator
export const updateOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const { type } = req.body;

    const item = await ItemModel.findById(id);

    if (!item) {
      return next(createError(404, `Can not find resource`));
    }

    item.type = type;
    await item.save();

    res.status(200).json({
      success: true,
      data: item,
    });
  },
);

// @desc    Delete item
// @route   DELETE /api/v1/items/:id
// @access  Private, Creator
export const deleteOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    const item = await ItemModel.findById(id);

    if (!item) {
      return next(createError(404, `Can not find resource`));
    }

    await item.remove();

    res.status(200).json({
      success: true,
      data: null,
    });
  },
);
