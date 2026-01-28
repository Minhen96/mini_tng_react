import type { User } from '../context/AuthContext';
import apiClient from '../lib/axios';
import type { LoginResponse } from '../types/authTypes';


export const register = async (email: string, name: string, password: string): Promise<boolean> => {
    const response = await apiClient.post('/auth/register', {
        email: email,
        name: name,
        password: password
    })
    return response.data;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', {
        email: email,
        password: password
    })
    return response.data;
}

export const verifyOtp = async (email: string, otpCode: string): Promise<boolean> => {
    const response = await apiClient.post('/auth/verify', {
        email: email,
        otpCode: otpCode
    })

    return response.data;
}

export const resendOtp = async (email: string): Promise<boolean> => {
    const response = await apiClient.post('/auth/resend-otp', {
        email: email
    })
    return response.data;
}

export const refreshToken = async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post('auth/refresh-token', {
        refreshToken: refreshToken
    })
    return response.data;
}

export const logout = async () => {
    const response = await apiClient.post('auth/logout')
    return response.data;
}

export const getProfile = async (): Promise<User> => {
    const response = await apiClient.get('users/profile')
    return response.data.data;
}

export const updateProfile = async (name: string) => {
    const response = await apiClient.put('users/profile', {
        name: name
    })
    return response.data;
}