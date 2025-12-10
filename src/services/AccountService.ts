import { AccountRepository } from "../repositories/AccountRepository";

export class AccountService {
    constructor(private accountRepository: AccountRepository) {}

    async getBalance(accountId: string): Promise<number | null> {
        return await this.accountRepository.getBalance(accountId);
    }

    async setBalance(accountId: string, balance: number): Promise<void> {
        await this.accountRepository.setBalance(accountId, balance);
    }

    async reset(): Promise<void> {
        await this.accountRepository.reset();
    }
}
