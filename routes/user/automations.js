import express from 'express';
import { createAutomation, getAutomations, getAutomation, updateAutomation, testTrigger } from '../../controllers/automationController.js';

const router = express.Router();

router.post('/', createAutomation);
router.get('/', getAutomations);
router.patch('/:id', updateAutomation);
router.get('/:id', getAutomation);
router.post('/test-trigger', testTrigger);

export default router;
