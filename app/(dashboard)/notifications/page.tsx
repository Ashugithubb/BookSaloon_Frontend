'use client';

import { useEffect } from 'react';
import { useNotifications } from '../../../context/NotificationContext';
import { Bell, Check, Trash2, Filter as FilterIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotificationsPage() {
    const { notifications, markAsRead, markAllAsRead, deleteNotification, fetchNotifications } = useNotifications();

    useEffect(() => {
        fetchNotifications();
    }, []);

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
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const unreadNotifications = notifications.filter(n => !n.read);
    const readNotifications = notifications.filter(n => n.read);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
                    <p className="text-gray-600">Stay updated with your latest activities</p>
                </div>

                {/* Actions */}
                {unreadNotifications.length > 0 && (
                    <div className="mb-6 flex justify-end">
                        <button
                            onClick={() => markAllAsRead()}
                            className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                            Mark all as read
                        </button>
                    </div>
                )}

                {/* Notifications List */}
                {notifications.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h3>
                        <p className="text-gray-600">When you get notifications, they'll show up here</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Unread Notifications */}
                        {unreadNotifications.length > 0 && (
                            <div>
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                    Unread ({unreadNotifications.length})
                                </h2>
                                <div className="space-y-2">
                                    {unreadNotifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-purple-50 border-l-4 border-purple-600 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start gap-4">
                                                <span className="text-3xl">{getNotificationIcon(notification.type)}</span>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-semibold text-gray-900">{notification.title}</h3>
                                                    <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
                                                    <p className="text-xs text-gray-500 mt-2">{formatTime(notification.createdAt)}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Read Notifications */}
                        {readNotifications.length > 0 && (
                            <div>
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                    Earlier
                                </h2>
                                <div className="space-y-2">
                                    {readNotifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start gap-4">
                                                <span className="text-3xl opacity-60">{getNotificationIcon(notification.type)}</span>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-medium text-gray-700">{notification.title}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                    <p className="text-xs text-gray-400 mt-2">{formatTime(notification.createdAt)}</p>
                                                </div>
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
