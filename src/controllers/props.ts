import { RequestHandler } from 'express';

import { Prop, PropModel } from '../models/Prop';

// @desc    Create prop
// @route   POST /api/v1/props
// @access  Private, Creator
export const createOne: RequestHandler = async (req, res, next) => {
  const { name, value } = req.body;

  const prop = await PropModel.create({
    name: name,
    value: value,
  } as Prop);

  res.status(201).json({
    success: true,
    data: prop,
  });
};

// @desc    Get props
// @route   GET /api/v1/props
// @access  Public
export const getMany: RequestHandler = async (req, res, next) => {
  const props = await PropModel.find({});
  res.status(200).json({
    success: true,
    data: props,
  });
};

// @desc    Get prop
// @route   GET /api/v1/props/:id
// @access  Public
export const getOne: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  const prop = await PropModel.findById(id);

  if (!prop) {
    throw new Error(`Can not find resource with id: ${id}`);
  }

  res.status(200).json({
    success: true,
    data: prop,
  });
};

// @desc    Update prop
// @route   GET /api/v1/props/:id
// @access  Private, Creator
export const updateOne: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { name, value } = req.body;

  const prop = await PropModel.findById(id);

  if (!prop) {
    throw new Error(`Can not find resource with id: ${id}`);
  }
  if (!name && typeof value === 'undefined') {
    throw new Error(`Provided bad fields for the resource`);
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
};

// @desc    Delete prop
// @route   DELETE /api/v1/props/:id
// @access  Private, Creator
export const deleteOne: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  const prop = await PropModel.findById(id);

  if (!prop) {
    throw new Error(`Can not find resource with id: ${id}`);
  }

  await prop.remove();

  res.status(200).json({
    success: true,
    data: null,
  });
};
