import { Router } from 'express';

import {
  createOne,
  getMany,
  getOne,
  updateOne,
  deleteOne,
} from '../controllers/users';

const router = Router();

router.post('/users', createOne);
router.get('/users', getMany);
router.get('/users/:id', getOne);
router.put('/users/:id', updateOne);
router.delete('/users/:id', deleteOne);

export default router;
