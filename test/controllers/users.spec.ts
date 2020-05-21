import request from 'supertest';
import { expect } from 'chai';
import 'mocha';

import { server } from '../../src/server';
import { UserModel } from '../../src/models/User';

describe('User CRUD operations', () => {
  it('should create a new user  ', async () => {
    const itemsBefore = await UserModel.countDocuments();
    await request(server).post(`/api/v1/users`).send({
      name: 'user1',
      email: 'test@test.test',
      password: '123',
    });
    const itemsAfter = await UserModel.countDocuments();
    expect(itemsAfter).to.equal(itemsBefore + 1);
  });

  it('should get some users', async () => {
    for (const ind of [1, 2, 3]) {
      const user = new UserModel({
        name: `user-${ind}`,
        email: `test+${ind}@test.test`,
        password: '123',
      });
      await user.save();
    }
    const res = await request(server).get(`/api/v1/users`);
    expect(res.body.data.length).to.equal(3);
  });

  it('should get user by id', async () => {
    const user = new UserModel({
      name: 'user1',
      email: 'test@test.test',
      password: '123',
    });
    await user.save();
    const res = await request(server).get(`/api/v1/users/${user._id}`);
    expect(res.body.data._id).to.equal(user._id.toString());
  });

  it('should update a user', async () => {
    const user = new UserModel({
      name: 'user1',
      email: 'test@test.test',
      password: '123',
    });
    await user.save();
    const newName = 'user2';
    const res = await request(server).put(`/api/v1/users/${user._id}`).send({
      name: newName,
    });
    expect(res.body.data.name).to.equal(newName);
  });

  it('should delete a user', async () => {
    const user = new UserModel({
      name: 'user1',
      email: 'test@test.test',
      password: '123',
    });
    await user.save();
    const res = await request(server).delete(`/api/v1/users/${user._id}`);
    expect(res.body.data).to.equal(null);
  });
});
