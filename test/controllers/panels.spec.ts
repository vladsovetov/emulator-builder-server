import request from 'supertest';
import { expect } from 'chai';
import 'mocha';

import { USER_ROLES } from '../../src/constants';
import { server } from '../../src/server';
import { PanelModel } from '../../src/models/Panel';

describe('Panel CRUD operations', () => {
  describe('as ADMIN', () => {
    let jwt = '';
    before(() => {
      jwt = global.users.getJwtByRole(USER_ROLES.ADMIN);
    });

    it('should create a new panel', async () => {
      const { itemsBefore, itemsAfter } = await getCreateItemResult(jwt);
      expect(itemsAfter).to.equal(itemsBefore + 1);
    });

    it('should get some panels', async () => {
      const { count, res } = await getItemsResult(jwt);
      expect(res.body.data.length).to.equal(count);
    });

    it('should get a panel by id', async () => {
      const { panel, res } = await getItemByIdResult(jwt);
      expect(res.body.data._id).to.equal(panel._id.toString());
    });

    it('should update a panel', async () => {
      const { newName, res } = await getUpdateItemByIdResult(jwt);
      expect(res.body.data.name).to.equal(newName);
    });

    it('should delete a panel', async () => {
      const { res } = await getDeleteItemByIdResult(jwt);
      expect(res.body.data).to.equal(null);
    });
  });

  describe('as CREATOR', () => {
    let jwt = '';
    before(() => {
      jwt = global.users.getJwtByRole(USER_ROLES.CREATOR);
    });

    it('should not create a new panel', async () => {
      const { itemsBefore, itemsAfter } = await getCreateItemResult(jwt);
      expect(itemsAfter).to.equal(itemsBefore);
    });

    it('should get some panels', async () => {
      const { count, res } = await getItemsResult(jwt);
      expect(res.body.data.length).to.equal(count);
    });

    it('should get a panel by id', async () => {
      const { panel, res } = await getItemByIdResult(jwt);
      expect(res.body.data._id).to.equal(panel._id.toString());
    });

    it('should not update a panel', async () => {
      const { newName, res } = await getUpdateItemByIdResult(jwt);
      expect(res.body.data).to.be.undefined;
    });

    it('should not delete a panel', async () => {
      const { res } = await getDeleteItemByIdResult(jwt);
      expect(res.body.data).to.be.undefined;
    });
  });

  describe('as USER', () => {
    let jwt = '';
    before(() => {
      jwt = global.users.getJwtByRole(USER_ROLES.USER);
    });

    it('should not create a new panel', async () => {
      const { itemsBefore, itemsAfter } = await getCreateItemResult(jwt);
      expect(itemsAfter).to.equal(itemsBefore);
    });

    it('should get some panels', async () => {
      const { count, res } = await getItemsResult(jwt);
      expect(res.body.data.length).to.equal(count);
    });

    it('should get a panel by id', async () => {
      const { panel, res } = await getItemByIdResult(jwt);
      expect(res.body.data._id).to.equal(panel._id.toString());
    });

    it('should not update a panel', async () => {
      const { newName, res } = await getUpdateItemByIdResult(jwt);
      expect(res.body.data).to.be.undefined;
    });

    it('should not delete a panel', async () => {
      const { res } = await getDeleteItemByIdResult(jwt);
      expect(res.body.data).to.be.undefined;
    });
  });
});

const getCreateItemResult = async (jwt: string) => {
  const itemsBefore = await PanelModel.countDocuments();
  await request(server)
    .post(`/api/v1/panels`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      name: 'panel1',
      type: 'type1',
      settings: {
        visible: true,
        cells: [],
      },
    });
  const itemsAfter = await PanelModel.countDocuments();
  return {
    itemsBefore,
    itemsAfter,
  };
};

const getItemsResult = async (jwt: string) => {
  for (const ind of [1, 2, 3]) {
    const panel = new PanelModel({
      name: `panel-${ind}`,
      type: `type-${ind}`,
      settings: {
        visible: true,
        cells: [],
      },
    });
    await panel.save();
  }
  const res = await request(server)
    .get(`/api/v1/panels`)
    .set('Authorization', `Bearer ${jwt}`);

  return { count: 3, res };
};

const getItemByIdResult = async (jwt: string) => {
  const panel = new PanelModel({
    name: 'panel1',
    type: 'type1',
    settings: {
      visible: true,
    },
  });
  await panel.save();
  const res = await request(server)
    .get(`/api/v1/panels/${panel._id}`)
    .set('Authorization', `Bearer ${jwt}`);
  return { panel, res };
};

const getUpdateItemByIdResult = async (jwt: string) => {
  const panel = new PanelModel({
    name: 'panel1',
    type: 'type1',
    settings: {
      visible: true,
    },
  });
  await panel.save();
  const newName = 'panel2';
  const res = await request(server)
    .put(`/api/v1/panels/${panel._id}`)
    .set('Authorization', `Bearer ${jwt}`)
    .send({
      name: newName,
    });
  return { newName, res };
};

const getDeleteItemByIdResult = async (jwt: string) => {
  const panel = new PanelModel({
    name: 'panel1',
    type: 'type1',
    settings: {
      visible: true,
    },
  });
  await panel.save();
  const res = await request(server)
    .delete(`/api/v1/panels/${panel._id}`)
    .set('Authorization', `Bearer ${jwt}`);
  return { res };
};
