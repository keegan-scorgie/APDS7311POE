import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Employee from '../models/employee.js'; 
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

dotenv.config();

const router = express.Router();

// rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
  message: "Too many login attempts, please try again later.",
});

// connect to MongoDB
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000, 
}).then(async () => {
  console.log('MongoDB connected');
  try {
    // checking if 'employees' collection exists and create it if not
    const collectionExists = await mongoose.connection.db.listCollections({ name: 'employees' }).hasNext();
    if (!collectionExists) {
      console.log("Employee collection doesn't exist, creating it...");
      await mongoose.connection.db.collection('employees').insertOne({ dummy: true });
      console.log("Employee collection created.");
    }

    // checking if  an admin account exists
    const existingAdmin = await Employee.findOne({ username: process.env.ADMIN_USERNAME });
    if (!existingAdmin) {
      const admin = new Employee({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
      });
      await admin.save();
      console.log('Admin account created successfully!');
    } else {
      console.log('Admin account already exists.');
    }
  } catch (error) {
    console.error("Error setting up employee collection or admin account:", error);
  }
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// login route with express-validator and rate limiting
router.post(
  '/login', 
  loginLimiter, // apply rate limiting to this route
  [
    body('username').notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.')
  ],
  async (req, res) => {
    const { username, password } = req.body;
    
    // validate input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const employee = await Employee.findOne({ username });
      if (!employee) {
        return res.status(401).json({ message: "Invalid username or password." });
      }

      const isMatch = await employee.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password." });
      }

      // generate JWT token after successful login
      const token = jwt.sign({ employeeId: employee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;