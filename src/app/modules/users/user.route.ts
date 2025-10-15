import express from 'express';
import {
  getUserByEmail,
  updateUser,
  getSingleUser,
  getCurrentUser,
  getAllUsers,
} from './user.controller';
import auth from '../../middlewares/auth';
import { upload } from '../../config/cloudinary.config';

const userRouter = express.Router();

userRouter.get('/', auth('admin'), getAllUsers);
userRouter.get('/email/:email', getUserByEmail);
userRouter.patch('/:id', upload.single('image'), updateUser);
userRouter.get('/:id', getSingleUser);
userRouter.get('/me', auth('user', 'admin'), getCurrentUser);

export default userRouter;
