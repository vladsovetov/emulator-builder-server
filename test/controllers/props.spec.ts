import request from 'supertest';
import { expect } from 'chai';
import 'mocha';

import server from '../../src/server';
import { PropModel } from '../../src/models/Prop';

describe('Props CRUD operations', () => {
  it('should create a new prop', async () => {
    const itemsBefore = await PropModel.countDocuments();
    await request(server).post(`/api/v1/props`).send({
      name: 'test',
      value: 'new',
    });
    const itemsAfter = await PropModel.countDocuments();
    expect(itemsAfter).to.equal(itemsBefore + 1);
  });

  it('should get some props', async () => {
    for (const ind of [1, 2, 3]) {
      const prop = new PropModel({ name: `test-${ind}`, value: ind });
      await prop.save();
    }
    const res = await request(server).get(`/api/v1/props`);
    expect(res.body.data.length).to.equal(3);
  });

  it('should get a prop by id', async () => {
    const prop = new PropModel({ name: 'test', value: 0 });
    await prop.save();
    const res = await request(server).get(`/api/v1/props/${prop._id}`);
    expect(res.body.data._id).to.equal(prop._id.toString());
  });

  it('should update a prop', async () => {
    const prop = new PropModel({ name: 'test', value: 0 });
    await prop.save();
    const newValue = '1';
    const res = await request(server).put(`/api/v1/props/${prop._id}`).send({
      value: newValue,
    });
    expect(res.body.data.value).to.equal(newValue);
  });

  it('should delete a prop', async () => {
    const prop = new PropModel({ name: 'test', value: 0 });
    await prop.save();
    const res = await request(server).delete(`/api/v1/props/${prop._id}`);
    expect(res.body.data).to.equal(null);
  });
});
