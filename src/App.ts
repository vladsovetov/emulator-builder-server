import express from 'express';
import { Server } from 'http';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import helmet from 'helmet';
import hpp from 'hpp';
import 'colors';

import connectDB from './utils/db';
import errorHandler from './middleware/errorHandler';

import itemsRouter from './routers/items';
import propsRouter from './routers/props';
import collectionsRouter from './routers/collections';
import panelsRouter from './routers/panels';

export default class App {
  private server: express.Express;

  constructor() {
    this.server = express();

    this.configure();
    this.initMiddleware();
    this.initRouters();
    this.initPostMiddleware();
  }

  public listen(): Server {
    return this.server.listen(process.env.PORT, () =>
      console.log(
        `Server started in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
          .yellow.bold,
      ),
    );
  }

  public getServer(): express.Express {
    return this.server;
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
      this.server.use(morgan('dev'));
    }

    // Body parser
    this.server.use(express.json());

    // SECURITY
    // setting various HTTP headers to secure Express app
    this.server.use(helmet());
    // sanitizes user-supplied data to prevent MongoDB Operator Injection
    this.server.use(mongoSanitize());
    // sanitize user input coming from POST body, GET queries, and url params
    this.server.use(xss());
    // basic rate-limiting middleware
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    });
    //  apply to all requests
    this.server.use(limiter);
    // protect against HTTP Parameter Pollution attacks
    this.server.use(hpp());
  }

  private initRouters() {
    this.server.use('/api/v1', itemsRouter);
    this.server.use('/api/v1', propsRouter);
    this.server.use('/api/v1', collectionsRouter);
    this.server.use('/api/v1', panelsRouter);
  }

  private initPostMiddleware() {
    // error handler to return json format error to client
    this.server.use(errorHandler);
  }
}
