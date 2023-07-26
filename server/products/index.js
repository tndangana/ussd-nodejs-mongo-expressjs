import express from 'express';
import { create, deleteProduct, findAll, findOne, update } from './products-resource.js';

const router = express.Router();

router.post('/', create);
router.get('/', findAll);
router.get('/:id', findOne);
router.put('/:id', update);
router.delete('/:id', deleteProduct);

export default router;