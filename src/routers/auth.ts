import { Router } from 'express';

import { authorized } from '../middleware/auth';
import { signup, login, logout } from '../controllers/auth';

const router = Router();

// Public APIs
router.post('/signup', signup);
router.post('/login', login);

// Private APIs
router.use(authorized);
router.get('/logout', logout);

export default router;
