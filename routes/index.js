import { Router } from 'express';
import * as usersRouter from './users.route.js';
import * as taskRouter from './task.route.js';
const router = Router();

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.json({ message: 'Welcome to the Task Management' });
// });
console.log('reached here');
router.use('/users', usersRouter.default);
router.use('/task', taskRouter.default);

export default router;
