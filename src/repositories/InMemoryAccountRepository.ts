import { AccountRepository } from "./AccountRepository";

export class InMemoryAccountRepository implements AccountRepository {
    accountIdToBalanceMap: Record<string, number> = {};

    async getBalance(accountId: string): Promise<number | null> {
        return this.accountIdToBalanceMap[accountId] ?? null;
    }

    async setBalance(accountId: string, balance: number): Promise<void> {
        this.accountIdToBalanceMap[accountId] = balance;
    }

    async reset(): Promise<void> {
        this.accountIdToBalanceMap = {};
    }
}
