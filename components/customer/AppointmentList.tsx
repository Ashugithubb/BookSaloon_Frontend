'use client';

import { useState } from 'react';
import api from '../../lib/api';
import ReviewForm from './ReviewForm';

interface AppointmentListProps {
    appointments: any[];
    onUpdate: () => void;
    type: 'upcoming' | 'past';
}

export default function AppointmentList({ appointments, onUpdate, type }: AppointmentListProps) {
    const [showReviewForm, setShowReviewForm] = useState<string | null>(null);

    const handleCancel = async (appointmentId: string) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;

        try {
            await api.put(`/appointments/${appointmentId}/status`, { status: 'CANCELLED' });
            onUpdate();
        } catch (error) {
            console.error('Failed to cancel appointment', error);
            alert('Failed to cancel appointment');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: any = {
            PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
            CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', icon: '✓' },
            COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '✓' },
            CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: '✕' },
            NO_SHOW: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '−' },
        };

        const config = statusConfig[status] || statusConfig.PENDING;

        return (
            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
                <span className="mr-1">{config.icon}</span>
                {status}
            </span>
        );
    };

    if (appointments.length === 0) {
        return (
            <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xl text-gray-500 mb-2">
                    {type === 'upcoming' ? 'No upcoming appointments' : 'No past appointments'}
                </p>
                <p className="text-gray-400">
                    {type === 'upcoming' ? 'Book your first appointment to get started!' : 'Your appointment history will appear here'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {appointments.map((appointment) => (
                <div key={appointment.id} className="bg-gradient-to-r from-white to-purple-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-purple-100">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Left Section - Main Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {appointment.business.name}
                                        </h3>
                                        <p className="text-purple-600 font-semibold">
                                            {appointment.service.name}
                                        </p>
                                    </div>
                                    <div className="lg:hidden">
                                        {getStatusBadge(appointment.status)}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {appointment.staff && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Staff: <span className="font-medium ml-1">{appointment.staff.name}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(appointment.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {new Date(appointment.date).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                    <div className="flex items-center text-sm font-semibold text-purple-600">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {appointment.service.discount && appointment.service.discount > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-400 line-through">₹{appointment.service.price}</span>
                                                <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                                                    {appointment.service.discount}% OFF
                                                </span>
                                                <span className="text-emerald-600">
                                                    ₹{(appointment.service.price * (1 - appointment.service.discount / 100)).toFixed(2)}
                                                </span>
                                            </div>
                                        ) : (
                                            `₹${appointment.service.price}`
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Section - Status & Actions */}
                            <div className="flex flex-col items-start lg:items-end space-y-3">
                                <div className="hidden lg:block">
                                    {getStatusBadge(appointment.status)}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {type === 'upcoming' && appointment.status === 'PENDING' && (
                                        <button
                                            onClick={() => handleCancel(appointment.id)}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancel
                                        </button>
                                    )}
                                    {type === 'past' && appointment.status === 'COMPLETED' && (
                                        <button
                                            onClick={() => setShowReviewForm(appointment.id)}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                            Leave Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {showReviewForm === appointment.id && (
                            <div className="mt-6 pt-6 border-t border-purple-200">
                                <ReviewForm
                                    businessId={appointment.businessId}
                                    onClose={() => {
                                        setShowReviewForm(null);
                                        onUpdate();
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
