import { prop, getModelForClass, Ref } from '@typegoose/typegoose';

import { User } from './User';

export class BaseEntity {
  @prop({
    ref: User,
  })
  public user: Ref<User>;
}
