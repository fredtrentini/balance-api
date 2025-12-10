import { createApp } from "./app";
import { InMemoryAccountRepository } from "./repositories/InMemoryAccountRepository";

const PORT = 3000;

const accountRepository = new InMemoryAccountRepository();
const app = createApp({
    accountRepository,
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});
