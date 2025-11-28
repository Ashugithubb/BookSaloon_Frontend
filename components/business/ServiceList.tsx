'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Clock, DollarSign } from 'lucide-react';
import api from '../../lib/api';
import ServiceForm from './ServiceForm';

interface ServiceListProps {
    businessId: string;
}

export default function ServiceList({ businessId }: ServiceListProps) {
    const [services, setServices] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, [businessId]);

    const fetchServices = async () => {
        try {
            const { data } = await api.get(`/businesses/${businessId}/services`);
            setServices(data);
        } catch (error) {
            console.error('Failed to fetch services', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (serviceId: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            await api.delete(`/services/${serviceId}`);
            fetchServices();
        } catch (error) {
            console.error('Failed to delete service', error);
        }
    };

    const handleEdit = (service: any) => {
        setEditingService(service);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingService(null);
        fetchServices();
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading services...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Services</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage your service offerings and pricing</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Service
                </button>
            </div>

            {showForm && (
                <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                    <ServiceForm
                        businessId={businessId}
                        service={editingService}
                        onClose={handleFormClose}
                    />
                </div>
            )}

            {services.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                        <Plus className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No services yet</h3>
                    <p className="text-slate-500 mt-1">Add your first service to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                        >
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                        {service.name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-slate-400 bg-slate-50 px-2 py-1 rounded-md text-xs font-medium">
                                        <Clock className="w-3 h-3" />
                                        {service.duration} min
                                    </div>
                                </div>

                                {service.description && (
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                                        {service.description}
                                    </p>
                                )}

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                                    <div className="flex items-center text-2xl font-bold text-slate-900">
                                        <span className="text-sm text-slate-400 font-normal mr-1">$</span>
                                        {service.price}
                                    </div>

                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Edit Service"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                            title="Delete Service"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
