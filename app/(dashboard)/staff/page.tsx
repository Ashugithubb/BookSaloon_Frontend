'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../lib/api';
import {
    Calendar, Clock, User, Building2, LogOut, Sparkles,
    CheckCircle, XCircle, AlertCircle, Lock, Home
} from 'lucide-react';
import NotificationBell from '../../../components/NotificationBell';

export default function StaffDashboard() {
    const { user, logout } = useAuth();
    const [staffProfile, setStaffProfile] = useState<any>(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'my' | 'unassigned'>('my');

    // OTP Verification State
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

    useEffect(() => {
        fetchStaffProfile();
        fetchAppointments();
    }, []);

    const fetchStaffProfile = async () => {
        try {
            const { data } = await api.get('/staff/me');
            setStaffProfile(data);
        } catch (error) {
            console.error('Failed to fetch staff profile', error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/staff/appointments');
            setAppointments(data);
        } catch (error) {
            console.error('Failed to fetch appointments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClaimAppointment = async (appointmentId: string) => {
        try {
            await api.post(`/appointments/${appointmentId}/claim`);
            fetchAppointments();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to claim appointment');
        }
    };

    const handleConfirmAppointment = async (appointmentId: string) => {
        try {
            await api.put(`/appointments/${appointmentId}/status`, { status: 'CONFIRMED' });
            fetchAppointments();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to confirm appointment');
        }
    };

    const handleInitiateCompletion = async (appointmentId: string) => {
        try {
            await api.post(`/appointments/${appointmentId}/initiate-completion`);
            setSelectedAppointment(appointmentId);
            setShowOtpModal(true);
            setOtp(['', '', '', '', '', '']);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to initiate completion');
        }
    };

    const handleVerifyOtp = async () => {
        if (!selectedAppointment) return;

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            alert('Please enter a valid 6-digit OTP');
            return;
        }

        setVerifyingOtp(true);
        try {
            await api.post(`/appointments/${selectedAppointment}/verify-completion`, {
                otp: otpString
            });
            setShowOtpModal(false);
            fetchAppointments();
            alert('Appointment completed successfully!');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent multiple chars

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleNoShowAppointment = async (appointmentId: string) => {
        if (!confirm('Are you sure you want to mark this appointment as No Show?')) return;

        try {
            await api.post(`/appointments/${appointmentId}/no-show`);
            fetchAppointments();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to mark as no-show');
        }
    };

    const getMyAppointments = () => {
        const now = new Date();
        return appointments.filter(a =>
            a.staffId === staffProfile?.id &&
            new Date(a.date) >= now
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    const getUnassignedAppointments = () => {
        const now = new Date();
        return appointments.filter(a =>
            a.staffId === null &&
            new Date(a.date) >= now
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    const getStatusBadge = (status: string) => {
        const badges: any = {
            PENDING: <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">PENDING</span>,
            CONFIRMED: <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">CONFIRMED</span>,
            COMPLETED: <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">COMPLETED</span>,
            CANCELLED: <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">CANCELLED</span>,
            NO_SHOW: <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">NO SHOW</span>,
        };
        return badges[status] || status;
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-rose-50">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                    >
                        <Sparkles className="w-16 h-16 text-indigo-600" />
                    </motion.div>
                    <p className="text-lg text-slate-600 mt-4 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const displayAppointments = activeTab === 'my' ? getMyAppointments() : getUnassignedAppointments();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-indigo-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center space-x-4">
                            <a
                                href="/"
                                className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
                            >
                                <Sparkles className="w-8 h-8 text-white" />
                            </a>
                            <div>
                                <h1 className="text-4xl font-bold text-slate-900 mb-1">
                                    Staff Dashboard
                                </h1>
                                <p className="text-slate-600 text-base">
                                    Welcome, <span className="font-semibold text-indigo-600">{user?.name}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/" className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Home">
                                <Home className="w-6 h-6" />
                            </Link>
                            <NotificationBell />
                            <button
                                onClick={logout}
                                className="group inline-flex items-center px-6 py-3 bg-white border-2 border-red-500 text-red-600 rounded-full hover:bg-red-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <LogOut className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header >

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Business Info Card */}
                {staffProfile && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-8 border border-indigo-100">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-rose-500 rounded-2xl flex items-center justify-center">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{staffProfile.business.name}</h2>
                                <p className="text-slate-600">{staffProfile.title || 'Staff Member'}</p>
                                {staffProfile.yearsOfExperience > 0 && (
                                    <p className="text-sm text-slate-500">{staffProfile.yearsOfExperience} years experience</p>
                                )}
                                {staffProfile.languages && staffProfile.languages.length > 0 && (
                                    <p className="text-sm text-slate-500">Languages: {staffProfile.languages.join(', ')}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Appointments Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-indigo-100"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="w-8 h-8 text-indigo-600" />
                        <h2 className="text-3xl font-bold text-slate-900">Appointments</h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('my')}
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'my'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-slate-600 hover:text-indigo-600'
                                }`}
                        >
                            My Appointments ({getMyAppointments().length})
                        </button>
                        <button
                            onClick={() => setActiveTab('unassigned')}
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'unassigned'
                                ? 'text-amber-600 border-b-2 border-amber-600'
                                : 'text-slate-600 hover:text-amber-600'
                                }`}
                        >
                            Unassigned ({getUnassignedAppointments().length})
                        </button>
                    </div>

                    {/* Appointments List */}
                    {displayAppointments.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 text-lg">
                                {activeTab === 'my' ? 'No appointments assigned to you' : 'No unassigned appointments'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {displayAppointments.map((appointment) => (
                                <motion.div
                                    key={appointment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Time & Status */}
                                        <div className="flex-shrink-0 flex md:flex-col items-center md:items-start gap-2 min-w-[120px]">
                                            <span className="text-lg font-bold text-slate-900">
                                                {new Date(appointment.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                            </span>
                                            <span className="text-sm text-slate-600">
                                                {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                            {getStatusBadge(appointment.status)}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-grow">
                                            <h4 className="text-base font-semibold text-slate-900">{appointment.customer.name}</h4>
                                            <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                                <span className="font-medium text-indigo-600">{appointment.service.name}</span>
                                                <span className="text-slate-300">•</span>
                                                <span>₹{appointment.service.price}</span>
                                            </div>
                                            {appointment.customer.phone && (
                                                <p className="text-sm text-slate-500 mt-1">📞 {appointment.customer.phone}</p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex-shrink-0 flex gap-2">
                                            {activeTab === 'unassigned' && (
                                                <button
                                                    onClick={() => handleClaimAppointment(appointment.id)}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                                >
                                                    Claim
                                                </button>
                                            )}
                                            {activeTab === 'my' && appointment.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleConfirmAppointment(appointment.id)}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {activeTab === 'my' && appointment.status === 'CONFIRMED' && (
                                                <>
                                                    <button
                                                        onClick={() => handleInitiateCompletion(appointment.id)}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                                                    >
                                                        Complete
                                                    </button>
                                                    <button
                                                        onClick={() => handleNoShowAppointment(appointment.id)}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
                                                    >
                                                        No Show
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* OTP Modal */}
            <AnimatePresence>
                {showOtpModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Verify Completion</h3>
                                <p className="text-slate-600 mt-2">
                                    Please enter the 6-digit OTP sent to the customer's email to complete this appointment.
                                </p>
                            </div>

                            <div className="flex justify-center gap-2 mb-8">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-2xl font-bold border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                                    />
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={verifyingOtp || otp.some(d => !d)}
                                    className="flex-1 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {verifyingOtp ? 'Verifying...' : 'Verify & Complete'}
                                </button>
                                <button
                                    onClick={() => setShowOtpModal(false)}
                                    className="px-6 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}
