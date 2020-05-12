import express from 'express';
import { Server } from 'http';
import dotenv from 'dotenv';
import morgan from 'morgan';

import connectDB from './utils/db';

import itemsRouter from './routers/items';

export default class App {
  private app: express.Express;

  constructor() {
    this.app = express();

    this.configure();
    this.initMiddleware();
    this.initRouters();
  }

  public listen(): Server {
    return this.app.listen(process.env.PORT, () =>
      console.log(
        `Server started in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
          .yellow.bold,
      ),
    );
  }

  private configure() {
    // put all env config into process.env
    dotenv.config({ path: './config/config.env' });

    // connect to Mongoose
    connectDB();
  }

  private initMiddleware() {
    // enable logging only in dev mode
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    // Body parser
    this.app.use(express.json());
  }

  private initRouters() {
    this.app.use('/api/v1', itemsRouter);
  }
}
