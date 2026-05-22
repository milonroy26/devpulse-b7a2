import express from 'express';
import { AuthRoutes } from './modules/auth/auth.routes';
import { IssueRoutes } from './modules/issue/issue.routes';

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/issues', IssueRoutes);

export default router;