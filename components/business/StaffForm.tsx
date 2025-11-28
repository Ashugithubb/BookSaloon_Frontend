'use client';

import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface StaffFormProps {
    businessId: string;
    staff?: any;
    onClose: () => void;
}

export default function StaffForm({ businessId, staff, onClose }: StaffFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (staff) {
            setFormData({
                name: staff.name || '',
                email: staff.email || '',
                phone: staff.phone || '',
            });
            if (staff.image) {
                setPreviewUrl(staff.image.startsWith('http') ? staff.image : `http://localhost:3001${staff.image}`);
            }
        }
    }, [staff]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let staffId = staff?.id;

            // 1. Create or Update Staff Details
            if (staff) {
                await api.put(`/staff/${staff.id}`, formData);
            } else {
                const { data } = await api.post(`/businesses/${businessId}/staff`, formData);
                staffId = data.id;
            }

            // 2. Upload Image if selected
            if (selectedImage && staffId) {
                const imageFormData = new FormData();
                imageFormData.append('image', selectedImage);
                await api.post(`/staff/${staffId}/images`, imageFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to save staff member');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold">{staff ? 'Edit Staff Member' : 'Add Staff Member'}</h3>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                <div className="mt-1 flex items-center space-x-4">
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-12 w-12 rounded-full object-cover"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-purple-50 file:text-purple-700
                            hover:file:bg-purple-100"
                    />
                </div>
            </div>

            <div className="flex space-x-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : staff ? 'Update' : 'Add'}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
