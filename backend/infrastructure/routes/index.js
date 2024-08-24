import { Router } from 'livesey-routing';
import { userRouter } from './userRouter.js';

export const router = Router.use('/user', userRouter);
