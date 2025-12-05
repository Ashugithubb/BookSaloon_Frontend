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
        title: '',
        yearsOfExperience: 0,
        languages: [] as string[],
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [services, setServices] = useState<any[]>([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
    const [loadingServices, setLoadingServices] = useState(false);

    const [languageInput, setLanguageInput] = useState('');

    useEffect(() => {
        fetchServices();
    }, [businessId]);

    useEffect(() => {
        if (staff) {
            setFormData({
                name: staff.name || '',
                email: staff.email || '',
                phone: staff.phone || '',
                title: staff.title || '',
                yearsOfExperience: staff.yearsOfExperience || 0,
                languages: staff.languages || [],
            });
            if (staff.image) {
                setPreviewUrl(staff.image.startsWith('http') ? staff.image : `http://localhost:3001${staff.image}`);
            }

            // Set initially selected services
            if (staff.assignedServices) {
                const serviceIds = staff.assignedServices.map((as: any) => as.serviceId);
                setSelectedServiceIds(serviceIds);
            }
        }
    }, [staff]);

    const fetchServices = async () => {
        setLoadingServices(true);
        try {
            const { data } = await api.get(`/businesses/${businessId}/services`);
            setServices(data);
        } catch (err) {
            console.error('Failed to fetch services:', err);
        } finally {
            setLoadingServices(false);
        }
    };

    const toggleServiceSelection = (serviceId: string) => {
        setSelectedServiceIds(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const selectAllServices = () => {
        setSelectedServiceIds(services.map(s => s.id));
    };

    const deselectAllServices = () => {
        setSelectedServiceIds([]);
    };

    const addLanguage = () => {
        if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
            setFormData({ ...formData, languages: [...formData.languages, languageInput.trim()] });
            setLanguageInput('');
        }
    };

    const removeLanguage = (lang: string) => {
        setFormData({ ...formData, languages: formData.languages.filter(l => l !== lang) });
    };

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
            let invitationLink = null;
            let emailSent = false;

            const payload = {
                ...formData,
                serviceIds: selectedServiceIds
            };

            console.log('🔧 StaffForm - Sending payload:', payload);
            console.log('🔧 StaffForm - Selected service IDs:', selectedServiceIds);

            // 1. Create or Update Staff Details
            if (staff) {
                await api.put(`/staff/${staff.id}`, payload);
            } else {
                const { data } = await api.post(`/businesses/${businessId}/staff`, payload);
                staffId = data.id;
                invitationLink = data.invitationLink;
                emailSent = data.emailSent || data.emailQueued;
            }

            // 2. Upload Image if selected
            if (selectedImage && staffId) {
                const imageFormData = new FormData();
                imageFormData.append('image', selectedImage);
                await api.post(`/staff/${staffId}/images`, imageFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            // 3. Show invitation link and email status
            if (invitationLink && formData.email) {
                const fullLink = `${window.location.origin}${invitationLink}`;

                if (emailSent) {
                    alert(`✅ Staff member added!\n\n📧 Invitation email is being sent to: ${formData.email}\n\nThe staff member will receive an email with the invitation link shortly.\n\nBackup link (if needed):\n${fullLink}`);
                } else {
                    alert(`⚠️ Staff member added, but email could not be sent.\n\nPlease share this invitation link with them manually:\n\n${fullLink}\n\nNote: Make sure email is configured in backend .env file:\nMAIL_USER=your-email@gmail.com\nMAIL_PASS=your-app-password`);
                }

                // Copy to clipboard
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(fullLink);
                }
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
                <h3 className="text-2xl font-bold text-slate-900">
                    {staff ? 'Edit Staff Member' : 'Add Staff Member'}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    {staff ? 'Update staff member details' : 'Add a new team member to your business'}
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter full name"
                        className="w-full px-4 py-2.5 text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="staff@example.com"
                        className="w-full px-4 py-2.5 text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-1">Invitation will be sent to this email</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone
                    </label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-2.5 text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Title/Specialty
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Hair Stylist, Barber"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Years of Experience
                </label>
                <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Languages
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="e.g., English, Hindi, Punjabi"
                        value={languageInput}
                        onChange={(e) => setLanguageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                        className="flex-1 px-4 py-2.5 text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                    <button
                        type="button"
                        onClick={addLanguage}
                        className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                    >
                        Add
                    </button>
                </div>
                {formData.languages.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {formData.languages.map((lang) => (
                            <span
                                key={lang}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                            >
                                {lang}
                                <button
                                    type="button"
                                    onClick={() => removeLanguage(lang)}
                                    className="text-purple-500 hover:text-purple-700 font-bold"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Service Assignment Section */}
            <div className="space-y-3 pt-4 border-t-2 border-slate-200">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700">
                        Assign Services (Optional)
                    </label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={selectAllServices}
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                            Select All
                        </button>
                        <span className="text-xs text-slate-400">|</span>
                        <button
                            type="button"
                            onClick={deselectAllServices}
                            className="text-xs text-slate-600 hover:text-slate-700 font-medium"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                        <strong>Note:</strong> Select the services this staff member will provide.
                        If no services are selected, they can provide all services.
                    </p>
                </div>

                {loadingServices ? (
                    <div className="flex items-center justify-center py-8 text-slate-500">
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
                        Loading services...
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <p className="font-medium">No services available</p>
                        <p className="text-sm mt-1">Create services first to assign them to staff</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                        {services.map((service) => (
                            <label
                                key={service.id}
                                className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${selectedServiceIds.includes(service.id)
                                    ? 'border-purple-600 bg-purple-50'
                                    : 'border-slate-200 hover:border-purple-300 bg-white'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedServiceIds.includes(service.id)}
                                    onChange={() => toggleServiceSelection(service.id)}
                                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-900">{service.name}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-slate-600">
                                            ₹{service.price} • {service.duration} min
                                        </span>
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                )}

                {selectedServiceIds.length > 0 && (
                    <p className="text-xs text-purple-600 font-medium">
                        {selectedServiceIds.length} service{selectedServiceIds.length !== 1 ? 's' : ''} selected
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Profile Image
                </label>
                <div className="flex items-center gap-4">
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-16 w-16 rounded-full object-cover border-2 border-purple-200"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-slate-700
                            file:mr-4 file:py-2.5 file:px-4
                            file:rounded-lg file:border-0
                            file:text-sm file:font-semibold
                            file:bg-purple-50 file:text-purple-700
                            hover:file:bg-purple-100 file:cursor-pointer
                            cursor-pointer"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                    {loading ? 'Saving...' : staff ? 'Update Staff Member' : 'Add Staff Member'}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
