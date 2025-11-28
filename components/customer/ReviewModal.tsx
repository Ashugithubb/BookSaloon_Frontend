'use client';

import { useState } from 'react';
import api from '../../lib/api';

interface ReviewModalProps {
    businessId: string;
    staffList: any[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReviewModal({ businessId, staffList, onClose, onSuccess }: ReviewModalProps) {
    const [reviewType, setReviewType] = useState<'salon' | 'staff'>('salon');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [staffId, setStaffId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post(`/businesses/${businessId}/reviews`, {
                rating,
                comment,
                staffId: reviewType === 'staff' && staffId ? staffId : undefined,
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-2xl font-bold mb-4">Write a Review</h2>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Review Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            What are you reviewing?
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="reviewType"
                                    value="salon"
                                    checked={reviewType === 'salon'}
                                    onChange={(e) => {
                                        setReviewType('salon');
                                        setStaffId('');
                                    }}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-900">The Salon Overall</span>
                            </label>
                            {staffList && staffList.length > 0 && (
                                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="reviewType"
                                        value="staff"
                                        checked={reviewType === 'staff'}
                                        onChange={(e) => setReviewType('staff')}
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="ml-3 text-sm font-medium text-gray-900">A Specific Staff Member</span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-2xl focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Staff Selection - Only show if reviewing staff */}
                    {reviewType === 'staff' && staffList && staffList.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Staff Member *
                            </label>
                            <select
                                value={staffId}
                                onChange={(e) => setStaffId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                required
                            >
                                <option value="">Choose a staff member...</option>
                                {staffList.map((staff) => (
                                    <option key={staff.id} value={staff.id}>
                                        {staff.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Share your experience..."
                            required
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
