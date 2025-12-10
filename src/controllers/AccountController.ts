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

    createEvent = async (req: Request, res: Response) => {
        res.send({});
    }
}
