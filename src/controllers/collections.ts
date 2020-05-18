import { RequestHandler } from 'express';
import createError from 'http-errors';

import { Collection, CollectionModel } from '../models/Collection';
import { Item } from '../models/Item';
import { validatePropsRefs } from '../utils/propsValidator';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Create collection
// @route   POST /api/v1/collections
// @access  Private, Creator
export const createOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { name } = req.body;
    let { items }: { items: Item[] } = req.body;

    const collection = await CollectionModel.create({
      name: name,
      items: items,
    } as Collection);

    res.status(201).json({
      success: true,
      data: collection,
    });
  },
);

// @desc    Get collections
// @route   GET /api/v1/collection
// @access  Public
export const getMany: RequestHandler = asyncHandler(async (req, res, next) => {
  const collections = await CollectionModel.find({}).populate('items');
  res.status(200).json({
    success: true,
    data: collections,
  });
});

// @desc    Get collection
// @route   GET /api/v1/collections/:id
// @access  Public
export const getOne: RequestHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const collection = await CollectionModel.findById(id).populate('items');

  if (!collection) {
    return next(createError(404, `Can not find resource`));
  }

  res.status(200).json({
    success: true,
    data: collection,
  });
});

// @desc    Update collection
// @route   GET /api/v1/collections/:id
// @access  Private, Creator
export const updateOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    const collection = await CollectionModel.findById(id);

    if (!collection) {
      return next(createError(404, `Can not find resource`));
    }

    collection.name = name;
    await collection.save();

    res.status(200).json({
      success: true,
      data: collection,
    });
  },
);

// @desc    Delete collection
// @route   DELETE /api/v1/collections/:id
// @access  Private, Creator
export const deleteOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    const collection = await CollectionModel.findById(id);

    if (!collection) {
      return next(createError(404, `Can not find resource`));
    }

    await collection.remove();

    res.status(200).json({
      success: true,
      data: null,
    });
  },
);
