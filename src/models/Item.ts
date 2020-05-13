import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Prop } from './Prop';

export class Item {
  @prop()
  public type: string = '';

  @prop()
  public props?: Ref<Prop>[] = [];

  @prop()
  public requiredProps?: Ref<Prop>[] = [];
}

export const ItemModel = getModelForClass(Item);
