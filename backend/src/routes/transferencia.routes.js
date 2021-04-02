import express from 'express'
const router = express.Router();
import verify from '../middleware/verifiyHandlerMiddleware'
import { transferShema } from '../validations/transferencia'
import { listTranfer, transfer } from '../controllers/transferencia.controller';

/**
 * GET - /transferencia
 * POST - /transferencia
 */
router.route('/')
    .get(listTranfer)
    .post(verify(transferShema), transfer)   

export default router;