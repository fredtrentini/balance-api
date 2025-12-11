import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/NotFoundError";
import { CustomError } from "../errors/CustomError";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof NotFoundError) {
        return res.status(err.statusCode).json(0);
    }

    if (err instanceof CustomError) {
        return res.status(400).json({
            error: err.message
        });
    }

    console.error(err);

    res.status(500).send('Something went wrong');
}

export { errorHandler };
