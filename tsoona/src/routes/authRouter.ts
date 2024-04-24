import express from 'express';
import { loginUser, registerUser } from '../api/auth';

export const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/token');