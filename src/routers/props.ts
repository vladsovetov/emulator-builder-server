import { Router } from 'express';

import { USER_ROLES } from '../constants';
import { authorized, role } from '../middleware/auth';
import {
  createOne,
  getMany,
  getOne,
  updateOne,
  deleteOne,
} from '../controllers/props';

const router = Router();

// Public APIs
router.get('/', getMany);
router.get('/:id', getOne);

// Private APIs
// Creator role
router.use(authorized, role(USER_ROLES.CREATOR));
router.post('/', createOne);
router.put('/:id', updateOne);
router.delete('/:id', deleteOne);

export default router;
