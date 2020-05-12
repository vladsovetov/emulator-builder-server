import { prop, getModelForClass } from '@typegoose/typegoose';
import { ItemProp } from '../types';

export class Item {
  @prop()
  public type: string = '';

  @prop()
  public props: ItemProp[] = [];

  @prop()
  public requiredProps: ItemProp[] = [];
}

export const ItemModel = getModelForClass(Item);
