import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();


mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        console.log('Attempting to find employee');

       
        const employee = await mongoose.connection.db.collection('employees').findOne({ username });

        if (!employee) {
            console.log('Employee not found');
            return res.status(401).json({ message: "Invalid username or password." });
        }

        console.log('Comparing passwords');
        const isMatch = await bcrypt.compare(password, employee.password);

        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(401).json({ message: "Invalid username or password." });
        }

        const token = jwt.sign({ employeeId: employee._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        console.log('Login successful');
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;