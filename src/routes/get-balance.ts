import express, { type Request, type Response } from "express";

const router = express.Router();

router.get(
    "/balance",
    async (req: Request, res: Response) => {
        res.send({});
    }
);

export { router as getBalanceRouter };
