import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
    login as loginService,
    logout as logoutService,
    verifyOtp as verifyOtpService,
    getProfile
} from "../services/authService";

export interface User {
    email: string;
    name: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    verifyOtp: (email: string, otp: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [Authenticated, setAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const profile = await getProfile();
                if (profile) {
                    setUser(profile);
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            } catch (error) {
                setAuthenticated(false);
            }
            setIsLoading(false);
        }

        checkAuth();
    }, []);

    const verifyOtp = async (email:string, otpcode:string): Promise<boolean> => {
        try {
            const response = await verifyOtpService(email, otpcode);
            return response;
        } catch (error) {
            console.error("OTP verification failed:", error);
            return false;
        }
    }

    const login = async (email: string, pass: string) => {
        await loginService(email, pass);
        // If login throws no error, it means the cookie is set.
        const profile = await getProfile();
        setUser(profile);
        setAuthenticated(true);
    };

    const logout = async () => {
        try {
            await logoutService();
        } finally {
            setAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: Authenticated, isLoading, user, login, logout, verifyOtp }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};