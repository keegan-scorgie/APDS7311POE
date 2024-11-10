import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const employeeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'employee'], 
    default: 'employee',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


employeeSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


employeeSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


const Employee = mongoose.model('Employee', employeeSchema, 'employees'); 

export default Employee;