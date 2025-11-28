'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import BusinessCard from '../../../components/customer/BusinessCard';
import Link from 'next/link';
import { Search, Filter, X, Calendar, LogOut, Sparkles, TrendingUp, MapPin, Star } from 'lucide-react';

export default function CustomerDashboard() {
    const { user, logout } = useAuth();
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchBusinesses();
    }, []);

    useEffect(() => {
        filterBusinesses();
    }, [searchTerm, selectedCategory, businesses]);

    const fetchBusinesses = async () => {
        try {
            const { data } = await api.get('/businesses');
            setBusinesses(data);
            setFilteredBusinesses(data);
        } catch (error) {
            console.error('Failed to fetch businesses', error);
        } finally {
            setLoading(false);
        }
    };

    const filterBusinesses = () => {
        let filtered = businesses;

        if (searchTerm) {
            filtered = filtered.filter(
                (b) =>
                    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    b.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter((b) => b.category === selectedCategory);
        }

        setFilteredBusinesses(filtered);
    };

    const categories = Array.from(new Set(businesses.map((b) => b.category).filter(Boolean)));

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-indigo-600" />
                        </div>
                    </div>
                    <p className="text-lg font-medium text-slate-700">Discovering amazing salons...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-50 relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-400/30 to-transparent rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-rose-400/30 to-transparent rounded-full blur-3xl"
                />
            </div>

            {/* Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg shadow-indigo-500/5"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <motion.h1
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 bg-clip-text text-transparent mb-2"
                            >
                                Discover Your Perfect Salon
                            </motion.h1>
                            <motion.p
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-slate-600 flex items-center gap-2"
                            >
                                <span>Welcome back,</span>
                                <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {user?.name}
                                </span>
                                <Sparkles className="w-4 h-4 text-amber-500" />
                            </motion.p>
                        </div>
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap gap-3"
                        >
                            <Link
                                href="/appointments"
                                className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 font-medium overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Calendar className="w-5 h-5 mr-2 relative z-10" />
                                <span className="relative z-10">My Appointments</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="inline-flex items-center px-6 py-3 border-2 border-rose-500 text-rose-600 rounded-xl hover:bg-rose-50 transition-all duration-300 font-medium hover:shadow-lg hover:shadow-rose-500/20"
                            >
                                <LogOut className="w-5 h-5 mr-2" />
                                Logout
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.header>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl shadow-indigo-500/10 p-8 mb-8 border border-white/20 overflow-hidden"
                >
                    {/* Decorative gradient */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />

                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                            <Search className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Search & Filter</h2>
                            <p className="text-slate-500 text-sm">Find your perfect beauty destination</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Search by name or description
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Try 'Hair Salon' or 'Spa'..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-400"
                                />
                                <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Filter by category
                            </label>
                            <div className="relative group">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 appearance-none transition-all bg-white/50 backdrop-blur-sm text-slate-900 cursor-pointer"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <Filter className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors pointer-events-none" />
                                <div className="absolute right-4 top-4 pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {(searchTerm || selectedCategory) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 rounded-2xl border border-indigo-100"
                            >
                                <p className="text-sm font-medium text-indigo-900 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Found <span className="font-bold text-lg">{filteredBusinesses.length}</span> business{filteredBusinesses.length !== 1 ? 'es' : ''}
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('');
                                    }}
                                    className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                    Clear filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Business Grid */}
                <AnimatePresence mode="wait">
                    {filteredBusinesses.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center py-20 backdrop-blur-xl bg-white/60 rounded-3xl shadow-xl border border-white/20"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MapPin className="w-12 h-12 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">No businesses found</h3>
                            <p className="text-slate-500 text-lg">Try adjusting your search or filters</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex items-center justify-between mb-8"
                            >
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            Available Businesses
                                        </span>
                                        <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                                    </h2>
                                    <p className="text-slate-500 mt-1">
                                        {filteredBusinesses.length} amazing {filteredBusinesses.length === 1 ? 'salon' : 'salons'} ready to serve you
                                    </p>
                                </div>
                            </motion.div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredBusinesses.map((business, index) => (
                                    <motion.div
                                        key={business.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <BusinessCard business={business} />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
