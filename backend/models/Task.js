import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
