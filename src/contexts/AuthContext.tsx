"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (access: string, refresh: string) => Promise<void>;
    logout: () => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    logout: () => { },
    token: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem("accessToken");
            if (storedToken) {
                setToken(storedToken);
                try {
                    // Fetch user profile
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/me/`, {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data);
                    } else {
                        // Token might be expired, clear it
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        setToken(null);
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (access: string, refresh: string) => {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        setToken(access);

        // Fetch profile immediately after caching token
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/me/`, {
            headers: { Authorization: `Bearer ${access}` },
        });
        if (res.ok) {
            const data = await res.json();
            setUser(data);
            router.push("/dashboard");
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setToken(null);
        setUser(null);
        router.push("/login");
    };

    // Protect routes - simple check
    useEffect(() => {
        if (!loading) {
            const isPublicPath = pathname === "/" || pathname === "/login" || pathname === "/signup";
            if (!user && !isPublicPath && pathname?.startsWith("/dashboard")) {
                router.push("/login");
            }
            if (user && (pathname === "/login" || pathname === "/signup")) {
                router.push("/dashboard");
            }
        }
    }, [user, loading, pathname, router]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};
