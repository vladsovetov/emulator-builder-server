import { prop, getModelForClass, Ref } from '@typegoose/typegoose';

import { BaseEntity } from './BaseEntity';
import { User } from './User';

export class Panel extends BaseEntity {
  @prop({
    required: true,
  })
  public name: string = '';

  @prop({
    required: true,
  })
  public type: string = '';

  @prop({
    required: true,
  })
  public settings: object = {};
}

export const PanelModel = getModelForClass(Panel);
