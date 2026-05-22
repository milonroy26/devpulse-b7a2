import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //? default value set (if no status code or message)
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || null;

    // ? PostgreSQL Unique Violation Handle (exm: one email can be used only once)
    if (err.code === "23505") {
        statusCode = 400;
        message = "Email already exists!";
        errors = "The provided email is already registered.";
    }

    //? error message handle (if no error message) 
    if (!errors && err.message) {
        errors = err.message;
    }

    //? response send to client
    res.status(statusCode).json({
        success: false,
        message: message,
        errors: errors
    });
};

export default globalErrorHandler;