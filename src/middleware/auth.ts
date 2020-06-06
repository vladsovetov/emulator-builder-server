import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

import { USER_ROLES } from '../constants';
import asyncHandler from './asyncHandler';

export const authorized: RequestHandler = asyncHandler(
  async (req, res, next) => {
    let token = null;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(createError(401, `Not authorized to access`));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        sub: string;
        role: string;
      };
      req.user = decoded;
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
