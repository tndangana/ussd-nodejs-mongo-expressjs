import express from 'express';
import { validateRegistrant } from './registrant-resource.js';

const router = express.Router();

router.get('/:regNumber', validateRegistrant);

export default router;