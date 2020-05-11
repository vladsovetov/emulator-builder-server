import mongoose, { Schema } from 'mongoose';

export interface ItemInterface extends mongoose.Document {
  type: string;
  props: {}[];
  requiredProps: {}[];
}

const ItemSchema = new Schema({
  type: String,
  props: [Object],
  requiredProps: [Object],
});

const Item = mongoose.model<ItemInterface>('Item', ItemSchema);

export default Item;
