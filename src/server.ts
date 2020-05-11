import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'colors';

import connectDB from '../config/db';
import itemsRouter from './routers/items';

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

// enable logging only in dev mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());

app.use('/api/v1', itemsRouter);

const server = app.listen(process.env.PORT, () =>
  console.log(
    `Server started in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .yellow.bold,
  ),
);

// Handle unhandled promise rejections
(process as NodeJS.EventEmitter).on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});

export default server;
