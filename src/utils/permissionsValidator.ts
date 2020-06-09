import { DocumentType } from '@typegoose/typegoose';
import { Request } from 'express';

import { USER_ROLES } from '../constants';
import { BaseEntity } from '../models/BaseEntity';

export const canMutateEntity = (
  entity: DocumentType<BaseEntity>,
  userInfo: { sub: string; role: string } | undefined,
): boolean => {
  if (userInfo && userInfo.role === USER_ROLES.ADMIN) {
    // admin can mutate any entity
    return true;
  }
  if (!entity.user || !userInfo || entity.user.toString() !== userInfo.sub) {
    // if there is no current authorized user role
    // or user tries to mutate not own entity
    return false;
  }
  return true;
};
