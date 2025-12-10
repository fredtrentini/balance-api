import { BaseHttpError } from "./BaseHttpError";

export class NotFoundError extends BaseHttpError {
    constructor() {
        super("Not found", 404);
    }
}
