import { CustomError } from "./CustomError";

export class InsufficientBalanceError extends CustomError {
    constructor() {
        super("Amount must not be greater than balance");
    }
}
