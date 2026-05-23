import type { NextFunction, Request, Response } from "express";
import { IssueServices } from "./issue.service";

//? create issue
const createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, type } = req.body;

        //? The logged-in user ID obtained from authMiddleware 
        const reporter_id = req.user!.id;

        //? call service function
        const result = await IssueServices.createIssueIntoDB({
            title,
            description,
            type,
            reporter_id,
        });

        res.status(201).json({
            success: true,
            message: 'Issue created successfully',
            data: result,
        });

    } catch (error) {
        next(error);
    }
}

//? get all issues
const getAllIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status, type, search } = req.query;

        const result = await IssueServices.getAllIssuesFromDB({
            status: status as string,
            type: type as string,
            search: search as string,
        })

        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        next(error);
    }
}

//? get single issue
const getSingleIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };

        const result = await IssueServices.getSingleIssueFromDB(id);

        res.status(200).json({
            success: true,
            data: result,
        })

    } catch (error) {
        next(error);
    }
}

export const IssueControllers = {
    createIssue,
    getAllIssues,
    getSingleIssue
};