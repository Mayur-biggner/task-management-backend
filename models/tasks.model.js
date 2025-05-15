import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["to-do", "in-progress", "done"],
        default: "to-do",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    dueDate: {
        type: Date,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

taskSchema.index({ status: 1, priority: 1, assignee: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ assignee: 1 });

const Tasks = mongoose.model("Tasks", taskSchema);
export default Tasks;