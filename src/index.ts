import express from "express";
import { getBalanceRouter } from "./routes/get-balance";
import { createEventRouter } from "./routes/create-event";

const app = express();
const PORT = 3000;

app.use(getBalanceRouter);
app.use(createEventRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});
