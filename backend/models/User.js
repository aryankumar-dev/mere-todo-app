import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    refreshToken: {
        type: String,
        default: "",
    }
}, { timestamps: true });

// Password hash before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate Access Token
// Generate Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { id: this._id, username: this.username }, 
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
         { id: this._id, username: this.username },
        process.env.REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

export default mongoose.model('User', userSchema);
