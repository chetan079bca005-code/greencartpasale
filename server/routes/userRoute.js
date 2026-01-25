import express from 'express';
import { isAuth, login, logout, register, updatePassword, updateSettings, updateProfile, deleteAccount } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import { validateRegistration } from '../middlewares/validateUser.js';

const userRouter = express.Router();

userRouter.post('/register', validateRegistration, register);
userRouter.post('/login', login);
userRouter.get('/is-auth', authUser, isAuth);
userRouter.get('/logout', authUser, logout);
userRouter.post('/update-password', authUser, updatePassword);
userRouter.post('/update-settings', authUser, updateSettings);
userRouter.post('/update-profile', authUser, updateProfile);
userRouter.delete('/delete-account', authUser, deleteAccount);

export default userRouter;