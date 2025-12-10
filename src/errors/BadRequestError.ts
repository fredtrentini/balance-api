import { BaseHttpError } from "./BaseHttpError";

export class BadRequestError extends BaseHttpError {
    constructor(message: string) {
        super(message, 400);
    }
}
