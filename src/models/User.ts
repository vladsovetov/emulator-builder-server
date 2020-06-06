import { prop, getModelForClass, pre } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { USER_ROLES } from '../constants';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';

@pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  if (!process.env.SALT_ROUNDS) {
    throw new Error('Please provide SALT_ROUNDS env variable');
  }
  const salt = await bcrypt.genSalt(+process.env.SALT_ROUNDS);
  const passwordHash = await bcrypt.hash(this.get('password'), salt);
  this.set('password', passwordHash);
  next();
})
export class User {
  @prop()
  public name: string = '';

  @prop({
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value.toLowerCase());
      },
    },
  })
  public email: string = '';

  @prop({
    required: true,
    select: false,
  })
  public password: string = '';

  @prop({
    select: false,
  })
  public resetPasswordToken: string = '';

  @prop({
    enum: [USER_ROLES.USER, USER_ROLES.CREATOR, USER_ROLES.ADMIN],
    default: USER_ROLES.USER,
  })
  public role: string = USER_ROLES.USER;

  @prop({
    default: Date.now,
  })
  public created: string = '';

  constructor(args: any) {
    return;
  }

  public getJWT(this: DocumentType<User>) {
    return jwt.sign(
      { sub: this._id, role: this.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: process.env.JWT_EXPIRE,
      },
    );
  }

  public async matchPassword(this: DocumentType<User>, password: string) {
    return bcrypt.compare(password, this.password);
  }
}

export const a = new User('1');

export const UserModel = getModelForClass(User);
