import { Router } from 'express';

import {
  createOne,
  getMany,
  getOne,
  updateOne,
  deleteOne,
} from '../controllers/panels';

const router = Router();

router.post('/panels', createOne);
router.get('/panels', getMany);
router.get('/panels/:id', getOne);
router.put('/panels/:id', updateOne);
router.delete('/panels/:id', deleteOne);

export default router;
