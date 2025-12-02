'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import Link from 'next/link';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const recentNotifications = notifications.slice(0, 5);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'APPOINTMENT_BOOKED':
            case 'APPOINTMENT_CONFIRMED':
            case 'APPOINTMENT_ASSIGNED':
                return '📅';
            case 'APPOINTMENT_CANCELLED':
                return '❌';
            case 'APPOINTMENT_COMPLETED':
                return '✅';
            case 'APPOINTMENT_NO_SHOW':
                return '🚫';
            case 'STAFF_CLAIMED':
                return '👤';
            case 'REVIEW_RECEIVED':
                return '⭐';
            case 'STAFF_INVITED':
                return '👥';
            default:
                return '🔔';
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => markAllAsRead()}
                                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {recentNotifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                recentNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-purple-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                <p className="text-xs text-gray-400 mt-1">{formatTime(notification.createdAt)}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {recentNotifications.length > 0 && (
                            <div className="p-3 border-t border-gray-200">
                                <Link
                                    href="/notifications"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    View all notifications
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
