import { getTrans, createTrans } from '../controllers/transController'
import validateUser from '../middlewares/validateUser.js';
import { Router } from 'express';

const router = Router();

router.get('/posts', validateUser, getPosts);
router.post('/create-trans', createTrans);

export default router;