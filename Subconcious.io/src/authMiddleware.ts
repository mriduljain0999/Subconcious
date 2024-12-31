import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv'

dotenv.config();
const secret = process.env.JWT_SECRET;

enum ResponseStatus {
    Success = 200,
    Error = 411,
    Exist = 403,
    ServerError = 500
}

interface AuthenticationRequest extends Request{
    userId?:String
}

export function authMiddleware(req:AuthenticationRequest, res: Response, next: NextFunction): void {
    try {
        const token = req.headers.token;
        
        if (!token) {
            res.status(ResponseStatus.Error).json({
                status: false,
                message: "Token not provided"
            });
            return;
        }

        const response = jwt.verify(token as string , secret as string) as { id: string };
        req.userId = response.id;
        next();  
    } catch (error) {
        res.status(ResponseStatus.Error).json({
            status: false,
            message: "Invalid or expired token"
        });
        return;
    }
}