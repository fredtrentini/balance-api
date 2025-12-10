export interface AccountRepository {
    getBalance(accountId: string): Promise<number | null>;
    setBalance(accountId: string, balance: number): Promise<void>;
    reset(): Promise<void>;
}
