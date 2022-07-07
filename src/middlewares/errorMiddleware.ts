import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export async function handleError(err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction){
    return res.sendStatus(500);
}
