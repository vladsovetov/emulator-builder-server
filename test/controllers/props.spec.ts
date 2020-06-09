import request from 'supertest';
import { expect } from 'chai';
import 'mocha';
import { decode } from 'jsonwebtoken';

import { USER_ROLES } from '../../src/constants';
import { server } from '../../src/server';
import { PropModel } from '../../src/models/Prop';

describe('Props CRUD operations', () => {
  describe('as ADMIN', () => {
    let jwt = '';
    before(() => {
      jwt = global.users.getJwtByRole(USER_ROLES.ADMIN);
    });

    it('should create a new prop', async () => {
      const { itemsBefore, itemsAfter } = await getCreateItemResult(jwt);
      expect(itemsAfter).to.equal(itemsBefore + 1);
    });

    it('should get some props', async () => {
      const { res } = await getItemsResult(jwt);
      expect(res.body.data.length).to.equal(3);
    });

    it('should get a prop by id', async () => {
      const { prop, res } = await getItemByIdResult(jwt);
      expect(res.body.data._id).to.equal(prop._id.toString());
    });

    it('should update a prop', async () => {
      const decoded = decode(jwt);
      const { newValue, res } = await getUpdateItemByIdResult(
        jwt,
        decoded?.sub,
      );
      expect(res.body.data.value).to.equal(newValue);
    });

    it('should delete a prop', async () => {
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

    it('should create a new prop', async () => {
      const { itemsBefore, itemsAfter } = await getCreateItemResult(jwt);
      expect(itemsAfter).to.equal(itemsBefore + 1);
    });

    it('should get some props', async () => {
      const { res } = await getItemsResult(jwt);
      expect(res.body.data.length).to.equal(3);
    });

    it('should get a prop by id', async () => {
      const { prop, res } = await getItemByIdResult(jwt);
      expect(res.body.data._id).to.equal(prop._id.toString());
    });

    it('should update a prop', async () => {
      const decoded = decode(jwt);
      const { newValue, res } = await getUpdateItemByIdResult(
        jwt,
        decoded?.sub,
      );
      expect(res.body.data.value).to.equal(newValue);
    });

    it('should not update not own prop', async () => {
      // create a prop as an admin
      const decoded = decode(global.users.getJwtByRole(USER_ROLES.ADMIN));
      const { newValue, res } = await getUpdateItemByIdResult(
        jwt,
        decoded?.sub,
      );
      expect(res.body.error).to.be.not.empty;
    });

    it('should delete a prop', async () => {
      const decoded = decode(jwt);
      const { res } = await getDeleteItemByIdResult(jwt, decoded?.sub);
      expect(res.body.data).to.equal(null);
    });

    it('should not delete not own prop', async () => {
      // create a prop as an admin
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

    it('should not create a new prop', async () => {
      const { itemsBefore, itemsAfter } = await getCreateItemResult(jwt);
      expect(itemsAfter).to.equal(itemsBefore);
    });

    it('should get some props', async () => {
      const { res } = await getItemsResult(jwt);
      expect(res.body.data.length).to.equal(3);
    });

    it('should get a prop by id', async () => {
      const { prop, res } = await getItemByIdResult(jwt);
      expect(res.body.data._id).to.equal(prop._id.toString());
    });

    it('should not update a prop', async () => {
      const decoded = decode(jwt);
      const { newValue, res } = await getUpdateItemByIdResult(
        jwt,
        decoded?.sub,
      );
      expect(res.body.error).to.be.not.empty;
    });

    it('should not delete a prop', async () => {
      const decoded = decode(jwt);
      const { res } = await getDeleteItemByIdResult(jwt, decoded?.sub);
      expect(res.body.error).to.be.not.empty;
    });
  });
});

const getCreateItemResult = async (jwt: string) => {
  const itemsBefore = await PropModel.countDocuments();
  await request(server)
    .post(`/api/v1/props`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      name: 'test',
      value: 'new',
    });
  const itemsAfter = await PropModel.countDocuments();
  return {
    itemsBefore,
    itemsAfter,
  };
};

const getItemsResult = async (jwt: string) => {
  for (const ind of [1, 2, 3]) {
    const prop = new PropModel({ name: `test-${ind}`, value: ind });
    await prop.save();
  }
  const res = await request(server)
    .get(`/api/v1/props`)
    .set('Authorization', `Bearer ${jwt}`);

  return { count: 3, res };
};

const getItemByIdResult = async (jwt: string) => {
  const prop = new PropModel({ name: 'test', value: 0 });
  await prop.save();
  const res = await request(server)
    .get(`/api/v1/props/${prop._id}`)
    .set('Authorization', `Bearer ${jwt}`);
  return { prop, res };
};

const getUpdateItemByIdResult = async (jwt: string, ownerUser: string = '') => {
  const prop = new PropModel({ name: 'test', value: 0, user: ownerUser });
  await prop.save();
  const newValue = '1';
  const res = await request(server)
    .put(`/api/v1/props/${prop._id}`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      value: newValue,
    });
  return { newValue, res };
};

const getDeleteItemByIdResult = async (jwt: string, ownerUser: string = '') => {
  const prop = new PropModel({ name: 'test', value: 0, user: ownerUser });
  await prop.save();
  const res = await request(server)
    .delete(`/api/v1/props/${prop._id}`)
    .set('Authorization', `Bearer ${jwt}`);
  return { res };
};
