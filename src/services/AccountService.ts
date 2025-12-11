import { InsufficientBalanceError } from "../errors/InsufficientBalanceError";
import { InvalidTransferError } from "../errors/InvalidTransferError";
import { NotFoundError } from "../errors/NotFoundError";
import { AccountRepository } from "../repositories/AccountRepository";
import { DepositResult, TransferResult, WithdrawResult } from "../types";

export class AccountService {
    constructor(private accountRepository: AccountRepository) {}

    async getBalance(accountId: string): Promise<number | null> {
        return await this.accountRepository.getBalance(accountId);
    }

    async setBalance(accountId: string, balance: number): Promise<void> {
        await this.accountRepository.setBalance(accountId, balance);
    }

    async deposit(accountId: string, amount: number): Promise<DepositResult> {
        const balance = await this.getBalance(accountId) ?? 0;
        const updatedBalance = balance + amount;

        this.setBalance(accountId, updatedBalance);

        return {
            destination: {
                id: accountId,
                balance: balance + amount,
            }
        }
    }

    async withdraw(accountId: string, amount: number): Promise<WithdrawResult> {
        const balance = await this.getBalance(accountId);

        if (balance === null) {
            throw new NotFoundError();
        }

        if (amount > balance) {
            throw new InsufficientBalanceError();
        }

        const updatedAmount = balance - amount;

        await this.setBalance(accountId, updatedAmount);

        return {
            origin: {
                id: accountId,
                balance: updatedAmount,
            }
        }
    }

    async transfer(originId: string, destinationId: string, amount: number): Promise<TransferResult> {
        if (originId === destinationId) {
            throw new InvalidTransferError();
        }
        
        const originBalance = await this.getBalance(originId);
        const destinationBalance = await this.getBalance(destinationId);

        if (originBalance === null) {
            throw new NotFoundError();
        }

        if (destinationBalance === null) {
            throw new NotFoundError();
        }

        if (amount > originBalance) {
            throw new InsufficientBalanceError();
        }

        const updatedOriginBalance = originBalance - amount;
        const updatedDestinationBalance = destinationBalance + amount;

        await this.setBalance(originId, updatedOriginBalance);
        await this.setBalance(destinationId, updatedDestinationBalance);

        return {
            origin: {
                id: originId,
                balance: updatedOriginBalance,
            },
            destination: {
                id: destinationId,
                balance: updatedDestinationBalance,
            }
        }
    }

    async reset(): Promise<void> {
        await this.accountRepository.reset();
    }
}
