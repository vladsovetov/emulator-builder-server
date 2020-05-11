import request from 'supertest';
import { expect } from 'chai';
import 'mocha';

import server from '../../src/server';
import Item from '../../src/models/Item';

describe('Item CRUD operations', () => {
  it('should create a new item', async () => {
    const itemsBefore = await Item.countDocuments();
    await request(server).post(`${process.env.API_PREFIX}/items`).send({
      type: 'test',
    });
    const itemsAfter = await Item.countDocuments();
    expect(itemsAfter).to.equal(itemsBefore + 1);
  });

  it('should get some items', async () => {
    [1, 2, 3].forEach(async (ind) => {
      const item = new Item({ type: `test-${ind}` });
      await item.save();
    });
    const res = await request(server).get(`${process.env.API_PREFIX}/items`);
    expect(res.body.data.length).to.equal(3);
  });

  it('should get by id', async () => {
    const item = new Item({ type: 'test' });
    await item.save();
    const res = await request(server).get(
      `${process.env.API_PREFIX}/items/${item._id}`,
    );
    expect(res.body.data._id).to.equal(item._id.toString());
  });

  it('should update an item', async () => {
    const item = new Item({ type: 'test' });
    await item.save();
    const newType = 'test updated';
    const res = await request(server)
      .put(`${process.env.API_PREFIX}/items/${item._id}`)
      .send({
        type: newType,
      });
    expect(res.body.data.type).to.equal(newType);
  });

  it('should delete an item', async () => {
    const item = new Item({ type: 'test' });
    await item.save();
    const res = await request(server).delete(
      `${process.env.API_PREFIX}/items/${item._id}`,
    );
    expect(res.body.data).to.equal(null);
  });
});
