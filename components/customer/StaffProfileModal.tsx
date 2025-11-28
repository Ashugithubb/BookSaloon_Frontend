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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <p className="mt-2 text-gray-600">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                    <p className="text-center text-gray-600">Staff member not found</p>
                    <button onClick={onClose} className="mt-4 w-full py-2 bg-gray-200 rounded-md">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Staff Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Staff Info */}
                <div className="p-6 border-b bg-gradient-to-br from-purple-50 to-white">
                    <div className="flex items-center space-x-6">
                        {staff.image ? (
                            <img
                                src={staff.image.startsWith('http') ? staff.image : `http://localhost:3001${staff.image}`}
                                alt={staff.name}
                                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-3xl border-4 border-white shadow-lg">
                                {staff.name.charAt(0)}
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900">{staff.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">
                                Works at <span className="font-medium text-purple-600">{staff.business.name}</span>
                            </p>
                            {staff.rating > 0 ? (
                                <div className="flex items-center mt-2">
                                    <div className="flex items-center text-yellow-500">
                                        {'★'.repeat(Math.round(staff.rating))}
                                        {'☆'.repeat(5 - Math.round(staff.rating))}
                                    </div>
                                    <span className="ml-2 text-lg font-semibold text-gray-900">{staff.rating.toFixed(1)}</span>
                                    <span className="ml-1 text-gray-500 text-sm">• {staff.reviewCount} {staff.reviewCount === 1 ? 'review' : 'reviews'}</span>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 mt-2">New team member - No reviews yet</p>
                            )}
                        </div>
                    </div>

                    {onBookWithStaff && (
                        <button
                            onClick={() => {
                                onBookWithStaff(staff);
                                onClose();
                            }}
                            className="mt-4 w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md"
                        >
                            Book Appointment with {staff.name}
                        </button>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Reviews for {staff.name}
                    </h3>

                    {staff.reviews && staff.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {staff.reviews.map((review: any) => (
                                <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <span className="font-semibold text-gray-900">{review.customer.name}</span>
                                            <span className="ml-3 text-yellow-500 text-lg">
                                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    {review.comment && (
                                        <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-gray-500">No reviews yet</p>
                            <p className="text-sm text-gray-400 mt-1">Be the first to review {staff.name}!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
