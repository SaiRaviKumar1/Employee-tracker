import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long.'],
      maxlength: [80, 'Name must be 80 characters or less.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
    },
    department: {
      type: String,
      required: [true, 'Department is required.'],
      trim: true,
      maxlength: [80, 'Department must be 80 characters or less.'],
    },
    position: {
      type: String,
      required: [true, 'Position is required.'],
      trim: true,
      maxlength: [80, 'Position must be 80 characters or less.'],
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Inactive'],
      default: 'Active',
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required.'],
      min: [0, 'Salary must be a non-negative number.'],
    },
    joinedOn: {
      type: Date,
      required: [true, 'Join date is required.'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model('Employee', employeeSchema);
