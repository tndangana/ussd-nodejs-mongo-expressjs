import express from 'express';
import { userPayment } from './ussd_resource.js';

const router = express.Router();

router.post('/', userPayment);

export default router;