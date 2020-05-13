import { Router } from 'express';

import {
  createOne,
  getMany,
  getOne,
  updateOne,
  deleteOne,
} from '../controllers/props';

const router = Router();

router.post('/props', createOne);
router.get('/props', getMany);
router.get('/props/:id', getOne);
router.put('/props/:id', updateOne);
router.delete('/props/:id', deleteOne);

export default router;
