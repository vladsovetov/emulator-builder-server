import express from 'express';
import { Server } from 'http';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import helmet from 'helmet';
import hpp from 'hpp';

import connectDB from './utils/db';
import errorHandler from './middleware/errorHandler';

import itemsRouter from './routers/items';
import propsRouter from './routers/props';

export default class App {
  private app: express.Express;

  constructor() {
    this.app = express();

    this.configure();
    this.initMiddleware();
    this.initRouters();
    this.initPostMiddleware();
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

    // SECURITY
    // setting various HTTP headers to secure Express app
    this.app.use(helmet());
    // sanitizes user-supplied data to prevent MongoDB Operator Injection
    this.app.use(mongoSanitize());
    // sanitize user input coming from POST body, GET queries, and url params
    this.app.use(xss());
    // basic rate-limiting middleware
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    });
    //  apply to all requests
    this.app.use(limiter);
    // protect against HTTP Parameter Pollution attacks
    this.app.use(hpp());
  }

  private initRouters() {
    this.app.use('/api/v1', itemsRouter);
    this.app.use('/api/v1', propsRouter);
  }

  private initPostMiddleware() {
    // error handler to return json format error to client
    this.app.use(errorHandler);
  }
}
