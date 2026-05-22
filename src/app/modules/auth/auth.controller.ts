import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";

const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;

        //? call service function
        const result = await AuthService.registerUserIntoDB(userData);


        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result
        })

    } catch (error) {
        next(error);
    }
}

//login controller
const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;

        //? Call service function to login user
        const result = await AuthService.loginUserFromDB(userData);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token: result.token,
                user: result.user,
            }
        })

    } catch (error) {
        next(error);
    }
}

export const AuthControllers = {
    signup,
    login
};