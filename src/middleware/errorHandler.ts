import { ErrorRequestHandler } from 'express';
import createError from 'http-errors';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let error = { ...err };
  // these fields are not copied with spread operator, so define them directly
  error.statusCode = err.statusCode;
  error.message = err.message;
  // Log to console for dev
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = createError(404, `Can not find resource`);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
