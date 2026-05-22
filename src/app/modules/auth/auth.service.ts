import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import { pool } from '../../../config/db';
import type { IUser } from "./auth.interface";

// ? Register User
const registerUserIntoDB = async (userData: IUser): Promise<IUser> => {
    const { name, email, password, role } = userData;

    //? Hash Password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password!, saltRounds);

    const query = `
       INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at, updated_at   
    `;

    const values = [name, email, hashedPassword, role || 'contributor'];

    const result = await pool.query(query, values);

    return result.rows[0];

}

//? Login User

const loginUserFromDB = async (loginData: any) => {
    const { email, password } = loginData;

    // ? Check if the user exists
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    const user = result.rows[0];

    //? user not found
    if (!user) {
        const error = new Error("Authentication Failed") as any;
        error.statusCode = 401;
        error.errors = "Invalid email or password.";
        throw error;
    }

    //? Compare the password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        const error = new Error("Authentication Failed") as any;
        error.statusCode = 401;
        error.errors = "Invalid email or password.";
        throw error;
    }

    //? Generate Token jwt
    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role
    };

    const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
        expiresIn: "1d",
    } as jwt.SignOptions);

    //? Remove password
    delete user.password;

    return {
        user: user,
        token: token
    }

}

export const AuthService = {
    registerUserIntoDB,
    loginUserFromDB
}