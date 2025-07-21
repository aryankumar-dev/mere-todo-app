import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

router.get('/', protect, getTasks);

router.post('/',
    protect,
    [
        body('title').notEmpty().withMessage('Task title is required')
    ],
    createTask
);

router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;
