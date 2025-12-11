import { CustomError } from "./CustomError";

export class InvalidTransferError extends CustomError {
    constructor() {
        super("Origin and destination must be different");
    }
}
