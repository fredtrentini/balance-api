import { AccountRepository } from "./AccountRepository";

export class InMemoryAccountRepository implements AccountRepository {
    accountIdToBalanceMap: Record<number, number> = {};

    async getBalance(accountId: number): Promise<number | null> {
        return this.accountIdToBalanceMap[accountId] ?? null;
    }

    async setBalance(accountId: number, balance: number): Promise<void> {
        this.accountIdToBalanceMap[accountId] = balance;
    }
}
