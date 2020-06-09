import request from 'supertest';
import { expect } from 'chai';
import 'mocha';
import { decode } from 'jsonwebtoken';

import { USER_ROLES } from '../../src/constants';
import { server } from '../../src/server';
import { ItemModel } from '../../src/models/Item';
import { PropModel } from '../../src/models/Prop';

describe('Item CRUD operations', () => {
  describe('as ADMIN', () => {
    let jwt = '';
    before(() => {
      jwt = global.users.getJwtByRole(USER_ROLES.ADMIN);
    });

    it('should create a new item', async () => {
      const { itemsBefore, itemsAfter } = await getCreateItemResult(jwt);
      expect(itemsAfter).to.equal(itemsBefore + 1);
    });

    it('should create an item with existent prop', async () => {
      const { item } = await getCreateItemWithPropsResult(jwt);
      expect(item).not.be.null;
    });

    it('should get some items', async () => {
      const { count, res } = await getItemsResult(jwt);
      expect(res.body.data.length).to.equal(count);
    });

    it('should get item by id', async () => {
      const { item, res } = await getItemByIdResult(jwt);
      expect(res.body.data._id).to.equal(item._id.toString());
    });

    it('should update an item', async () => {
      const decoded = decode(jwt);
      const { newType, res } = await getUpdateItemByIdResult(jwt, decoded?.sub);
      expect(res.body.data.type).to.equal(newType);
    });

    it('should delete an item', async () => {
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

    it('should create a new item', async () => {
      const { itemsBefore, itemsAfter } = await getCreateItemResult(jwt);
      expect(itemsAfter).to.equal(itemsBefore + 1);
    });

    it('should create an item with existent prop', async () => {
      const { item } = await getCreateItemWithPropsResult(jwt);
      expect(item).not.be.null;
    });

    it('should get some items', async () => {
      const { count, res } = await getItemsResult(jwt);
      expect(res.body.data.length).to.equal(count);
    });

    it('should get item by id', async () => {
      const { item, res } = await getItemByIdResult(jwt);
      expect(res.body.data._id).to.equal(item._id.toString());
    });

    it('should update an item', async () => {
      const decoded = decode(jwt);
      const { newType, res } = await getUpdateItemByIdResult(jwt, decoded?.sub);
      expect(res.body.data.type).to.equal(newType);
    });

    it('should not update not own item', async () => {
      // create an item as an admin
      const decoded = decode(global.users.getJwtByRole(USER_ROLES.ADMIN));
      const { newType, res } = await getUpdateItemByIdResult(jwt, decoded?.sub);
      expect(res.body.error).to.be.not.empty;
    });

    it('should delete an item', async () => {
      const decoded = decode(jwt);
      const { res } = await getDeleteItemByIdResult(jwt, decoded?.sub);
      expect(res.body.data).to.equal(null);
    });

    it('should not delete not own item', async () => {
      // create an item as an admin
      const decoded = decode(global.users.getJwtByRole(USER_ROLES.ADMIN));
      const { res } = await getDeleteItemByIdResult(jwt, decoded?.sub);
      expect(res.body.error).to.be.not.empty;
    });
  });

  describe('as USER', () => {
    let jwt = '';
    before(() => {
      jwt = global.users.getJwtByRole(USER_ROLES.USER);
    });

    it('should not create a new item', async () => {
      const { itemsBefore, itemsAfter } = await getCreateItemResult(jwt);
      expect(itemsAfter).to.equal(itemsBefore);
    });

    it('should get some items', async () => {
      const { count, res } = await getItemsResult(jwt);
      expect(res.body.data.length).to.equal(count);
    });

    it('should get item by id', async () => {
      const { item, res } = await getItemByIdResult(jwt);
      expect(res.body.data._id).to.equal(item._id.toString());
    });

    it('should not update an item', async () => {
      const decoded = decode(jwt);
      const { newType, res } = await getUpdateItemByIdResult(jwt, decoded?.sub);
      expect(res.body.error).to.be.not.empty;
    });

    it('should not delete an item', async () => {
      const decoded = decode(jwt);
      const { res } = await getDeleteItemByIdResult(jwt, decoded?.sub);
      expect(res.body.error).to.be.not.empty;
    });
  });
});

const getCreateItemResult = async (jwt: string) => {
  const itemsBefore = await ItemModel.countDocuments();
  await request(server)
    .post(`/api/v1/items`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      name: 'test',
      type: 'test',
    });
  const itemsAfter = await ItemModel.countDocuments();
  return {
    itemsBefore,
    itemsAfter,
  };
};

const getCreateItemWithPropsResult = async (jwt: string) => {
  // create firstly a prop before creating the item with relation to it
  const prop = new PropModel({ name: 'prop1', value: '2' });
  await prop.save();
  const requestData = {
    name: 'test',
    type: 'test',
    props: [prop._id],
  };
  const res = await request(server)
    .post(`/api/v1/items`)
    .set('Authorization', `Bearer ${jwt}`)
    .send(requestData);
  const item = await ItemModel.findOne({ name: requestData.name });
  return { item, res };
};

const getItemsResult = async (jwt: string) => {
  for (const ind of [1, 2, 3]) {
    const item = new ItemModel({
      name: `test-${ind}`,
      type: `test-${ind}`,
    });
    await item.save();
  }
  const res = await request(server)
    .get(`/api/v1/items`)
    .set('Authorization', `Bearer ${jwt}`);

  return { count: 3, res };
};

const getItemByIdResult = async (jwt: string) => {
  const item = new ItemModel({ name: 'test', type: 'test' });
  await item.save();
  const res = await request(server)
    .get(`/api/v1/items/${item._id}`)
    .set('Authorization', `Bearer ${jwt}`);
  return { item, res };
};

const getUpdateItemByIdResult = async (jwt: string, ownerUser: string = '') => {
  const item = new ItemModel({ name: 'test', type: 'test', user: ownerUser });
  await item.save();
  const newType = 'test updated';
  const res = await request(server)
    .put(`/api/v1/items/${item._id}`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      type: newType,
    });
  return { newType, res };
};

const getDeleteItemByIdResult = async (jwt: string, ownerUser: string = '') => {
  const item = new ItemModel({ name: 'test', type: 'test', user: ownerUser });
  await item.save();
  const res = await request(server)
    .delete(`/api/v1/items/${item._id}`)
    .set('Authorization', `Bearer ${jwt}`);
  return { res };
};
