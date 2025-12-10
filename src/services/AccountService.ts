import { AccountRepository } from "../repositories/AccountRepository";

export class AccountService {
    constructor(private accountRepository: AccountRepository) {}

    async getBalance(accountId: number): Promise<number | null> {
        return this.accountRepository.getBalance(accountId);
    }

    async setBalance(accountId: number, balance: number): Promise<void> {
        this.accountRepository.setBalance(accountId, balance);
    }
}
