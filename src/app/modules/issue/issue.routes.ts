import express from 'express';
import authMiddleware from '../../../middleware/auth.middleware';
import { IssueControllers } from './issue.controller';

const router = express.Router();

router.post('/', authMiddleware(), IssueControllers.createIssue);

router.get('/', IssueControllers.getAllIssues);

export const IssueRoutes = router;