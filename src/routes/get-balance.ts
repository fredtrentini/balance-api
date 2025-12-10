import express, { type Request, type Response } from "express";

const router = express.Router();
const accountIdToBalanceMap: Record<number, number> = {};

router.get(
    "/balance",
    async (req: Request, res: Response) => {
        const accountId: number = Number(req.query.account_id);

        if (Number.isNaN(accountId)) {
            return res.status(400).json({
                error: "Missing account_id query param"
            });
        }
        
        const balance = accountIdToBalanceMap[accountId] ?? null;

        if (balance === null) {
            return res.status(404).json(0);
        }

        res.send(balance);
    }
);

export { router as getBalanceRouter };
