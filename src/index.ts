import express from "express";
import { errorHandler } from "./middlewares/error-handler";
import { InMemoryAccountRepository } from "./repositories/InMemoryAccountRepository";
import { AccountService } from "./services/AccountService";
import { AccountController } from "./controllers/AccountController";

const app = express();
const PORT = 3000;

const accountRepository = new InMemoryAccountRepository();
const accountService = new AccountService(accountRepository);
const accountController = new AccountController(accountService);

app.get("/balance", accountController.getBalance);
app.post("/event", accountController.createEvent);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});
