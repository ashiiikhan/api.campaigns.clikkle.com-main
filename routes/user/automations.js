import express from 'express';
import { createAutomation, getAutomations, getAutomation } from '../../controllers/automationController.js';

const router = express.Router();

router.post('/', createAutomation);
router.get('/', getAutomations);
router.get('/:id', getAutomation);

export default router;
