'use client';

import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface BusinessProfileFormProps {
    business?: any;
    onSuccess: () => void;
}

export default function BusinessProfileForm({ business, onSuccess }: BusinessProfileFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        category: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (business) {
            setFormData({
                name: business.name || '',
                description: business.description || '',
                address: business.address || '',
                category: business.category || '',
            });
        }
    }, [business]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (business) {
                await api.put(`/businesses/${business.id}`, formData);
            } else {
                await api.post('/businesses', formData);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save business');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Business Name *</label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400"
                    placeholder="e.g., Glamour Salon"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400"
                    placeholder="Tell us about your salon..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400"
                    placeholder="123 Main St, City, State"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
                >
                    <option value="">Select a category</option>
                    <option value="Hair Salon">Hair Salon</option>
                    <option value="Spa">Spa</option>
                    <option value="Barber">Barber</option>
                    <option value="Nail Salon">Nail Salon</option>
                    <option value="Beauty Salon">Beauty Salon</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-rose-500 hover:from-indigo-700 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300 hover:scale-105"
            >
                {loading ? 'Saving...' : business ? 'Update Business' : 'Create Business'}
            </button>
        </form>
    );
}
