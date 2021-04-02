import express from 'express'
const router = express.Router();
import { reload, status, getUser } from '../controllers/system.controller';

/**
 * GET - /system/reload
 */
router.route('/reload')
    .get(reload)

/**
 * GET - /system/usuario
 */
router.route('/usuario')
    .get(getUser)

/**
 * GET - /system/status
 * */    
router.route('/status')
    .get(status)

export default router;