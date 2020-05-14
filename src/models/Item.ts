import { prop, arrayProp, getModelForClass, Ref } from '@typegoose/typegoose';
import { Prop } from './Prop';

export class Item {
  @prop()
  public name: string = '';

  @prop()
  public type: string = '';

  @arrayProp({
    ref: Prop,
  })
  public props?: Ref<Prop>[] = [];

  @prop()
  public requiredProps?: Ref<Prop>[] = [];
}

export const ItemModel = getModelForClass(Item);
