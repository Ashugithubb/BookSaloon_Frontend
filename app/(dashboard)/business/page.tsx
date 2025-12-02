'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../../../lib/api';
import BusinessProfileForm from '../../../components/business/BusinessProfileForm';
import ServiceList from '../../../components/business/ServiceList';
import StaffList from '../../../components/business/StaffList';
import AppointmentCalendar from '../../../components/business/AppointmentCalendar';
import ImageUpload from '../../../components/business/ImageUpload';
import {
    Building2, Image as ImageIcon, Scissors, Users, Calendar,
    LogOut, Sparkles, TrendingUp, DollarSign, Clock, Star
} from 'lucide-react';
import NotificationBell from '../../../components/NotificationBell';

export default function BusinessDashboard() {
    const { user, logout } = useAuth();
    const [business, setBusiness] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        fetchBusiness();
    }, []);

    const fetchBusiness = async () => {
        try {
            const { data } = await api.get('/businesses/my');
            setBusiness(data);
        } catch (error: any) {
            if (error.response?.status === 404) {
                setBusiness(null);
            }
        } finally {
            setLoading(false);
        }
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

    const tabs = [
        { id: 'profile', label: 'Profile', icon: Building2, color: 'from-indigo-500 to-purple-500' },
        { id: 'gallery', label: 'Gallery', icon: ImageIcon, color: 'from-purple-500 to-rose-500' },
        { id: 'services', label: 'Services', icon: Scissors, color: 'from-rose-500 to-amber-500' },
        { id: 'staff', label: 'Staff', icon: Users, color: 'from-amber-500 to-indigo-500' },
        { id: 'appointments', label: 'Appointments', icon: Calendar, color: 'from-indigo-500 to-rose-500' },
    ];

    // Stats - only show relevant metrics
    const stats = [
        {
            label: 'Total Bookings',
            value: business?.appointments?.length || 0,
            icon: Calendar,
            color: 'from-indigo-500 to-purple-500'
        },
        {
            label: 'Services',
            value: business?.services?.length || 0,
            icon: Scissors,
            color: 'from-rose-500 to-amber-500'
        },
        {
            label: 'Team Members',
            value: business?.staff?.length || 0,
            icon: Users,
            color: 'from-amber-500 to-indigo-500'
        },
    ];

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
                                    {business ? business.name : 'Business Dashboard'}
                                </h1>
                                <p className="text-slate-600 text-base">
                                    Welcome back, <span className="font-semibold text-indigo-600">{user?.name}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
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
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!business ? (
                    // Create Business Profile
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-indigo-100"
                    >
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-rose-500 rounded-3xl mb-6 shadow-lg">
                                <Building2 className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent mb-3">
                                Create Your Business Profile
                            </h2>
                            <p className="text-slate-600 text-lg">Get started by setting up your salon or spa profile</p>
                        </div>
                        <BusinessProfileForm onSuccess={fetchBusiness} />
                    </motion.div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-indigo-100"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity`} />
                                    <div className="relative">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                            <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Main Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden"
                        >
                            {/* Tabs */}
                            <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-rose-50/50">
                                <nav className="flex space-x-2 px-6 py-4 overflow-x-auto" aria-label="Tabs">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`${activeTab === tab.id
                                                ? 'bg-white shadow-lg scale-105'
                                                : 'bg-transparent hover:bg-white/50'
                                                } relative whitespace-nowrap px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center space-x-2`}
                                        >
                                            {activeTab === tab.id && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-10 rounded-xl`}
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500'
                                                }`} />
                                            <span className={activeTab === tab.id ? 'text-indigo-600' : 'text-slate-600'}>
                                                {tab.label}
                                            </span>
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-8">
                                {activeTab === 'profile' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                                <Building2 className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-900">Business Profile</h2>
                                        </div>
                                        <BusinessProfileForm business={business} onSuccess={fetchBusiness} />
                                    </motion.div>
                                )}
                                {activeTab === 'gallery' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-rose-500 rounded-xl flex items-center justify-center">
                                                <ImageIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-900">Photo Gallery</h2>
                                        </div>
                                        <p className="text-slate-600 mb-6 text-lg">Showcase your salon with beautiful photos</p>
                                        <ImageUpload
                                            businessId={business.id}
                                            existingImages={business.images || []}
                                            onUpdate={fetchBusiness}
                                        />
                                    </motion.div>
                                )}
                                {activeTab === 'services' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-amber-500 rounded-xl flex items-center justify-center">
                                                <Scissors className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-900">Services & Pricing</h2>
                                        </div>
                                        <ServiceList businessId={business.id} />
                                    </motion.div>
                                )}
                                {activeTab === 'staff' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-900">Staff Members</h2>
                                        </div>
                                        <StaffList businessId={business.id} />
                                    </motion.div>
                                )}
                                {activeTab === 'appointments' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-xl flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-900">Appointment Calendar</h2>
                                        </div>
                                        <AppointmentCalendar businessId={business.id} />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}
