import { Router } from 'express';

import {
  createOne,
  getMany,
  getOne,
  updateOne,
  deleteOne,
} from '../controllers/collections';

const router = Router();

router.post('/collections', createOne);
router.get('/collections', getMany);
router.get('/collections/:id', getOne);
router.put('/collections/:id', updateOne);
router.delete('/collections/:id', deleteOne);

export default router;
