import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "../app/modules/auth/auth.interface";
import config from "../config";

const authMiddleware = (...requiredRoles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            //? get token header
            const token = req.headers.authorization;

            //? check token
            if (!token) {
                const error = new Error("Authentication Failed") as any;
                error.statusCode = 401;
                error.errors = "You are not authorized to access this resource. Token missing.";
                throw error;
            }

            //? verify token
            let decoded: any;
            try {
                decoded = jwt.verify(token, config.jwt_access_secret as string);
            } catch (jwtErr) {
                const error = new Error("Authentication Failed") as any;
                error.statusCode = 401;
                error.errors = "Invalid or expired token.";
                throw error;
            }

            //? Setting the verified data to the request object (for use in the next controller)
            req.user = {
                id: decoded.id,
                name: decoded.name,
                role: decoded.role,
            };

            //? role check
            if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
                const error = new Error("Authorization Failed") as any;
                error.statusCode = 403;
                error.errors = "You do not have permission to perform this action.";
                throw error;
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}

export default authMiddleware;