import { prop, getModelForClass, Ref, plugin } from '@typegoose/typegoose';
import idValidator from 'mongoose-id-validator';
import { Prop } from './Prop';

@plugin(idValidator)
export class Item {
  @prop({
    required: true,
  })
  public name: string = '';

  @prop({
    required: true,
  })
  public type: string = '';

  @prop({
    ref: Prop,
  })
  public props?: Ref<Prop>[] = [];

  @prop({
    ref: Prop,
  })
  public requiredProps?: Ref<Prop>[] = [];
}

export const ItemModel = getModelForClass(Item);
