import { Express } from "express";
import request from "supertest";
import { AccountService } from "../../services/AccountService";
import { InMemoryAccountRepository } from "../../repositories/InMemoryAccountRepository";
import { createApp } from "../../app";

let app: Express;
let accountService: AccountService;

beforeEach(() => {
    const accountRepository = new InMemoryAccountRepository();
    
    app = createApp({
        accountRepository
    });

    accountService = new AccountService(accountRepository);
});

describe("GET /balance", () => {
    it("requests balance without an account id", async () => {
        const response = await request(app)
            .get("/balance")
            .expect(400);
        
        expect(response.body.error).toBe("Missing account_id query param");
    });

    it("requests balance with empty string as account id", async () => {
        const response = await request(app)
            .get("/balance")
            .query({
                account_id: ""
            })
            .expect(400);
        
        expect(response.body.error).toBe("Invalid account_id query param");
    });

    it("requests balance with valid but unexistent account id", async () => {
        const response = await request(app)
            .get("/balance")
            .query({
                account_id: "123"
            })
            .expect(404);
        
        expect(response.body).toBe(0);
    });

    it("requests balance with existing account id", async () => {
        const accountId = "123";
        const balance = 100;

        await accountService.setBalance(accountId, balance);

        const response = await request(app)
            .get("/balance")
            .query({
                account_id: accountId
            })
            .expect(200);

        expect(response.body).toBe(balance);
    });
});

describe("POST /reset", () => {
    it("resets state", async () => {
        const accountId = "123";
        const balance = 100;

        expect(await accountService.getBalance(accountId)).toBeNull();
        await accountService.setBalance(accountId, balance);
        expect(await accountService.getBalance(accountId)).toBe(balance);

        const response = await request(app)
            .post("/reset")
            .expect(200);
        
        expect(await accountService.getBalance(accountId)).toBeNull();
        expect(response.text).toBe("OK");
    });
});
