import { Request, Response } from 'express';
import { User } from './auth.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';

const randomPass = Math.ceil(Math.random() * 1000000);

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;

    const password = req.body.password || randomPass;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create new user
    const user = new User({
      name,
      email,
      role,
      password,
    });

    // Save user to database
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user!.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }
    // ! for postman Testing get token in result
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      config.jwt_secret as string,
      {
        expiresIn: '1d',
      },
    );

    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
