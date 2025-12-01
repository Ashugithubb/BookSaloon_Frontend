'use client';

import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface StaffProfileModalProps {
    staffId: string;
    businessId: string;
    onClose: () => void;
    onBookWithStaff?: (staff: any) => void;
}

export default function StaffProfileModal({ staffId, businessId, onClose, onBookWithStaff }: StaffProfileModalProps) {
    const [staff, setStaff] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStaffDetails();
    }, [staffId]);

    const fetchStaffDetails = async () => {
        try {
            const { data } = await api.get(`/staff/${staffId}`);
            setStaff(data);
        } catch (error) {
            console.error('Failed to fetch staff details', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-white/20 text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-lg font-medium text-slate-700">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">😕</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Staff Not Found</h3>
                    <p className="text-slate-500 mb-6">We couldn't find the staff member you're looking for.</p>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button - Floating */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Hero Header */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute -bottom-12 left-8 flex items-end">
                        <div className="relative">
                            {staff.image ? (
                                <img
                                    src={staff.image.startsWith('http') ? staff.image : `http://localhost:3001${staff.image}`}
                                    alt={staff.name}
                                    className="h-32 w-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                                />
                            ) : (
                                <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-4xl border-4 border-white shadow-xl">
                                    {staff.name.charAt(0)}
                                </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md">
                                <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pt-16 px-8 pb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">{staff.name}</h2>
                            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                                    {staff.business.name}
                                </span>
                            </p>
                        </div>
                        {staff.rating > 0 && (
                            <div className="text-right">
                                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                                    <span className="text-xl font-bold text-amber-600">{staff.rating.toFixed(1)}</span>
                                    <div className="flex text-amber-400 text-sm">
                                        {'★'.repeat(Math.round(staff.rating))}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 font-medium">{staff.reviewCount} reviews</p>
                            </div>
                        )}
                    </div>

                    {onBookWithStaff && (
                        <button
                            onClick={() => {
                                onBookWithStaff(staff);
                                onClose();
                            }}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all active:scale-[0.98] mb-8 flex items-center justify-center gap-2"
                        >
                            <span>Book Appointment</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    )}

                    {/* Reviews Section */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="bg-purple-100 p-2 rounded-lg text-purple-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </span>
                            Client Reviews
                        </h3>

                        {staff.reviews && staff.reviews.length > 0 ? (
                            <div className="space-y-4">
                                {staff.reviews.map((review: any) => (
                                    <div key={review.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-indigo-100 transition-colors">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                    {review.customer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm">{review.customer.name}</h4>
                                                    <div className="flex text-amber-400 text-xs">
                                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        {review.comment && (
                                            <p className="text-slate-600 text-sm leading-relaxed pl-[3.25rem]">"{review.comment}"</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h4 className="text-slate-900 font-semibold">No reviews yet</h4>
                                <p className="text-slate-500 text-sm mt-1">Be the first to leave a review!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
