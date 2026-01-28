import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
    login as loginService,
    logout as logoutService,
    getProfile
} from "../services/authService";


interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [Authenticated, setAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const profile = await getProfile();
                if (profile) {
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

    const login = async (email: string, pass: string) => {
        await loginService(email, pass);
        // If login throws no error, it means the cookie is set.
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
        <AuthContext.Provider value={{ isAuthenticated: Authenticated, isLoading, login, logout }}>
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