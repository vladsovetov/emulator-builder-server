import { prop, getModelForClass } from '@typegoose/typegoose';

export class Prop {
  @prop()
  public name: string = '';

  @prop()
  public value: string | number = '';
}

export const PropModel = getModelForClass(Prop);
