import { Request, Response, NextFunction } from "express";
import { BaseHttpError } from "../errors/BaseHttpError";
import { NotFoundError } from "../errors/NotFoundError";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof NotFoundError) {
        return res.status(err.statusCode).json(0);
    }

    if (err instanceof BaseHttpError) {
        return res.status(err.statusCode).json({
            error: err.message
        });
    }

    console.error(err);

    res.status(500).send('Something went wrong');
}

export { errorHandler };
