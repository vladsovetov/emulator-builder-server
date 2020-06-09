import { RequestHandler } from 'express';
import createError from 'http-errors';

import { Panel, PanelModel } from '../models/Panel';
import asyncHandler from '../middleware/asyncHandler';
import { canMutateEntity } from '../utils/permissionsValidator';

// @desc    Create panel
// @route   POST /api/v1/panels
// @access  Private, Admin
export const createOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { name, type, settings } = req.body;

    if (!name && !type && !settings) {
      return next(createError(400, `Not provided required fields`));
    }
    const panel = await PanelModel.create({
      name: name,
      type: type,
      settings: settings,
      user: req.user?.sub,
    } as Panel);

    res.status(201).json({
      success: true,
      data: panel,
    });
  },
);

// @desc    Get panels
// @route   GET /api/v1/panels
// @access  Private, Admin
export const getMany: RequestHandler = asyncHandler(async (req, res, next) => {
  const panels = await PanelModel.find({});
  res.status(200).json({
    success: true,
    data: panels,
  });
});

// @desc    Get panel
// @route   GET /api/v1/panels/:id
// @access  Public
export const getOne: RequestHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const panel = await PanelModel.findById(id);

  if (!panel) {
    return next(createError(404, `Can not find resource`));
  }

  res.status(200).json({
    success: true,
    data: panel,
  });
});

// @desc    Update panel
// @route   GET /api/v1/panels/:id
// @access  Private, Admin
export const updateOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const { name, type, settings } = req.body;

    if (!name && !settings && !type) {
      return next(createError(400, `Not provided required fields`));
    }

    const panel = await PanelModel.findById(id);

    if (!panel) {
      return next(createError(404, `Can not find resource`));
    }

    if (!canMutateEntity(panel, req.user)) {
      return next(createError(403, `Forbidden to access`));
    }

    if (name) {
      panel.name = name;
    }
    if (type) {
      panel.type = type;
    }
    if (settings) {
      panel.settings = settings;
    }
    await panel.save();

    res.status(200).json({
      success: true,
      data: panel,
    });
  },
);

// @desc    Delete panel
// @route   DELETE /api/v1/panels/:id
// @access  Private, Admin
export const deleteOne: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;

    const panel = await PanelModel.findById(id);

    if (!panel) {
      return next(createError(404, `Can not find resource`));
    }

    if (!canMutateEntity(panel, req.user)) {
      return next(createError(403, `Forbidden to access`));
    }

    await panel.remove();

    res.status(200).json({
      success: true,
      data: null,
    });
  },
);
