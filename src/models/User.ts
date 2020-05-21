import { prop, getModelForClass, pre } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

import { USER_ROLES } from '../constants';

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
  @prop({
    required: true,
  })
  public name: string = '';

  @prop({
    required: true,
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
  })
  public password: string = '';

  @prop()
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
}

export const UserModel = getModelForClass(User);
