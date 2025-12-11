import { CustomError } from "./CustomError";

export abstract class BaseHttpError extends CustomError {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}
