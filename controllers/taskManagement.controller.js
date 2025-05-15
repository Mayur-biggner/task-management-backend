import { validationResult } from "express-validator";
import Tasks from "../models/tasks.model.js";

export const getAllTasks = async (req, res) => {
    try {
        const { status, priority, assignee, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (assignee) filter.assignee = assignee;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Tasks.countDocuments(filter);


        const tasks = await Tasks.find(filter)
            .populate('assignee', 'name username email')
            .populate('createdBy', 'name username email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Tasks fetched successfully',
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            tasks,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const getTaskById = async (req, res) => {
    try {
        const { task_id } = req.params;
        const task = await Tasks.findById(task_id);
        if (!task) {
            return res.status(404).json({
                message: `Task ID: ${task_id} not found`,
            });
        }
        return res.status(200).json({
            message: `Task fetched successfully`,
            task
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const createTask = async (req, res) => {
    try {
        const { userId } = req.token;
        const { title, description, status, priority, assignee, dueDate } = req.body;
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const task = new Tasks({
            title,
            description,
            status,
            priority,
            assignee,
            dueDate,
            createdBy: userId
        });
        const newTask = await task.save();
        if (!newTask) {
            return res.status(400).json({
                message: `Task creation failed`,
            });
        }
        return res.status(200).json({
            message: `Task created successfully`,
            task: {
                id: newTask._id,
                title: newTask.title,
                description: newTask.description,
                status: newTask.status,
                priority: newTask.priority
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const updateTask = async (req, res) => {
    try {
        const { task_id } = req.params;
        const { userId, role } = req.token;
        console.log('req.token', req.token);
        const { title, description, status, priority, assignee, dueDate } = req.body;
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const task = await Tasks.findById(task_id);
        if (!task) {
            return res.status(404).json({
                message: `Task not found`,
            });
        }
        if (task.createdBy.toString() != userId || role != 'admin') {
            return res.status(403).json({
                message: `You are not authorized to update this task`,
            });
        }
        const updatedTask = await Tasks.findByIdAndUpdate(task_id, {
            title,
            description,
            status,
            priority,
            assignee,
            dueDate
        }, { new: true });

        return res.status(200).json({
            message: `Task updated successfully`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { userId, role } = req.token;
        const { task_id } = req.params;
        if (role != 'admin') {
            return res.status(403).json({
                message: `You are not authorized to delete this task`,
            });
        }
        const deleteTask = await Tasks.findByIdAndDelete(task_id);
        if (!deleteTask) {
            return res.status(404).json({
                message: `Task not found`,
            });
        }
        return res.status(200).json({
            message: `Task deleted`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
export const assignTask = async (req, res) => {
    try {
        const { task_id } = req.params;
        const { assignee } = req.body

        const assignTask = await Tasks.updateOne(
            { _id: task_id },
            { $set: { assignee } },
            { new: true }
        );
        if (!assignTask) {
            return res.status(404).json({
                message: `Task not found`,
            });
        }

        return res.status(200).json({
            message: `Task assigned successfully`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}