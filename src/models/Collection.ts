import { prop, getModelForClass, Ref, plugin } from '@typegoose/typegoose';
import idValidator from 'mongoose-id-validator';
import { Item } from './Item';
import { Prop } from './Prop';

@plugin(idValidator)
export class Collection {
  @prop({
    required: true,
  })
  public name: string = '';

  @prop({
    ref: Item,
    required: true,
  })
  public items: Ref<Item>[] = [];

  @prop({
    count: Number,
    props: [
      {
        ref: Prop,
      },
    ],
  })
  public sets?: { count: Number; props: Ref<Prop>[] }[] = [];
}

export const CollectionModel = getModelForClass(Collection);
