import { Router } from 'express';

import {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
} from '../controllers/items';

const router = Router();

router.post('/items', createItem);
router.get('/items', getItems);
router.get('/items/:id', getItem);
router.put('/items/:id', updateItem);
router.delete('/items/:id', deleteItem);

export default router;
