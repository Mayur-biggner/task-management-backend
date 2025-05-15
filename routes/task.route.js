import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { assignTask, createTask, deleteTask, getAllTasks, getTaskById, updateTask } from "../controllers/taskManagement.controller.js";
import { check } from "express-validator";

const router = Router();
const validation = {
    title: check('title').notEmpty().withMessage('Title is required'),
    description: check('description').notEmpty().withMessage('Description is required'),
    assignee: check('assignee').notEmpty().withMessage('Asignee is required'),
}

router.get("/", auth, getAllTasks);
router.get("/:task_id", auth, getTaskById);
router.post("/", auth, [validation.title, validation.description], createTask);
router.put("/:task_id", auth, [validation.title, validation.description], updateTask);
router.patch("/assign/:task_id", auth, [validation.assignee], assignTask);
router.delete("/:task_id", auth, deleteTask);


export default router;