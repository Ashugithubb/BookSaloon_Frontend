'use client';

import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface AppointmentCalendarProps {
    businessId: string;
}

export default function AppointmentCalendar({ businessId }: AppointmentCalendarProps) {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

    // OTP Verification State
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, [businessId]);

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get(`/appointments/${businessId}`);
            setAppointments(data);
        } catch (error) {
            console.error('Failed to fetch appointments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId: string, status: string) => {
        if (status === 'COMPLETED') {
            initiateCompletion(appointmentId);
            return;
        }

        try {
            await api.put(`/appointments/${appointmentId}/status`, { status });
            fetchAppointments();
        } catch (error) {
            console.error('Failed to update appointment status', error);
            alert('Failed to update appointment status');
        }
    };

    const initiateCompletion = async (appointmentId: string) => {
        try {
            await api.post(`/appointments/${appointmentId}/initiate-completion`);
            const appointment = appointments.find(a => a.id === appointmentId);
            setSelectedAppointment(appointment);
            setShowOtpModal(true);
            setOtp('');
        } catch (error) {
            console.error('Failed to initiate completion', error);
            alert('Failed to send OTP. Please try again.');
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            alert('Please enter a valid 6-digit OTP');
            return;
        }

        setVerifying(true);
        try {
            await api.post(`/appointments/${selectedAppointment.id}/verify-completion`, { otp });
            alert('Service completed successfully!');
            setShowOtpModal(false);
            fetchAppointments();
        } catch (error: any) {
            console.error('Failed to verify OTP', error);
            alert(error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const getFilteredAndSortedAppointments = () => {
        let filtered = [];
        if (activeTab === 'upcoming') {
            filtered = appointments.filter(a => ['PENDING', 'CONFIRMED'].includes(a.status));
            // Sort Ascending (Soonest first)
            filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } else if (activeTab === 'completed') {
            filtered = appointments.filter(a => ['COMPLETED', 'NO_SHOW'].includes(a.status));
            // Sort Descending (Newest first)
            filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (activeTab === 'cancelled') {
            filtered = appointments.filter(a => a.status === 'CANCELLED');
            // Sort Descending
            filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        return filtered;
    };

    const groupAppointmentsByDate = (appointments: any[]) => {
        const groups: { [key: string]: any[] } = {};
        appointments.forEach(apt => {
            const date = new Date(apt.date);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            let dateString = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            if (date.toDateString() === today.toDateString()) dateString = 'Today';
            else if (date.toDateString() === tomorrow.toDateString()) dateString = 'Tomorrow';

            if (!groups[dateString]) groups[dateString] = [];
            groups[dateString].push(apt);
        });
        return groups;
    };

    const getStatusBadge = (status: string) => {
        const styles: any = {
            PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
            CONFIRMED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200',
            CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200',
            NO_SHOW: 'bg-rose-100 text-rose-800 border-rose-200',
        };

        return (
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading appointments...</div>;

    const groupedAppointments = groupAppointmentsByDate(getFilteredAndSortedAppointments());

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header & Tabs */}
            <div className="border-b border-slate-200">
                <div className="p-6 pb-0">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Appointments</h2>
                    <div className="flex space-x-6">
                        {['upcoming', 'completed', 'cancelled'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab
                                        ? 'text-indigo-600'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-slate-50/50 min-h-[400px]">
                {Object.keys(groupedAppointments).length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-3">📅</div>
                        <h3 className="text-lg font-medium text-slate-900">No {activeTab} appointments</h3>
                        <p className="text-slate-500">You don't have any appointments in this category.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedAppointments).map(([dateLabel, apts]) => (
                            <div key={dateLabel}>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
                                    {dateLabel}
                                </h3>
                                <div className="space-y-3">
                                    {apts.map((appointment) => (
                                        <div
                                            key={appointment.id}
                                            className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center gap-4"
                                        >
                                            {/* Time & Status */}
                                            <div className="flex-shrink-0 flex md:flex-col items-center md:items-start gap-2 min-w-[100px]">
                                                <span className="text-lg font-bold text-slate-900">
                                                    {new Date(appointment.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                </span>
                                                {getStatusBadge(appointment.status)}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-grow">
                                                <h4 className="text-base font-semibold text-slate-900">{appointment.customer.name}</h4>
                                                <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                                    <span className="font-medium text-indigo-600">{appointment.service.name}</span>
                                                    {appointment.staff && (
                                                        <>
                                                            <span className="text-slate-300">•</span>
                                                            <span>with {appointment.staff.name}</span>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Contact Actions */}
                                                <div className="flex gap-2 mt-3">
                                                    {appointment.customer.phone && (
                                                        <a href={`tel:${appointment.customer.phone}`} className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded flex items-center gap-1 transition-colors">
                                                            📞 Call
                                                        </a>
                                                    )}
                                                    {appointment.customer.email && (
                                                        <a href={`mailto:${appointment.customer.email}`} className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded flex items-center gap-1 transition-colors">
                                                            ✉️ Email
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex-shrink-0 flex gap-2 justify-end mt-2 md:mt-0">
                                                {appointment.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(appointment.id, 'CONFIRMED')}
                                                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(appointment.id, 'CANCELLED')}
                                                            className="px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                                                        >
                                                            Decline
                                                        </button>
                                                    </>
                                                )}
                                                {appointment.status === 'CONFIRMED' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(appointment.id, 'COMPLETED')}
                                                            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                                                        >
                                                            Complete
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(appointment.id, 'NO_SHOW')}
                                                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                                        >
                                                            No Show
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* OTP Verification Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full transform transition-all">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🔐</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Verify Completion</h3>
                            <p className="text-slate-500 mt-2 text-sm">
                                Ask <strong>{selectedAppointment?.customer?.name}</strong> for the 6-digit OTP sent to their email.
                            </p>
                        </div>

                        <div className="mb-6">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl text-center text-3xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900"
                                placeholder="000000"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowOtpModal(false)}
                                className="flex-1 py-2.5 px-4 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVerifyOtp}
                                disabled={verifying || otp.length !== 6}
                                className="flex-1 py-2.5 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {verifying ? 'Verifying...' : 'Verify & Complete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
