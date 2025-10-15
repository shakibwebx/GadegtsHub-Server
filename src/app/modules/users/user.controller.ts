import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../auth/auth.model';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await User.find(); // You can add filtering/pagination here later
    res.status(httpStatus.OK).json(users);
  } catch (error) {
    next(error);
  }
};
// Get user by email
export const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};
// Update user details
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  const { name, phone, address, password } = req.body;

  try {
    // Find the user first
    const user = await User.findById(id);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Prepare update data
    const updateData: any = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    // Hash password if provided
    if (password) {
      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    // Handle image upload if file exists
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_profiles',
      });
      updateData.image = result.secure_url;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    res.status(httpStatus.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
// Get a user by ID
export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};
// Get current authenticated user
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    res.status(httpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};
