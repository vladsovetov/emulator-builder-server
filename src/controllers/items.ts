import { RequestHandler } from 'express';

import Item from '../models/Item';

// @desc    Create item
// @route   POST /api/v1/items
// @access  Private, Creator
export const createItem: RequestHandler = async (req, res, next) => {
  const { type } = req.body;

  const item = await Item.create({
    type: type,
  });

  res.status(201).json({
    success: true,
    data: item,
  });
};

// @desc    Get items
// @route   GET /api/v1/items
// @access  Public
export const getItems: RequestHandler = async (req, res, next) => {
  const items = await Item.find({});
  res.status(200).json({
    success: true,
    data: items,
  });
};

// @desc    Get item
// @route   GET /api/v1/items/:id
// @access  Public
export const getItem: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  const item = await Item.findById(id);

  if (!item) {
    throw new Error(`Can not find resource with id: ${id}`);
  }

  res.status(200).json({
    success: true,
    data: item,
  });
};

// @desc    Update item
// @route   GET /api/v1/items/:id
// @access  Private, Creator
export const updateItem: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { type } = req.body;

  const item = await Item.findById(id);

  if (!item) {
    throw new Error(`Can not find resource with id: ${id}`);
  }

  item.type = type;
  await item.save();

  res.status(200).json({
    success: true,
    data: item,
  });
};

// @desc    Delete item
// @route   DELETE /api/v1/items/:id
// @access  Private, Creator
export const deleteItem: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  const item = await Item.findById(id);

  if (!item) {
    throw new Error(`Can not find resource with id: ${id}`);
  }

  await item.remove();

  res.status(200).json({
    success: true,
    data: null,
  });
};
