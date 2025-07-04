import { NextFunction, Request, Response } from 'express';
import {supabase} from '../lib/supabase-client'

export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(401).json({ error: "Missing or invalid Authorization header" });
        return;
    }

    const token = authHeader.split(" ")[1];

    const {data, error} = await supabase.auth.getUser(token)

    if(error || !data.user){
        res.status(401).json({ error: "Invalid or expired token" });
        return;
    } 

    (req as any).user = data.user;

    next()
}