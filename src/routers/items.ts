import { Router } from 'express';

import {
  createOne,
  getMany,
  getOne,
  updateOne,
  deleteOne,
} from '../controllers/items';

const router = Router();

router.post('/items', createOne);
router.get('/items', getMany);
router.get('/items/:id', getOne);
router.put('/items/:id', updateOne);
router.delete('/items/:id', deleteOne);

export default router;
