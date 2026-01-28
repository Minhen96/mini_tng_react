import apiClient from "../lib/axios";


export interface Transaction {
    transactionId: string;
    fromWalletId: string;
    toWalletId: string;
    amount: number;
    status: string;
    creditStatus: string;
    createdAt: string;
    updatedAt: string;
}

export const getTransactionHistory = async (): Promise<Transaction[]> => {
    const response = await apiClient.get('/transactions');
    return response.data.data;
}

export const getTransactionDetails = async (transactionId: string): Promise<Transaction> => {
    const response = await apiClient.get(`/transactions/${transactionId}`);
    return response.data.data;
}
