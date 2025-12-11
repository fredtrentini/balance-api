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

describe("POST /event", () => {
    it("validates event type", async () => {
        const accountId = "123";
        const event = { type: "invalid_event_type", destination: accountId, amount: 10 };

        const response = await request(app)
            .post("/event")
            .send(event)
            .expect(400);

        expect(response.body.error).toBe("Invalid event type");
    });

    it("validates event amount", async () => {
        const accountId = "123";
        const event = { type: "deposit", destination: accountId, amount: -1 };

        const response = await request(app)
            .post("/event")
            .send(event)
            .expect(400);

        expect(response.body.error).toBe("Invalid event amount");
    });

    it("creates account with initial balance", async () => {
        const accountId = "123";
        const event = { type: "deposit", destination: accountId, amount: 10 };

        const response = await request(app)
            .post("/event")
            .send(event)
            .expect(201);

        expect(response.body).toBe({ destination: { id: accountId, balance: 10 } });
    });

    it("deposits into existing account", async () => {
        const accountId = "123";
        const event = { type: "deposit", destination: accountId, amount: 10 };

        await request(app)
            .post("/event")
            .send(event)
            .expect(201);

        const response = await request(app)
            .post("/event")
            .send(event)
            .expect(201);

        expect(response.body).toBe({ destination: { id: accountId, balance: 20 } });
    });

    it("withdraws from unexistent account", async () => {
        const origin = "123";
        const event = { type: "withdraw", origin, amount: 10 };

        const response = await request(app)
            .post("/event")
            .send(event)
            .expect(404);

        expect(response.body).toBe(0);
    });

    it("withdraws from existing account", async () => {
        const origin = "123";
        const event = { type: "withdraw", origin, amount: 10 };
        const balance = 100;

        await accountService.setBalance(origin, balance);

        const response = await request(app)
            .post("/event")
            .send(event)
            .expect(201);

        expect(response.body).toBe({ origin: { id: origin, balance: 90 } });
    });

    it("withdraws amount greater than balance", async () => {
        const origin = "123";
        const event = { type: "withdraw", origin, amount: 101 };
        const balance = 100;

        await accountService.setBalance(origin, balance);

        const response = await request(app)
            .post("/event")
            .send(event)
            .expect(400);

        expect(response.body.error).toBe("Amount must not be greater than balance");
    });

    it("validates transfer without destination", async () => {
        const origin = "123";
        const event = { type: "transfer", origin, amount: 10 };

        const response = await request(app)
            .post("/event")
            .send(event)
            .expect(400);

        expect(response.body.error).toBe("Transfer requires a destination");
    });

    it("transfers from existing account", async () => {
        const origin = "123";
        const destination = "321";
        const event = { type: "transfer", origin, amount: 10, destination };

        await accountService.setBalance(origin, 100);
        await accountService.setBalance(destination, 50);

        const response = await request(app)
            .post("/event")
            .send(event)
            .expect(201);

        expect(response.body).toBe({ origin: { id: origin, balance: 90 }, destination: { id: destination, balance: 60 } });
    });

    it("transfers from unexistent account", async () => {
        const origin = "123";
        const destination = "321";
        const event = { type: "transfer", origin, amount: 10, destination };

        await accountService.setBalance(destination, 100);

        const response = await request(app)
            .post("/event")
            .send(event)
            .expect(404);

        expect(response.body).toBe(0);
    });

    it("transfers to unexistent account", async () => {
        const origin = "123";
        const destination = "321";
        const event = { type: "transfer", origin, amount: 10, destination };

        await accountService.setBalance(origin, 100);

        const response = await request(app)
            .post("/event")
            .send(event)
            .expect(404);

        expect(response.body).toBe(0);
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
