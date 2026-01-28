import apiClient from "../lib/axios";

export const getBalance = async (): Promise<number> => {
    const response = await apiClient.get('/v1/wallets/balance')
    return response.data.data.balance;
}

export const topUp = async (amount: number): Promise<boolean> => {
    const response = await apiClient.post('/v1/wallets/topup', {
        amount: amount
    })
    return response.data.success;
}

export const transfer = async (toEmail: string, amount: number) => {
    const response = await apiClient.post('/v1/wallets/transfer', {
        email: toEmail,
        amount: amount
    })
    return response.data;
}
