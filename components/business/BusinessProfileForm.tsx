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
        phone: '',
        latitude: '',
        longitude: '',
        category: '',
        hours: Array(7).fill(null).map((_, i) => ({
            dayOfWeek: i,
            startTime: '09:00',
            endTime: '17:00',
            isOpen: true
        }))
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (business) {
            setFormData({
                name: business.name || '',
                description: business.description || '',
                address: business.address || '',
                phone: business.phone || '',
                latitude: business.latitude || '',
                longitude: business.longitude || '',
                category: business.category || '',
                hours: business.hours && business.hours.length > 0
                    ? business.hours
                    : Array(7).fill(null).map((_, i) => ({
                        dayOfWeek: i,
                        startTime: '09:00',
                        endTime: '17:00',
                        isOpen: true
                    }))
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400"
                    placeholder="+1 (555) 000-0000"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Latitude (Optional)</label>
                    <input
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400"
                        placeholder="e.g. 40.7128"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Longitude (Optional)</label>
                    <input
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400"
                        placeholder="e.g. -74.0060"
                    />
                </div>
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

            <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Business Hours</h3>
                <div className="space-y-4">
                    {formData.hours.map((hour, index) => (
                        <div key={hour.dayOfWeek} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="w-full md:w-24 font-medium text-slate-700">
                                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][hour.dayOfWeek]}
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={hour.isOpen}
                                    onChange={(e) => {
                                        const newHours = [...formData.hours];
                                        newHours[index].isOpen = e.target.checked;
                                        setFormData({ ...formData, hours: newHours });
                                    }}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                <span className="ml-3 text-sm font-medium text-slate-700">{hour.isOpen ? 'Open' : 'Closed'}</span>
                            </label>

                            {hour.isOpen && (
                                <div className="flex items-center gap-2 w-full md:w-auto md:ml-auto">
                                    <input
                                        type="time"
                                        value={hour.startTime}
                                        onChange={(e) => {
                                            const newHours = [...formData.hours];
                                            newHours[index].startTime = e.target.value;
                                            setFormData({ ...formData, hours: newHours });
                                        }}
                                        className="flex-1 md:flex-none px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
                                    />
                                    <span className="text-slate-500">-</span>
                                    <input
                                        type="time"
                                        value={hour.endTime}
                                        onChange={(e) => {
                                            const newHours = [...formData.hours];
                                            newHours[index].endTime = e.target.value;
                                            setFormData({ ...formData, hours: newHours });
                                        }}
                                        className="flex-1 md:flex-none px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
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
