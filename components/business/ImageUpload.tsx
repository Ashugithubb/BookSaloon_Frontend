'use client';

import { useState } from 'react';
import api from '../../lib/api';
import Image from 'next/image';

interface ImageUploadProps {
    businessId: string;
    existingImages: string[];
    onUpdate: () => void;
}

export default function ImageUpload({ businessId, existingImages, onUpdate }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFileUpload = async (files: FileList) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        const formData = new FormData();

        Array.from(files).forEach((file) => {
            formData.append('images', file);
        });

        try {
            // Don't set Content-Type header - let browser set it with boundary
            const response = await api.post(`/businesses/${businessId}/images`, formData);
            console.log('Upload successful:', response.data);
            onUpdate();
        } catch (error: any) {
            console.error('Error uploading images:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to upload images';
            alert(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (imageUrl: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            await api.delete(`/businesses/${businessId}/images`, {
                data: { imageUrl },
            });
            onUpdate();
        } catch (error: any) {
            console.error('Error deleting image:', error);
            alert(error.response?.data?.message || 'Failed to delete image');
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files);
        }
    };

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center">
                    <svg
                        className="w-16 h-16 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Upload Salon Images
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Drag and drop images here, or click to select files
                    </p>
                    <label className="cursor-pointer">
                        <span className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            {uploading ? 'Uploading...' : 'Choose Files'}
                        </span>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                            disabled={uploading}
                        />
                    </label>
                    <p className="text-xs text-gray-500 mt-3">
                        Supported formats: JPG, PNG, WEBP (Max 5MB per image)
                    </p>
                </div>
            </div>

            {/* Image Gallery */}
            {existingImages.length > 0 ? (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Gallery ({existingImages.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {existingImages.map((imageUrl, index) => (
                            <div
                                key={index}
                                className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                            >
                                <div className="relative h-48">
                                    <img
                                        src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:3001${imageUrl}`}
                                        alt={`Uploaded ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <button
                                    onClick={() => handleDelete(imageUrl)}
                                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                    title="Delete image"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg
                        className="w-16 h-16 text-gray-300 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <p className="text-gray-500">No images uploaded yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Upload images to showcase your salon
                    </p>
                </div>
            )}
        </div>
    );
}
