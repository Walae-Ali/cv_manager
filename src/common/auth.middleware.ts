import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { verify } from "jsonwebtoken";


@Injectable()
export class AuthMiddleware implements NestMiddleware{
    use(req:Request,res:Response,next:NextFunction){
        const token=req.headers['auth-user'];
        if(!token||Array.isArray(token)){
            return res.status(401).json({message:'Access denied: Token missing or invalid'});
        }
        try{
            const decoded=verify(token,'a-string-secret-at-least-256-bits-long');
            const userId=decoded['userId'];
            if(!userId){
                return res.status(403).json({ message: 'Access denied: No userId in token' });
            }
            
            // Injecter le userId dans la requête
            req['user'] = { id: userId };
            next();

        }catch(error){
            return res.status(401).json({ message: 'Invalid token', error: error.message });
        }

    }
}