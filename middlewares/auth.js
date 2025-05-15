import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Users from "../models/users.models.js";
dotenv.config();

export const auth = (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader != 'undefined') {
            const bearer = bearerHeader.split(' ');
            const token = bearer[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('decoded Token', decoded);
            req.token = decoded;

            // Check if the token is expired
            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp < currentTime) {
                return res.status(403).json({ message: 'Token expired' });
            }
            // check the decoded token has the right values
            const user = Users.findById(decoded.userId);
            if (!user) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }
            next();
        }
        else {
            return res.status(401).json({ message: 'No Token Provided' });
        }
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}