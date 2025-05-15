import { validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Roles from "../models/roles.model.js";
import Users from "../models/users.models.js";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, name, role } = req.body;
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Check if user already exists
        const existingUser = await Users.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        // Check if role exists
        const roleExists = await Roles.findOne({ name: role });
        if (!roleExists) {
            return res.status(400).json({ message: 'Invalid Role Provided' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new Users({
            username,
            email,
            password: hashedPassword,
            name,
            role: roleExists._id,
        });
        const user = await newUser.save();

        return res.status(200).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: roleExists.name,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Check if user exists
        const user = await Users.findOne({ $or: [{ username }, { email: username }] }).populate('role', 'name');
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log('user', user);
        // Create and assign a token
        const token = jwt.sign({ userId: user._id, username: user.username, role: user.role.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const logoutUser = async (req, res) => {
    try {
        return res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await Users.find({}, '_id, name, email, username');

        if (!users) {
            res.status(500).json({ message: "Unable to Fetch USers" })
        }
        return res.status(200).json({ users })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}