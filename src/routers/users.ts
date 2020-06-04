import { Router } from 'express';

import { USER_ROLES } from '../constants';
import { authorized, role } from '../middleware/auth';
import {
  createOne,
  getMany,
  getOne,
  updateOne,
  deleteOne,
} from '../controllers/users';

const router = Router();

// Private APIs
// Admin role
router.use(authorized, role(USER_ROLES.ADMIN));
router.post('/', createOne);
router.get('/', getMany);
router.get('/:id', getOne);
router.put('/:id', updateOne);
router.delete('/:id', deleteOne);

export default router;
