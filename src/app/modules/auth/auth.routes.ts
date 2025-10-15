import { Router } from 'express';
import { loginUser, registerUser, socialLogin } from './auth.controller';

const authRouter = Router();

authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);
authRouter.post('/social-login', socialLogin);

export default authRouter;
