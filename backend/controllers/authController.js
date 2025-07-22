import User from '../models/User.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

// --- Consistent Cookie Options ---
// Define cookie options in one place to ensure consistency.
// The 'secure' attribute requires your backend to be running on HTTPS.
const accessTokenCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    path: '/',
    maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
// --- End of Cookie Options ---


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

        // ✅ Use the consistent cookie options
        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { id: user._id, username, email },
        });
    } catch (error) {
        // It's better not to expose raw error messages to the client in production
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: "An internal server error occurred." });
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

        // ✅ Use the consistent cookie options
        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
};

export const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ success: false, message: 'No refresh token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ success: false, message: 'Refresh token is invalid or expired.' });
        }

        const newAccessToken = user.generateAccessToken();
        
        // ✅ Use the consistent cookie options when refreshing the token
        res.cookie('accessToken', newAccessToken, accessTokenCookieOptions);

        res.status(200).json({ success: true, message: 'Access token refreshed successfully.' });
    } catch (error) {
        console.error("Refresh Token Error:", error);
        res.status(403).json({ success: false, message: "Failed to refresh token." });
    }
};

export const logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    try {
        if (token) {
            // Clear the refresh token from the database
            await User.updateOne({ refreshToken: token }, { $set: { refreshToken: "" } });
        }

        // ✅ When clearing cookies, specify the same options used to set them
        // This ensures the browser can find and remove them correctly.
        res.clearCookie('accessToken', { path: '/', sameSite: 'None', secure: true });
        res.clearCookie('refreshToken', { path: '/', sameSite: 'None', secure: true });
        
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
};

export const checkAuth = (req, res) => {
    // This endpoint relies on the cookie being sent correctly by the browser,
    // which the above fixes should ensure.
    const token = req.cookies.accessToken;
    if (!token) {
        return res.json({ isAuthenticated: false });
    }

    try {
        // This just verifies the token is valid, it doesn't refresh it.
        jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ isAuthenticated: true });
    } catch (error) {
        return res.json({ isAuthenticated: false });
    }
};
