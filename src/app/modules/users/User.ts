import mongoose from 'mongoose';

interface IUser extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  role: string;
  image?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { type: String, default: 'user' },
  image: { type: String },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export { User, IUser };
