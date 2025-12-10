export interface AccountRepository {
    getBalance(accountId: number): Promise<number | null>;
    setBalance(accountId: number, balance: number): Promise<void>;
}
