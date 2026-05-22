import { UserRole } from "../app/modules/auth/auth.interface";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                name: string;
                role: UserRole;
            };
        }
    }
}