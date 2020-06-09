import { RequestHandler } from 'express';
import createError from 'http-errors';

import { Item, ItemModel } from '../models/Item';
import { Prop } from '../models/Prop';
import { validatePropsRefs } from '../utils/propsValidator';
import asyncHandler from '../middleware/asyncHandler';
import { canMutateEntity } from '../utils/permissionsValidator';

// @desc    Create item
// @route   POST /api/v1/items
// @access  Private, Creator, Admin
export const createOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { name, type } = req.body;
    let { props }: { props: Prop[] } = req.body;

    if (props) {
      const validationResult = validatePropsRefs(props);
      if (!validationResult.isValid) {
        return next(createError(400, validationResult.errorMsg!));
      }
    }

    const item = await ItemModel.create({
      name: name,
      type: type,
      props: props,
      user: req.user?.sub,
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
  const items = await ItemModel.find({}).populate('props');
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

  const item = await ItemModel.findById(id).populate('props');

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

    if (!canMutateEntity(item, req.user)) {
      return next(createError(403, `Forbidden to access`));
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

    if (!canMutateEntity(item, req.user)) {
      return next(createError(403, `Forbidden to access`));
    }

    await item.remove();

    res.status(200).json({
      success: true,
      data: null,
    });
  },
);
