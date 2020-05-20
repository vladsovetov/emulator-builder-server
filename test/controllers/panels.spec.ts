import request from 'supertest';
import { expect } from 'chai';
import 'mocha';

import { server } from '../../src/server';
import { PanelModel } from '../../src/models/Panel';

describe('Panel CRUD operations', () => {
  it('should create a new panel  ', async () => {
    const itemsBefore = await PanelModel.countDocuments();
    await request(server)
      .post(`/api/v1/panels`)
      .send({
        name: 'panel1',
        type: 'type1',
        settings: {
          visible: true,
          cells: [],
        },
      });
    const itemsAfter = await PanelModel.countDocuments();
    expect(itemsAfter).to.equal(itemsBefore + 1);
  });

  it('should get some panels', async () => {
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
    const res = await request(server).get(`/api/v1/panels`);
    expect(res.body.data.length).to.equal(3);
  });

  it('should get a panel by id', async () => {
    const panel = new PanelModel({
      name: 'panel1',
      type: 'type1',
      settings: {
        visible: true,
      },
    });
    await panel.save();
    const res = await request(server).get(`/api/v1/panels/${panel._id}`);
    expect(res.body.data._id).to.equal(panel._id.toString());
  });

  it('should update a panel', async () => {
    const panel = new PanelModel({
      name: 'panel1',
      type: 'type1',
      settings: {
        visible: true,
      },
    });
    await panel.save();
    const newName = 'panel2';
    const res = await request(server).put(`/api/v1/panels/${panel._id}`).send({
      name: newName,
    });
    expect(res.body.data.name).to.equal(newName);
  });

  it('should delete a panel', async () => {
    const panel = new PanelModel({
      name: 'panel1',
      type: 'type1',
      settings: {
        visible: true,
      },
    });
    await panel.save();
    const res = await request(server).delete(`/api/v1/panels/${panel._id}`);
    expect(res.body.data).to.equal(null);
  });
});
