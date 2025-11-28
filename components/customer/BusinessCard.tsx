'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, Star } from 'lucide-react';

interface BusinessCardProps {
    business: any;
}

export default function BusinessCard({ business }: BusinessCardProps) {
    const [imgSrc, setImgSrc] = useState(
        business.images && business.images.length > 0
            ? (business.images[0].startsWith('http') ? business.images[0] : `http://localhost:3001${business.images[0]}`)
            : "/images/salon-placeholder.png"
    );

    return (
        <Link href={`/business/${business.id}`}>
            <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden h-full flex flex-col">
                {/* Image Header - Fixed Height */}
                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-purple-50 overflow-hidden flex-shrink-0">
                    <img
                        src={imgSrc}
                        alt={business.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => setImgSrc("/images/salon-placeholder.png")}
                    />
                    {business.category && (
                        <div className="absolute top-4 right-4">
                            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-purple-600 rounded-full shadow-lg">
                                {business.category}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content - Fixed Structure */}
                <div className="p-5 flex flex-col flex-grow">
                    {/* Title - Fixed Height with Ellipsis */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                        {business.name}
                    </h3>

                    {/* Description - Fixed Height with Ellipsis */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
                        {business.description || 'A beauty parlor'}
                    </p>

                    {/* Address - Fixed Height with Ellipsis */}
                    {business.address && (
                        <div className="flex items-start mb-3 min-h-[2.5rem]">
                            <MapPin className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700 line-clamp-2 flex-1">
                                {business.address}
                            </p>
                        </div>
                    )}

                    {/* Footer - Always at Bottom */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 flex items-center">
                                <svg className="w-4 h-4 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {business.services?.length || 0} services
                            </span>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-semibold text-gray-700">4.9</span>
                            </div>
                        </div>
                        <span className="text-purple-600 font-semibold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
