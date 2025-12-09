import express, { type Request, type Response } from "express";

const router = express.Router();

router.post(
    "/event",
    async (req: Request, res: Response) => {
        res.send({});
    }
);

export { router as createEventRouter };
