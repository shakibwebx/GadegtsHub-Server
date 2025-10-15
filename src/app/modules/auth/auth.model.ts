import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../../config';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  image?: string;
  method: 'credentials' | 'github' | 'google';
  role: 'user' | 'admin';
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    image: { type: String, trim: true },
    method: {
      type: String,
      enum: ['credentials', 'github', 'google'],
      default: 'credentials',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true },
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = Number(config.bcrypt_salt_rounds) || 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err as Error);
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);
