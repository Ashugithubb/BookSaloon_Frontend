'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Clock, DollarSign, FileText, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../lib/api';

interface ServiceFormProps {
    businessId: string;
    service?: any;
    onClose: () => void;
}

export default function ServiceForm({ businessId, service, onClose }: ServiceFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: '',
        price: '',
        discount: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (service) {
            setFormData({
                name: service.name || '',
                description: service.description || '',
                duration: service.duration?.toString() || '',
                price: service.price?.toString() || '',
                discount: service.discount?.toString() || '',
            });
        }
    }, [service]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (service) {
                await api.put(`/services/${service.id}`, formData);
            } else {
                await api.post(`/businesses/${businessId}/services`, formData);
            }
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative"
        >
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-rose-50/50 rounded-3xl -z-10" />

            <form onSubmit={handleSubmit} className="space-y-6 p-8">
                {/* Header */}
                <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Scissors className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 bg-clip-text text-transparent">
                                    {service ? 'Edit Service' : 'Add Service'}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    {service ? 'Update your service details' : 'Create a new service offering'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center space-x-3 bg-red-50 border-2 border-red-200 rounded-xl p-4"
                        >
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Service Name */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                        <Scissors className="w-4 h-4 text-indigo-600" />
                        <span>Service Name *</span>
                    </label>
                    <div className="relative group">
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Hair Cutting, Facial, Manicure"
                            className="w-full pl-12 pr-4 py-3.5 text-slate-900 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 hover:border-slate-300"
                        />
                        <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span>Description</span>
                    </label>
                    <div className="relative group">
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe what's included in this service..."
                            className="w-full pl-12 pr-4 py-3.5 text-slate-900 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 placeholder-slate-400 hover:border-slate-300 resize-none"
                        />
                        <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                    </div>
                    {formData.description && (
                        <p className="text-xs text-slate-500 text-right">
                            {formData.description.length} characters
                        </p>
                    )}
                </div>

                {/* Duration and Price Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Duration */}
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span>Duration *</span>
                        </label>
                        <div className="relative group">
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="30"
                                className="w-full pl-12 pr-20 py-3.5 text-slate-900 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 placeholder-slate-400 hover:border-slate-300"
                            />
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                                minutes
                            </span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                            <DollarSign className="w-4 h-4 text-rose-600" />
                            <span>Price *</span>
                        </label>
                        <div className="relative group">
                            <input
                                type="number"
                                step="0.01"
                                required
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="500"
                                className="w-full pl-12 pr-4 py-3.5 text-slate-900 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all duration-200 placeholder-slate-400 hover:border-slate-300"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400 group-focus-within:text-rose-600 transition-colors">
                                ₹
                            </span>
                        </div>
                    </div>
                </div>

                {/* Discount Field */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                        <span className="w-4 h-4 text-emerald-600 font-bold text-xs flex items-center justify-center">%</span>
                        <span>Discount (Optional)</span>
                    </label>
                    <div className="relative group">
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={formData.discount}
                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                            placeholder="0"
                            className="w-full pl-12 pr-16 py-3.5 text-slate-900 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 placeholder-slate-400 hover:border-slate-300"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                            %
                        </span>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                            off
                        </span>
                    </div>
                    <p className="text-xs text-slate-500">Enter discount percentage (0-100)</p>
                </div>

                {/* Price Calculation Display */}
                {formData.price && parseFloat(formData.price) > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 mb-2">Price Summary</p>
                                <div className="flex items-center space-x-3">
                                    {formData.discount && parseFloat(formData.discount) > 0 ? (
                                        <>
                                            <span className="text-lg text-slate-500 line-through">
                                                ₹{parseFloat(formData.price).toFixed(2)}
                                            </span>
                                            <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                                                {parseFloat(formData.discount).toFixed(0)}% OFF
                                            </span>
                                        </>
                                    ) : null}
                                </div>
                                <div className="flex items-baseline space-x-2 mt-1">
                                    <span className="text-3xl font-bold text-emerald-600">
                                        ₹{(parseFloat(formData.price) * (1 - (parseFloat(formData.discount || '0') / 100))).toFixed(2)}
                                    </span>
                                    {formData.discount && parseFloat(formData.discount) > 0 && (
                                        <span className="text-sm font-medium text-emerald-600">
                                            (Save ₹{(parseFloat(formData.price) * (parseFloat(formData.discount) / 100)).toFixed(2)})
                                        </span>
                                    )}
                                </div>
                            </div>
                            {formData.discount && parseFloat(formData.discount) > 0 && (
                                <div className="text-right">
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-white">{parseFloat(formData.discount).toFixed(0)}%</div>
                                            <div className="text-xs text-white/90">OFF</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="flex-1 relative group bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-indigo-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative flex items-center justify-center space-x-2">
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    <span>{service ? 'Update Service' : 'Create Service'}</span>
                                </>
                            )}
                        </span>
                    </motion.button>

                    <motion.button
                        type="button"
                        onClick={onClose}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 relative group bg-white border-2 border-slate-300 text-slate-700 px-6 py-3.5 rounded-xl font-semibold hover:border-indigo-500 hover:text-indigo-600 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative flex items-center justify-center space-x-2">
                            <X className="w-5 h-5" />
                            <span>Cancel</span>
                        </span>
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
}
