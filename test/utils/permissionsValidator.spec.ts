import { Types } from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import { expect } from 'chai';
import 'mocha';

import { USER_ROLES } from '../../src/constants';
import { BaseEntity } from '../../src/models/BaseEntity';
import { canMutateEntity } from '../../src/utils/permissionsValidator';

describe('permissionsValidator', () => {
  describe('canMutateEntity', () => {
    const BaseEntityModel = getModelForClass(BaseEntity);

    it('should allow ADMIN to mutate not own entity', async () => {
      const userId = Types.ObjectId();
      const entity = new BaseEntityModel({ name: 'test', user: userId });
      const user = {
        sub: userId.toHexString(),
        role: USER_ROLES.ADMIN,
      };
      expect(canMutateEntity(entity, user)).to.be.true;
    });

    it('should allow CREATOR mutate own entity', async () => {
      const userId = Types.ObjectId();
      const entity = new BaseEntityModel({ name: 'test', user: userId });
      const user = {
        sub: userId.toHexString(),
        role: USER_ROLES.CREATOR,
      };
      expect(canMutateEntity(entity, user)).to.be.true;
    });

    it('should not allow CREATOR to mutate not own entity', async () => {
      const userId = Types.ObjectId();
      const anotherUserId = Types.ObjectId();
      const entity = new BaseEntityModel({ name: 'test', user: anotherUserId });
      const user = {
        sub: userId.toHexString(),
        role: USER_ROLES.CREATOR,
      };
      expect(canMutateEntity(entity, user)).to.be.not.true;
    });

    it('should not allow USER to mutate an entity', async () => {
      const userId = Types.ObjectId();
      const anotherUserId = Types.ObjectId();
      const entity = new BaseEntityModel({ name: 'test', user: anotherUserId });
      const user = {
        sub: userId.toHexString(),
        role: USER_ROLES.USER,
      };
      expect(canMutateEntity(entity, user)).to.be.not.true;
    });
  });
});
