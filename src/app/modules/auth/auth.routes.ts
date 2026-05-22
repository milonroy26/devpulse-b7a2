import express from 'express';
import { AuthControllers } from './auth.controller';

const router = express.Router();

//? Signup Route
router.post('/signup', AuthControllers.signup);

//? Login Route
router.post('/login', AuthControllers.login);

export const AuthRoutes = router;