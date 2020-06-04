import { DocumentType } from '@typegoose/typegoose';
import { User } from '../../models/User';

declare global {
  namespace Express {
    export interface Request {
      user?: DocumentType<User>;
    }
  }
}
