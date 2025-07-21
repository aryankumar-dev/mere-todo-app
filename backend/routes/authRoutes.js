import express from 'express';
import { register, login, refreshToken, logout,checkAuth } from '../controllers/authController.js';
import { body } from 'express-validator';


const router = express.Router();

router.post('/register',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    register
);

router.post('/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').exists().withMessage('Password is required'),
    ],
    login
);

router.get('/refresh', refreshToken);
router.post('/logout', logout);

router.get('/check', checkAuth);


export default router;
