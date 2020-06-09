import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { BaseEntity } from './BaseEntity';

export class Prop extends BaseEntity {
  @prop()
  public name: string = '';

  @prop()
  public value: string = '';
}

export const PropModel = getModelForClass(Prop);
