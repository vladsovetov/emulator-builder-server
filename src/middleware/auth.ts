import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

import { USER_ROLES } from '../constants';
import asyncHandler from './asyncHandler';
import { UserModel } from '../models/User';

export const authorized: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const token = req.cookies['token'];

    if (!token) {
      return next(createError(401, `Not authorized to access`));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };
      const user = await UserModel.findById(decoded.id);
      if (user) {
        req.user = user;
      }
      next();
    } catch (e) {
      return next(createError(401, `Not authorized to access`));
    }
  },
);

export const role = (...roles: string[]): RequestHandler => (
  req,
  res,
  next,
) => {
  if (!req.user) {
    return next(createError(401, `Not authorized to access`));
  }

  if (
    roles.indexOf(req.user.role) === -1 &&
    req.user.role !== USER_ROLES.ADMIN
  ) {
    // admin should be allowed to do any operation
    return next(createError(403, `Forbidden to access`));
  }

  next();
};
