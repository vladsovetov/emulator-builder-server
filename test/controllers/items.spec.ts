import request from 'supertest';
import { expect } from 'chai';
import 'mocha';

import { server } from '../../src/server';
import { ItemModel } from '../../src/models/Item';
import { PropModel } from '../../src/models/Prop';

describe('Item CRUD operations', () => {
  it('should create a new item', async () => {
    const itemsBefore = await ItemModel.countDocuments();
    await request(server).post(`/api/v1/items`).send({
      name: 'test',
      type: 'test',
    });
    const itemsAfter = await ItemModel.countDocuments();
    expect(itemsAfter).to.equal(itemsBefore + 1);
  });

  it('should create a item with existent prop', async () => {
    // create firstly a prop before creating the item with relation to it
    const prop = new PropModel({ name: 'prop1', value: '2' });
    await prop.save();
    const requestData = {
      name: 'test',
      type: 'test',
      props: [prop._id],
    };
    await request(server).post(`/api/v1/items`).send(requestData);
    const item = await ItemModel.findOne({ name: requestData.name });
    expect(item).not.be.null;
  });

  it('should get some items', async () => {
    for (const ind of [1, 2, 3]) {
      const item = new ItemModel({
        name: `test-${ind}`,
        type: `test-${ind}`,
      });
      await item.save();
    }
    const res = await request(server).get(`/api/v1/items`);
    expect(res.body.data.length).to.equal(3);
  });

  it('should get item by id', async () => {
    const item = new ItemModel({ name: 'test', type: 'test' });
    await item.save();
    const res = await request(server).get(`/api/v1/items/${item._id}`);
    expect(res.body.data._id).to.equal(item._id.toString());
  });

  it('should update an item', async () => {
    const item = new ItemModel({ name: 'test', type: 'test' });
    await item.save();
    const newType = 'test updated';
    const res = await request(server).put(`/api/v1/items/${item._id}`).send({
      type: newType,
    });
    expect(res.body.data.type).to.equal(newType);
  });

  it('should delete an item', async () => {
    const item = new ItemModel({ name: 'test', type: 'test' });
    await item.save();
    const res = await request(server).delete(`/api/v1/items/${item._id}`);
    expect(res.body.data).to.equal(null);
  });
});
