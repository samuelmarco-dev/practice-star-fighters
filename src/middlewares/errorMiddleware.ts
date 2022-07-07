import { NextFunction, Request, Response } from "express";

export async function handleError(err: any, req: Request, res: Response, next: NextFunction){
    if(err.type === "UserNotFound") return res.status(404).send(err.message);

    return res.sendStatus(500);
}
