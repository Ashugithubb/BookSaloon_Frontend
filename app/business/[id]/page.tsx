'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../lib/api';
import BookingModal from '../../../components/customer/BookingModal';
import ReviewModal from '../../../components/customer/ReviewModal';
import StaffProfileModal from '../../../components/customer/StaffProfileModal';
import { useAuth } from '../../../context/AuthContext';
import {
    MapPin, Clock, DollarSign, Star, ChevronLeft, ChevronRight,
    Sparkles, Calendar, Users, Award, MessageCircle, ArrowLeft,
    Phone, Mail, Globe
} from 'lucide-react';

export default function BusinessDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [business, setBusiness] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showBooking, setShowBooking] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showStaffProfile, setShowStaffProfile] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (params.id) {
            fetchBusiness();
        }
    }, [params.id]);

    const fetchBusiness = async () => {
        try {
            const { data } = await api.get(`/businesses/${params.id}`);
            setBusiness(data);
        } catch (error) {
            console.error('Failed to fetch business', error);
        } finally {
            setLoading(false);
        }
    };

    const nextImage = () => {
        if (business?.images) {
            setCurrentImageIndex((prev) => (prev + 1) % business.images.length);
        }
    };

    const prevImage = () => {
        if (business?.images) {
            setCurrentImageIndex((prev) => (prev - 1 + business.images.length) % business.images.length);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-indigo-600" />
                        </div>
                    </div>
                    <p className="text-lg font-medium text-slate-700">Loading salon details...</p>
                </motion.div>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Business not found</h2>
                    <button
                        onClick={() => router.back()}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        ← Go back
                    </button>
                </div>
            </div>
        );
    }

    const images = business.images || [];
    const hasImages = images.length > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-50">
            {/* Back Button */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Salons
                    </button>
                </div>
            </div>

            {/* Hero Section with Image Slider */}
            {hasImages && (
                <div className="relative h-[500px] bg-slate-900 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                            src={images[currentImageIndex].startsWith('http') ? images[currentImageIndex] : `http://localhost:3001${images[currentImageIndex]}`}
                            alt={business.name}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-10"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-10"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </>
                    )}

                    {/* Image Indicators */}
                    {images.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {images.map((_: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                                        ? 'bg-white w-8'
                                        : 'bg-white/50 hover:bg-white/75'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Business Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-end justify-between">
                                <div>
                                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                                        {business.name}
                                    </h1>
                                    {business.category && (
                                        <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold border border-white/30">
                                            {business.category}
                                        </span>
                                    )}
                                </div>
                                {(!user || user.role === 'CUSTOMER') && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            if (!user) {
                                                router.push('/login');
                                            } else {
                                                setShowBooking(true);
                                            }
                                        }}
                                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-indigo-500/50 transition-all flex items-center gap-2"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Book Now
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Business Info Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl p-8 mb-8 border border-white/20"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Description */}
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-indigo-600" />
                                About Us
                            </h2>
                            <p className="text-slate-700 text-lg leading-relaxed mb-6">
                                {business.description || 'Welcome to our salon! We provide premium beauty services.'}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {business.address && (
                                    <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl">
                                        <MapPin className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-indigo-600 font-bold mb-1">Address</p>
                                            <p className="text-slate-700 font-medium">{business.address}</p>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold mt-2 inline-flex items-center gap-1"
                                            >
                                                Get Directions <ArrowLeft className="w-3 h-3 rotate-180" />
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {business.phone && (
                                    <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-xl">
                                        <Phone className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-rose-600 font-bold mb-1">Phone</p>
                                            <a href={`tel:${business.phone}`} className="text-slate-700 font-medium hover:text-rose-600 transition-colors">
                                                {business.phone}
                                            </a>
                                            <p className="text-xs text-rose-400 mt-1">Call for inquiries</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Business Hours */}
                            {business.hours && business.hours.length > 0 && (
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-indigo-600" />
                                        Opening Hours
                                    </h3>
                                    <div className="space-y-3">
                                        {business.hours.map((hour: any) => {
                                            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                            const isToday = new Date().getDay() === hour.dayOfWeek;

                                            return (
                                                <div key={hour.dayOfWeek} className={`flex justify-between items-center text-sm ${isToday ? 'font-bold text-indigo-900 bg-indigo-50 p-2 rounded-lg -mx-2' : 'text-slate-600'}`}>
                                                    <span className="w-24">{days[hour.dayOfWeek]}</span>
                                                    {hour.isOpen ? (
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                            {hour.startTime} - {hour.endTime}
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-2 text-slate-400">
                                                            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                                            Closed
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}


                        </div>

                        {/* Right: Quick Stats */}
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                        <Star className="w-5 h-5 text-white fill-white" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-slate-900">4.9</div>
                                        <div className="text-sm text-slate-600">Rating</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-rose-50 rounded-2xl p-6 border border-purple-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-slate-900">{business.services?.length || 0}</div>
                                        <div className="text-sm text-slate-600">Services</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl p-6 border border-rose-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center">
                                        <Award className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-slate-900">{business.staff?.length || 0}</div>
                                        <div className="text-sm text-slate-600">Experts</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Image Gallery */}
                {images.length > 1 && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Gallery
                            </span>
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map((img: string, index: number) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group"
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <img
                                        src={img.startsWith('http') ? img : `http://localhost:3001${img}`}
                                        alt={`${business.name} ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Services Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Our Services
                        </span>
                        <Sparkles className="w-6 h-6 text-amber-500" />
                    </h2>
                    {business.services && business.services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {business.services.map((service: any, index: number) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="group backdrop-blur-xl bg-white/80 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-white/20 relative overflow-hidden"
                                >
                                    {/* Gradient accent */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500" />

                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                        {service.name}
                                    </h3>
                                    {service.description && (
                                        <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                            {service.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div>
                                            {service.discount && service.discount > 0 ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-slate-400 line-through">₹{service.price}</span>
                                                        <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                                                            {service.discount}% OFF
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-emerald-600">
                                                        <DollarSign className="w-5 h-5" />
                                                        <span className="text-2xl font-bold">{(service.price * (1 - service.discount / 100)).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-indigo-600">
                                                    <DollarSign className="w-5 h-5" />
                                                    <span className="text-2xl font-bold">{service.price}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm font-medium">{service.duration} min</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 backdrop-blur-xl bg-white/60 rounded-2xl">
                            <p className="text-slate-500 text-lg">No services available</p>
                        </div>
                    )}
                </motion.div>

                {/* Staff Section */}
                {business.staff && business.staff.length > 0 && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Meet Our Team
                            </span>
                            <Users className="w-6 h-6 text-indigo-600" />
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {business.staff.map((member: any, index: number) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="backdrop-blur-xl bg-white/80 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-white/20"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        {member.image ? (
                                            <img
                                                src={member.image.startsWith('http') ? member.image : `http://localhost:3001${member.image}`}
                                                alt={member.name}
                                                className="w-16 h-16 rounded-full object-cover border-4 border-indigo-100"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                                                {member.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-slate-900">{member.name}</h3>
                                            {member.rating > 0 ? (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                    <span className="font-semibold text-slate-700">{member.rating.toFixed(1)}</span>
                                                    <span className="text-sm text-slate-500">({member.reviewCount})</span>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-500 mt-1">New Member</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Reviews Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl p-8 border border-white/20"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Customer Reviews
                            </span>
                            <MessageCircle className="w-6 h-6 text-indigo-600" />
                        </h2>
                        {user?.role === 'CUSTOMER' && (
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                            >
                                Write a Review
                            </button>
                        )}
                    </div>
                    {business.reviews && business.reviews.filter((r: any) => !r.staffId).length > 0 ? (
                        <div className="space-y-6">
                            {business.reviews.filter((r: any) => !r.staffId).map((review: any) => (
                                <div key={review.id} className="border-b border-slate-200 pb-6 last:border-b-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {review.customer.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-slate-900">{review.customer.name}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < review.rating
                                                                ? 'text-amber-500 fill-amber-500'
                                                                : 'text-slate-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {review.comment && (
                                        <p className="text-slate-700 leading-relaxed pl-13">{review.comment}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 text-lg">No reviews yet. Be the first to review!</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Modals */}
            {showBooking && (
                <BookingModal
                    business={business}
                    onClose={() => setShowBooking(false)}
                />
            )}

            {showReviewModal && (
                <ReviewModal
                    businessId={business.id}
                    staffList={business.staff || []}
                    onClose={() => setShowReviewModal(false)}
                    onSuccess={fetchBusiness}
                />
            )}

            {showStaffProfile && selectedStaffId && (
                <StaffProfileModal
                    staffId={selectedStaffId}
                    businessId={business.id}
                    onClose={() => {
                        setShowStaffProfile(false);
                        setSelectedStaffId(null);
                    }}
                />
            )}

            {/* Lightbox for Gallery */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
                    >
                        <motion.img
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            src={selectedImage.startsWith('http') ? selectedImage : `http://localhost:3001${selectedImage}`}
                            alt="Gallery"
                            className="max-w-full max-h-full object-contain rounded-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center text-white text-2xl"
                        >
                            ×
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
