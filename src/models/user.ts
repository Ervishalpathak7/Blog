import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

// User interface definition
export interface IUser {
  username: string;
  password: string;
  email: string;
  role: 'user' | 'admin';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
    x?: string;
    youtube?: string;
    instagram?: string;
  };
}

// User schema definition
// This schema defines the structure of a user document in MongoDB
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [20, 'Username must be at most 20 characters long'],
      trim: true,
      lowercase: true,
      unique: [true, 'Username must be unique'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters long'],
      maxlength: [128, 'Password must be at most 128 characters long'],
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Please fill a valid email address',
      ],
      unique: [true, 'Email must be unique'],
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },
    firstName: {
      type: String,
      maxlength: [50, 'First name must be at most 50 characters long'],
    },
    lastName: {
      type: String,
      maxlength: [50, 'Last name must be at most 50 characters long'],
    },
    socialLinks: {
      github: {
        type: String,
        match: [
          /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+$/,
          'Please fill a valid GitHub URL',
        ],
        maxlength: [100, 'GitHub URL must be at most 100 characters long'],
      },
      linkedin: {
        type: String,
        match: [
          /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+$/,
          'Please fill a valid LinkedIn URL',
        ],
        maxlength: [100, 'LinkedIn URL must be at most 100 characters long'],
      },
      website: {
        type: String,
        maxlength: [100, 'Website URL must be at most 100 characters long'],
      },
      x: {
        type: String,
        match: [
          /^https?:\/\/(www\.)?x\.com\/[a-zA-Z0-9_-]+$/,
          'Please fill a valid X URL',
        ],
        maxlength: [100, 'X URL must be at most 100 characters long'],
      },
      youtube: {
        type: String,
        match: [
          /^https?:\/\/(www\.)?youtube\.com\/[a-zA-Z0-9_-]+$/,
          'Please fill a valid YouTube URL',
        ],
        maxlength: [100, 'YouTube URL must be at most 100 characters long'],
      },
      instagram: {
        type: String,
        match: [
          /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_-]+$/,
          'Please fill a valid Instagram URL',
        ],
        maxlength: [100, 'Instagram URL must be at most 100 characters long'],
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // Hash the password before saving the user document
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});




export default model<IUser>('User', userSchema);
