import { Request, Response } from 'express';
import { User } from './auth.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, address, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

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
      phone,
      address,
    });

    // Save user to database
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate JWT token
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

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const socialLogin = async (req: Request, res: Response) => {
  try {
    const { name, email, image, method } = req.body;

    // Validate required fields
    if (!email || !method) {
      res.status(400).json({ message: 'Email and method are required' });
      return;
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with social login
      // Generate a random password for social login users
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

      user = new User({
        name: name || email.split('@')[0],
        email,
        password: randomPassword,
        image,
        method: method === 'github' ? 'github' : method === 'google' ? 'google' : 'credentials',
        role: 'user',
      });

      await user.save();
    } else {
      // Update existing user's image if provided and different
      if (image && user.image !== image) {
        user.image = image;
        await user.save();
      }
    }

    // Generate JWT token
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

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        image: user.image
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
