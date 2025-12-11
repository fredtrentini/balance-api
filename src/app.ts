import express from "express";
import { errorHandler } from "./middlewares/error-handler";
import { AccountService } from "./services/AccountService";
import { AccountController } from "./controllers/AccountController";
import { AccountRepository } from "./repositories/AccountRepository";

type CreateAppOptions = {
    accountRepository: AccountRepository;
};

function createApp(options: CreateAppOptions) {
    const app = express();

    const accountService = new AccountService(options.accountRepository);
    const accountController = new AccountController(accountService);

    app.get("/balance", accountController.getBalance);
    app.post("/event", accountController.createEvent);
    app.post("/reset", accountController.reset);
    app.use(errorHandler);

    return app;
}

export { createApp };
