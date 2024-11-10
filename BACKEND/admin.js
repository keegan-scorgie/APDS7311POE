import bcrypt from 'bcryptjs';
import Employee from './models/employee.js'; 
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import Employee from './models/employee.js';
import dotenv from 'dotenv';

dotenv.config();

export const createAdmin = async () => {
    try {
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
        console.error('Error creating admin:', error);
    }
};
