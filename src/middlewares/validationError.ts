import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";


const validationErrorMiddleware = ( req : Request , res : Response , next : NextFunction ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({
            status: "Validation Error",
            message: errors.array()[0].msg,
        });
        return;
    }
    next();
}

export default validationErrorMiddleware;