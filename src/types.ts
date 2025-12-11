interface DepositResult {
    destination: {
        id: string,
        balance: number,
    }
}

interface WithdrawResult {
    origin: {
        id: string,
        balance: number,
    }
}

interface TransferResult {
    origin: {
        id: string,
        balance: number,
    },
    destination: {
        id: string,
        balance: number,
    }
}

export {
    type DepositResult,
    type WithdrawResult,
    type TransferResult,
};
