import request from 'supertest';
import { expect } from 'chai';
import 'mocha';

import { server } from '../../src/server';
import { CollectionModel } from '../../src/models/Collection';
import { ItemModel } from '../../src/models/Item';

describe('Collection CRUD operations 34', () => {
  it('should create a new collection  ', async () => {
    const itemsBefore = await CollectionModel.countDocuments();
    await request(server).post(`/api/v1/collections`).send({
      name: 'collection1',
      items: [],
    });
    const itemsAfter = await CollectionModel.countDocuments();
    expect(itemsAfter).to.equal(itemsBefore + 1);
  });

  it('should create a collection with existent items', async () => {
    // create firstly a item before creating the collection with relation to it
    const item = new ItemModel({ name: 'item1' });
    await item.save();
    const requestData = {
      name: 'collection1',
      items: [item._id],
    };
    await request(server).post(`/api/v1/collections`).send(requestData);
    const collection = await CollectionModel.findOne({
      name: requestData.name,
    });
    expect(collection).not.be.null;
  });

  it('should get some collections', async () => {
    for (const ind of [1, 2, 3]) {
      const collection = new CollectionModel({
        name: `collection-${ind}`,
        type: `collection-${ind}`,
      });
      await collection.save();
    }
    const res = await request(server).get(`/api/v1/collections`);
    expect(res.body.data.length).to.equal(3);
  });

  it('should get collection by id', async () => {
    const collection = new CollectionModel({ name: 'collection1', items: [] });
    await collection.save();
    const res = await request(server).get(
      `/api/v1/collections/${collection._id}`,
    );
    expect(res.body.data._id).to.equal(collection._id.toString());
  });

  it('should update a collection', async () => {
    const collection = new CollectionModel({ name: 'collection1', items: [] });
    await collection.save();
    const newName = 'collection2';
    const res = await request(server)
      .put(`/api/v1/collections/${collection._id}`)
      .send({
        name: newName,
      });
    expect(res.body.data.name).to.equal(newName);
  });

  it('should delete a collection', async () => {
    const collection = new CollectionModel({ name: 'collection1' });
    await collection.save();
    const res = await request(server).delete(
      `/api/v1/collections/${collection._id}`,
    );
    expect(res.body.data).to.equal(null);
  });
});
