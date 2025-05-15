import { Router } from 'express';
import { check } from 'express-validator';
import dotenv from 'dotenv';
import { getUsers, loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js';
import { auth } from '../middlewares/auth.js';
dotenv.config();

const validationChecks = {
  username: check('username', 'Username is required').notEmpty(),
  email: check('email', 'Email is required').isEmail(),
  password: check('password', 'Password is required').isLength({ min: 8 }),
};

const router = Router();

router.post('/register',
  [validationChecks.username, validationChecks.password, validationChecks.email], registerUser);

router.post('/login', [validationChecks.username, validationChecks.password], loginUser);

router.post('/logout', logoutUser);

router.get('/', auth, getUsers);

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

export default router;
