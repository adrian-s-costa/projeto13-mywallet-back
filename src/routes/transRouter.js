import { getTrans, createTrans } from '../controllers/transController.js'
import validateUser from '../middlewares/validateUser.js';
import { Router } from 'express';

const router = Router();

router.post('/create-trans', validateUser, createTrans);
router.get('/transacoes', validateUser, getTrans);

export default router;