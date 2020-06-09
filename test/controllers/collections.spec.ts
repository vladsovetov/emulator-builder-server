import request from 'supertest';
import { expect } from 'chai';
import 'mocha';
import { decode } from 'jsonwebtoken';

import { USER_ROLES } from '../../src/constants';
import { server } from '../../src/server';
import { CollectionModel } from '../../src/models/Collection';
import { ItemModel } from '../../src/models/Item';

describe('Collection CRUD operations', () => {
  describe('as ADMIN', () => {
    let jwt = '';
    before(() => {
      jwt = global.users.getJwtByRole(USER_ROLES.ADMIN);
    });

    it('should create a new collection', async () => {
      const { itemsBefore, itemsAfter } = await getCreateCollectionResult(jwt);
      expect(itemsAfter).to.equal(itemsBefore + 1);
    });

    it('should create a collection with existent items', async () => {
      const { collection } = await getCreateCollectionWithItemsResult(jwt);
      expect(collection).not.be.null;
    });

    it('should get some collections', async () => {
      const { count, res } = await getItemsResult(jwt);
      expect(res.body.data.length).to.equal(count);
    });

    it('should get collection by id', async () => {
      const { collection, res } = await getItemByIdResult(jwt);
      expect(res.body.data._id).to.equal(collection._id.toString());
    });

    it('should update a collection', async () => {
      const decoded = decode(jwt);
      const { newName, res } = await getUpdateItemByIdResult(jwt, decoded?.sub);
      expect(res.body.data.name).to.equal(newName);
    });

    it('should delete a collection', async () => {
      const decoded = decode(jwt);
      const { res } = await getDeleteItemByIdResult(jwt, decoded?.sub);
      expect(res.body.data).to.equal(null);
    });
  });

  describe('as CREATOR', () => {
    let jwt = '';
    before(() => {
      jwt = global.users.getJwtByRole(USER_ROLES.CREATOR);
    });

    it('should create a new collection', async () => {
      const { itemsBefore, itemsAfter } = await getCreateCollectionResult(jwt);
      expect(itemsAfter).to.equal(itemsBefore + 1);
    });

    it('should create a collection with existent items', async () => {
      const { collection } = await getCreateCollectionWithItemsResult(jwt);
      expect(collection).not.be.null;
    });

    it('should get some collections', async () => {
      const { count, res } = await getItemsResult(jwt);
      expect(res.body.data.length).to.equal(count);
    });

    it('should get collection by id', async () => {
      const { collection, res } = await getItemByIdResult(jwt);
      expect(res.body.data._id).to.equal(collection._id.toString());
    });

    it('should update a collection', async () => {
      const decoded = decode(jwt);
      const { newName, res } = await getUpdateItemByIdResult(jwt, decoded?.sub);
      expect(res.body.data.name).to.equal(newName);
    });

    it('should not update not own collection', async () => {
      // create a collection as an admin
      const decoded = decode(global.users.getJwtByRole(USER_ROLES.ADMIN));
      const { newName, res } = await getUpdateItemByIdResult(jwt, decoded?.sub);
      expect(res.body.error).to.be.not.empty;
    });

    it('should delete a collection', async () => {
      const decoded = decode(jwt);
      const { res } = await getDeleteItemByIdResult(jwt, decoded?.sub);
      expect(res.body.data).to.equal(null);
    });

    it('should not delete not own collection', async () => {
      // create a collection as an admin
      const decoded = decode(global.users.getJwtByRole(USER_ROLES.ADMIN));
      const { res } = await getDeleteItemByIdResult(jwt, decoded?.sub);
      console.log(res.body);
      expect(res.body.error).to.be.not.empty;
    });
  });

  describe('as USER', () => {
    let jwt = '';
    before(() => {
      jwt = global.users.getJwtByRole(USER_ROLES.USER);
    });

    it('should not create a new collection', async () => {
      const { itemsBefore, itemsAfter } = await getCreateCollectionResult(jwt);
      expect(itemsAfter).to.equal(itemsBefore);
    });

    it('should get some collections', async () => {
      const { count, res } = await getItemsResult(jwt);
      expect(res.body.data.length).to.equal(count);
    });

    it('should get collection by id', async () => {
      const { collection, res } = await getItemByIdResult(jwt);
      expect(res.body.data._id).to.equal(collection._id.toString());
    });

    it('should not update a collection', async () => {
      const decoded = decode(jwt);
      const { newName, res } = await getUpdateItemByIdResult(jwt, decoded?.sub);
      expect(res.body.error).to.be.not.empty;
    });

    it('should not delete a collection', async () => {
      const decoded = decode(jwt);
      const { res } = await getDeleteItemByIdResult(jwt, decoded?.sub);
      expect(res.body.error).to.be.not.empty;
    });
  });
});

const getCreateCollectionResult = async (jwt: string) => {
  const itemsBefore = await CollectionModel.countDocuments();
  await request(server)
    .post(`/api/v1/collections`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      name: 'collection1',
      items: [],
    });
  const itemsAfter = await CollectionModel.countDocuments();
  return {
    itemsBefore,
    itemsAfter,
  };
};

const getCreateCollectionWithItemsResult = async (jwt: string) => {
  // create firstly a item before creating the collection with relation to it
  const item = new ItemModel({ name: 'item1', type: 'type1' });
  await item.save();
  const requestData = {
    name: 'collection1',
    items: [item._id],
  };
  const res = await request(server)
    .post(`/api/v1/collections`)
    .set('Authorization', `Bearer ${jwt}`)
    .send(requestData);
  const collection = await CollectionModel.findOne({
    name: requestData.name,
  });
  return { collection, res };
};

const getItemsResult = async (jwt: string) => {
  for (const ind of [1, 2, 3]) {
    const collection = new CollectionModel({
      name: `collection-${ind}`,
      type: `collection-${ind}`,
    });
    await collection.save();
  }
  const res = await request(server)
    .get(`/api/v1/collections`)
    .set('Authorization', `Bearer ${jwt}`);

  return { count: 3, res };
};

const getItemByIdResult = async (jwt: string) => {
  const collection = new CollectionModel({
    name: 'collection1',
    items: [],
  });
  await collection.save();
  const res = await request(server)
    .get(`/api/v1/collections/${collection._id}`)
    .set('Authorization', `Bearer ${jwt}`);
  return { collection, res };
};

const getUpdateItemByIdResult = async (jwt: string, ownerUser: string = '') => {
  const collection = new CollectionModel({
    name: 'collection1',
    items: [],
    user: ownerUser,
  });
  await collection.save();
  const newName = 'collection2';
  const res = await request(server)
    .put(`/api/v1/collections/${collection._id}`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      name: newName,
    });
  return { newName, res };
};

const getDeleteItemByIdResult = async (jwt: string, ownerUser: string = '') => {
  const collection = new CollectionModel({
    name: 'collection1',
    user: ownerUser,
  });
  await collection.save();
  const res = await request(server)
    .delete(`/api/v1/collections/${collection._id}`)
    .set('Authorization', `Bearer ${jwt}`);
  return { res };
};

const getDeleteNotOwnItemByIdResult = async (jwt: string) => {
  const collection = new CollectionModel({
    name: 'collection1',
  });
  await collection.save();
  const res = await request(server)
    .delete(`/api/v1/collections/${collection._id}`)
    .set('Authorization', `Bearer ${jwt}`);
  return { res };
};
