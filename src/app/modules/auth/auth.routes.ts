import { Router } from 'express';
import { loginUser, registerUser } from './auth.controller';

const authRouter = Router();

authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);

export default authRouter;
