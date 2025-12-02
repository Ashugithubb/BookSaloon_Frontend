'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Store, ArrowRight, Sparkles } from 'lucide-react';

import { Suspense } from 'react';

function RoleSelectionContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const intent = searchParams.get('intent') || 'login'; // 'login' or 'signup'

    const handleRoleSelect = (role: 'customer' | 'professional') => {
        const targetPage = intent === 'signup' ? '/signup' : '/login';
        router.push(`${targetPage}?role=${role}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Link href="/" className="inline-flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            BookSalon
                        </span>
                    </Link>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Sign up/log in
                    </h1>
                    <p className="text-lg text-gray-600">
                        Choose how you want to use BookSalon
                    </p>
                </motion.div>

                {/* Role Cards */}
                <div className="space-y-4">
                    {/* Customer Card */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => handleRoleSelect('customer')}
                        className="w-full group relative bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 border-2 border-gray-200 hover:border-purple-400 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4 text-left">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                        BookSalon for customers
                                    </h2>
                                    <p className="text-gray-600">
                                        Book salons and spas near you
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                    </motion.button>

                    {/* Professional Card */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => handleRoleSelect('professional')}
                        className="w-full group relative bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 border-2 border-gray-200 hover:border-indigo-400 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4 text-left">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Store className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                        BookSalon for professionals
                                    </h2>
                                    <p className="text-gray-600">
                                        Manage and grow your business
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                    </motion.button>
                </div>

                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-8"
                >
                    <Link href="/" className="text-gray-600 hover:text-purple-600 transition-colors">
                        ← Back to home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

export default function RoleSelectionPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        }>
            <RoleSelectionContent />
        </Suspense>
    );
}
