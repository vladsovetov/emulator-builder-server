import request from 'supertest';
import { expect } from 'chai';
import 'mocha';

import { USER_ROLES } from '../../src/constants';
import { server } from '../../src/server';
import { UserModel } from '../../src/models/User';

describe('User CRUD operations', () => {
  describe('as ADMIN', () => {
    let jwt = '';
    before(() => {
      jwt = global.users.getJwtByRole(USER_ROLES.ADMIN);
    });

    it('should create a new user', async () => {
      const { itemsBefore, itemsAfter } = await getCreateItemResult(jwt, 100);
      expect(itemsAfter).to.equal(itemsBefore + 1);
    });

    it('should get some users', async () => {
      const { res } = await getItemsResult(jwt, 200);
      expect(res.body.data.length).to.greaterThan(0);
    });

    it('should get user by id', async () => {
      const { user, res } = await getItemByIdResult(jwt, 300);
      expect(res.body.data._id).to.equal(user._id.toString());
    });

    it('should update a user', async () => {
      const { newName, res } = await getUpdateItemByIdResult(jwt, 400);
      expect(res.body.data.name).to.equal(newName);
    });

    it('should delete a user', async () => {
      const { res } = await getDeleteItemByIdResult(jwt, 500);
      expect(res.body.data).to.equal(null);
    });
  });

  describe('as CREATOR', () => {
    let jwt = '';
    before(() => {
      jwt = global.users.getJwtByRole(USER_ROLES.CREATOR);
    });

    it('should not create a new user', async () => {
      const { itemsBefore, itemsAfter } = await getCreateItemResult(jwt, 600);
      expect(itemsAfter).to.equal(itemsBefore);
    });

    it('should not get some users', async () => {
      const { res } = await getItemsResult(jwt, 700);
      expect(res.body.data).to.be.undefined;
    });

    it('should not get user by id', async () => {
      const { user, res } = await getItemByIdResult(jwt, 800);
      expect(res.body.data).to.be.undefined;
    });

    it('should not update a user', async () => {
      const { newName, res } = await getUpdateItemByIdResult(jwt, 900);
      expect(res.body.data).to.be.undefined;
    });

    it('should not delete a user', async () => {
      const { res } = await getDeleteItemByIdResult(jwt, 1000);
      expect(res.body.data).to.be.undefined;
    });
  });

  describe('as USER', () => {
    let jwt = '';
    before(() => {
      jwt = global.users.getJwtByRole(USER_ROLES.USER);
    });

    it('should not create a new user', async () => {
      const { itemsBefore, itemsAfter } = await getCreateItemResult(jwt, 1100);
      expect(itemsAfter).to.equal(itemsBefore);
    });

    it('should not get some users', async () => {
      const { res } = await getItemsResult(jwt, 1200);
      expect(res.body.data).to.be.undefined;
    });

    it('should not get user by id', async () => {
      const { user, res } = await getItemByIdResult(jwt, 1300);
      expect(res.body.data).to.be.undefined;
    });

    it('should not update a user', async () => {
      const { newName, res } = await getUpdateItemByIdResult(jwt, 1400);
      expect(res.body.data).to.be.undefined;
    });

    it('should not delete a user', async () => {
      const { res } = await getDeleteItemByIdResult(jwt, 1500);
      expect(res.body.data).to.be.undefined;
    });
  });
});

const getCreateItemResult = async (jwt: string, userIndex: number = 0) => {
  const itemsBefore = await UserModel.countDocuments();
  await request(server)
    .post(`/api/v1/users`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      name: `user-${userIndex}`,
      email: `test-${userIndex}@test.test`,
      password: '123',
    });
  const itemsAfter = await UserModel.countDocuments();
  return {
    itemsBefore,
    itemsAfter,
  };
};

const getItemsResult = async (jwt: string, userIndex: number = 0) => {
  for (const ind of [1, 2, 3]) {
    const user = new UserModel({
      name: `user-${ind + userIndex}`,
      email: `test+${ind + userIndex}@test.test`,
      password: '123',
    });
    await user.save();
  }
  const res = await request(server)
    .get(`/api/v1/users`)
    .set('Authorization', `Bearer ${jwt}`);

  return { count: 3, res };
};

const getItemByIdResult = async (jwt: string, userIndex: number = 0) => {
  const user = new UserModel({
    name: `user-${userIndex}`,
    email: `test-${userIndex}@test.test`,
    password: '123',
  });
  await user.save();
  const res = await request(server)
    .get(`/api/v1/users/${user._id}`)
    .set('Authorization', `Bearer ${jwt}`);
  return { user, res };
};

const getUpdateItemByIdResult = async (jwt: string, userIndex: number = 0) => {
  const user = new UserModel({
    name: `user-${userIndex}`,
    email: `test-${userIndex}@test.test`,
    password: '123',
  });
  await user.save();
  const newName = 'user2';
  const res = await request(server)
    .put(`/api/v1/users/${user._id}`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      name: newName,
    });
  return { newName, res };
};

const getDeleteItemByIdResult = async (jwt: string, userIndex: number = 0) => {
  const user = new UserModel({
    name: `user-${userIndex}`,
    email: `test-${userIndex}@test.test`,
    password: '123',
  });
  await user.save();
  const res = await request(server)
    .delete(`/api/v1/users/${user._id}`)
    .set('Authorization', `Bearer ${jwt}`);
  return { res };
};
