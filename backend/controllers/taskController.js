import Task from '../models/Task.js';
import { validationResult } from 'express-validator';

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.status(200).json({ success: true, count: tasks.length, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const task = await Task.create({
            user: req.user.id,
            title: req.body.title,
        });
        res.status(201).json({ success: true, message: 'Task created', task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { $set: req.body },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(200).json({ success: true, message: 'Task updated', task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(200).json({ success: true, message: 'Task deleted', task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
