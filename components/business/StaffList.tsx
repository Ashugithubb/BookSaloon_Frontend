'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Mail, Phone, Star, User } from 'lucide-react';
import api from '../../lib/api';
import StaffForm from './StaffForm';

interface StaffListProps {
    businessId: string;
}

export default function StaffList({ businessId }: StaffListProps) {
    const [staff, setStaff] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingStaff, setEditingStaff] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStaff();
    }, [businessId]);

    const fetchStaff = async () => {
        try {
            const { data } = await api.get(`/businesses/${businessId}/staff`);
            setStaff(data);
        } catch (error) {
            console.error('Failed to fetch staff', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (staffId: string) => {
        if (!confirm('Are you sure you want to remove this staff member?')) return;

        try {
            await api.delete(`/staff/${staffId}`);
            fetchStaff();
        } catch (error) {
            console.error('Failed to delete staff', error);
        }
    };

    const handleEdit = (staffMember: any) => {
        setEditingStaff(staffMember);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingStaff(null);
        fetchStaff();
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading staff...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Staff Members</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage your team and their schedules</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Staff
                </button>
            </div>

            {showForm && (
                <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                    <StaffForm
                        businessId={businessId}
                        staff={editingStaff}
                        onClose={handleFormClose}
                    />
                </div>
            )}

            {staff.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                        <User className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No staff members yet</h3>
                    <p className="text-slate-500 mt-1">Add your first team member to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staff.map((member) => (
                        <div
                            key={member.id}
                            className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                        >
                            <div className="p-5">
                                <div className="flex items-start gap-4">
                                    {member.image ? (
                                        <img
                                            src={member.image.startsWith('http') ? member.image : `http://localhost:3001${member.image}`}
                                            alt={member.name}
                                            className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-100"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-2xl border-2 border-white shadow-sm ring-1 ring-slate-100">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                            {member.name}
                                        </h3>

                                        {/* Invitation Status */}
                                        {member.userId ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full mt-1">
                                                ✓ Active Account
                                            </span>
                                        ) : member.invitationToken ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full mt-1">
                                                ⏳ Invitation Pending
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full mt-1">
                                                No Email
                                            </span>
                                        )}

                                        {member.rating > 0 ? (
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                <span className="text-sm font-medium text-slate-700">{member.rating.toFixed(1)}</span>
                                                <span className="text-xs text-slate-400">({member.reviewCount} reviews)</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 mt-1 block">New Member</span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-5 space-y-2">
                                    {member.title && (
                                        <div className="text-sm font-medium text-indigo-600">
                                            {member.title}
                                        </div>
                                    )}
                                    {member.email && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <span className="truncate">{member.email}</span>
                                        </div>
                                    )}
                                    {member.phone && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <span>{member.phone}</span>
                                        </div>
                                    )}
                                    {member.yearsOfExperience > 0 && (
                                        <div className="text-xs text-slate-500">
                                            {member.yearsOfExperience} years experience
                                        </div>
                                    )}
                                    {member.languages && member.languages.length > 0 && (
                                        <div className="text-xs text-slate-500">
                                            Languages: {member.languages.join(', ')}
                                        </div>
                                    )}

                                    {/* Copy Invitation Link Button */}
                                    {member.invitationToken && !member.userId && (
                                        <button
                                            onClick={() => {
                                                const link = `${window.location.origin}/staff/accept-invitation/${member.invitationToken}`;
                                                navigator.clipboard.writeText(link);
                                                alert('Invitation link copied to clipboard!');
                                            }}
                                            className="mt-2 w-full px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                                        >
                                            📋 Copy Invitation Link
                                        </button>
                                    )}
                                </div>

                                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
