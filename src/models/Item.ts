import mongoose, { Schema } from 'mongoose';

export interface ItemInterface extends mongoose.Document {
  type: string;
  props: {}[];
}

const ItemSchema = new Schema({
  type: String,
  props: [Object],
});

const Item = mongoose.model<ItemInterface>('Item', ItemSchema);

export default Item;
