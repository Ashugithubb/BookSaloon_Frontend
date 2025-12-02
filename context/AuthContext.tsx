'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'CUSTOMER' | 'OWNER' | 'ADMIN' | 'STAFF';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, phone: string, role: string) => Promise<void>;
    googleLogin: (email: string, name: string, role?: string) => Promise<any>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    setUser(data);
                } catch (error) {
                    console.error('Failed to fetch user', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data);

        // Redirect based on role
        if (data.role === 'OWNER') {
            router.push('/business');
        } else if (data.role === 'STAFF') {
            router.push('/staff');
        } else if (data.role === 'ADMIN') {
            router.push('/admin');
        } else {
            router.push('/customer');
        }
    };

    const register = async (name: string, email: string, password: string, phone: string, role: string) => {
        const { data } = await api.post('/auth/register', { name, email, password, phone, role });
        localStorage.setItem('token', data.token);
        setUser(data);

        if (data.role === 'OWNER') {
            router.push('/business');
        } else {
            router.push('/customer');
        }
    };

    const googleLogin = async (email: string, name: string, role?: string) => {
        try {
            console.log('🔍 AuthContext - googleLogin called with:', { email, name, role });
            const { data } = await api.post('/auth/google', { email, name, role });

            console.log('🔍 AuthContext - Backend response:', data);

            // If backend requires role selection, return specific object
            if (data.requiresRoleSelection) {
                console.log('🔍 AuthContext - Backend requesting role selection');
                return { requiresRoleSelection: true };
            }

            localStorage.setItem('token', data.token);
            setUser(data);

            console.log('🔍 AuthContext - User created/logged in with role:', data.role);

            // Redirect based on role
            if (data.role === 'OWNER') {
                router.push('/business');
            } else if (data.role === 'ADMIN') {
                router.push('/admin');
            } else if (data.role === 'STAFF') {
                router.push('/staff');
            } else {
                router.push('/customer');
            }
            return { success: true };
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
