import User from '../models/User.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({ username, email, password });

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { id: user._id, username, email },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

       res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
   
    maxAge: 15 * 60 * 1000,
});
res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  
    maxAge: 7 * 24 * 60 * 60 * 1000,
});


        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ success: false, message: 'Invalid refresh token' });
        }

        const newAccessToken = user.generateAccessToken();
        res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });

        res.status(200).json({ success: true, message: 'Access token refreshed' });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
};

// Logout Controller (requires protect)
export const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.refreshToken = "";
            await user.save();
        }

        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'None', secure: true });
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });

        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Route: GET /api/auth/check
export const checkAuth = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.json({ success: false });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
return res.json({ success: true, username: decoded.username });

    } catch (error) {
        return res.json({ success: false });
    }
};
