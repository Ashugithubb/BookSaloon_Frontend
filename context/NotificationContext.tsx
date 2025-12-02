'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { io, Socket } from 'socket.io-client';
import api from '../lib/api';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    data?: any;
    read: boolean;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    showToast: (notification: Notification) => void;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [toastNotification, setToastNotification] = useState<Notification | null>(null);

    // Initialize Socket.IO connection
    useEffect(() => {
        if (!user) {
            console.log('⚠️ No user, skipping Socket.IO connection');
            return;
        }

        console.log('🚀 Initializing Socket.IO for user:', user.id);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        console.log('🌐 Connecting to:', apiUrl);

        const socketInstance = io(apiUrl, {
            transports: ['websocket', 'polling']
        });

        socketInstance.on('connect', () => {
            console.log('✅ Socket.IO connected! Socket ID:', socketInstance.id);
            console.log('🔐 Authenticating user:', user.id);
            socketInstance.emit('authenticate', user.id);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('❌ Socket.IO connection error:', error);
        });

        socketInstance.on('disconnect', (reason) => {
            console.log('🔌 Socket.IO disconnected:', reason);
        });

        socketInstance.on('new_notification', (notification: Notification) => {
            console.log('📨 New notification received:', notification);
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            showToast(notification);
        });

        socketInstance.on('unread_count', (count: number) => {
            console.log('📊 Unread count received:', count);
            setUnreadCount(count);
        });

        setSocket(socketInstance);

        return () => {
            console.log('🔌 Cleaning up Socket.IO connection');
            socketInstance.disconnect();
        };
    }, [user]);

    // Fetch initial notifications
    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchUnreadCount();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications?limit=20');
            setNotifications(data.notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const { data } = await api.get('/notifications/unread-count');
            setUnreadCount(data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const showToast = (notification: Notification) => {
        setToastNotification(notification);
        setTimeout(() => setToastNotification(null), 5000);
    };

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
            const notification = notifications.find(n => n.id === id);
            if (notification && !notification.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                showToast,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                fetchNotifications
            }}
        >
            {children}
            {toastNotification && (
                <div className="fixed top-4 right-4 z-50 max-w-sm">
                    <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-purple-600 animate-in slide-in-from-right">
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{toastNotification.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{toastNotification.message}</p>
                            </div>
                            <button
                                onClick={() => setToastNotification(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
