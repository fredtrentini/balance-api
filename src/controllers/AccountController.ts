import { Request, Response } from "express";
import { AccountService } from "../services/AccountService";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";

export class AccountController {
    constructor(private accountService: AccountService) {}

    getBalance = async (req: Request, res: Response) => {
        const accountId = req.query.account_id;

        if (accountId === undefined) {
            throw new BadRequestError("Missing account_id query param");
        }

        if (accountId === "") {
            throw new BadRequestError("Invalid account_id query param");
        }

        const balance = await this.accountService.getBalance(accountId.toString());

        if (balance === null) {
            throw new NotFoundError();
        }

        res.send(balance);
    }

    processEvent = async (req: Request, res: Response) => {
        if (req.body === undefined) {
            throw new BadRequestError("Missing payload");
        }

        const { type, amount, origin, destination } = req.body;
        const validEventTypes = ["deposit", "withdraw", "transfer"];

        if (!validEventTypes.includes(type)) {
            throw new BadRequestError("Invalid type");
        }

        if (amount === undefined || amount <= 0) {
            throw new BadRequestError("Invalid amount");
        }

        if (type === "deposit") {
            const updatedState = await this.accountService.deposit(destination, amount);

            return res.status(201).send(updatedState);
        }
        
        if (type === "withdraw") {
            const updatedState = await this.accountService.withdraw(origin, amount);

            return res.status(201).send(updatedState);
        }
        
        if (type === "transfer") {
            const updatedState = await this.accountService.transfer(origin, destination, amount);

            return res.status(201).send(updatedState);
        }

        throw new Error("Unreachable code");
    }

    reset = async (req: Request, res: Response) => {
        await this.accountService.reset();

        res.send("OK");
    }
}
