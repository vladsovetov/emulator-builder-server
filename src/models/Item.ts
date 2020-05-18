import { prop, arrayProp, getModelForClass, Ref } from '@typegoose/typegoose';
import { Prop } from './Prop';

export class Item {
  @prop({
    required: true,
  })
  public name: string = '';

  @prop({
    required: true,
  })
  public type: string = '';

  @arrayProp({
    ref: Prop,
  })
  public props?: Ref<Prop>[] = [];

  @arrayProp({
    ref: Prop,
  })
  public requiredProps?: Ref<Prop>[] = [];
}

export const ItemModel = getModelForClass(Item);
