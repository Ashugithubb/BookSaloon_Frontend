'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import StaffProfileModal from './StaffProfileModal';
import {
    X, Check, Calendar, Clock, DollarSign, User, Phone,
    Mail, Sparkles, ChevronRight, Star, ArrowLeft
} from 'lucide-react';

interface BookingModalProps {
    business: any;
    onClose: () => void;
}

export default function BookingModal({ business, onClose }: BookingModalProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showStaffProfile, setShowStaffProfile] = useState(false);
    const [viewingStaffId, setViewingStaffId] = useState<string | null>(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (selectedService && selectedDate) {
            fetchAvailableSlots();
        }
    }, [selectedService, selectedDate]);

    const fetchUserData = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setPhoneNumber(data.phone || '');
            setUserName(data.name || '');
            setUserEmail(data.email || '');
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            const { data } = await api.get('/appointments/available-slots', {
                params: {
                    businessId: business.id,
                    serviceId: selectedService.id,
                    date: selectedDate,
                },
            });
            setAvailableSlots(data);
        } catch (error) {
            console.error('Failed to fetch available slots', error);
        }
    };

    const handleBooking = async () => {
        if (!selectedService || !selectedDate || !selectedTime) {
            setError('Please complete all steps');
            return;
        }

        if (!phoneNumber || phoneNumber.length < 10) {
            setError('Please provide a valid phone number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.put('/auth/update-phone', { phone: phoneNumber });
            const appointmentDate = new Date(selectedTime);
            await api.post('/appointments', {
                businessId: business.id,
                serviceId: selectedService.id,
                staffId: selectedStaff?.id || null,
                date: appointmentDate.toISOString(),
            });

            alert('Appointment booked successfully!');
            onClose();
            router.push('/customer');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const stepTitles = [
        'Select Service',
        'Choose Staff',
        'Pick Date & Time',
        'Review Booking',
        'Contact Info'
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 p-6 text-white">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-3xl font-bold flex items-center gap-2">
                                <Sparkles className="w-7 h-7" />
                                Book Appointment
                            </h2>
                            <p className="text-white/90 mt-1">{business.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-between gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className="flex-1">
                                <div className={`h-2 rounded-full transition-all ${s <= step ? 'bg-white' : 'bg-white/30'
                                    }`} />
                                <p className="text-xs mt-1 text-white/80 truncate">{stepTitles[s - 1]}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2"
                            >
                                <span className="font-medium">{error}</span>
                            </motion.div>
                        )}

                        {/* Step 1: Select Service */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Select a Service</h3>
                                <div className="space-y-3">
                                    {business.services?.map((service: any) => (
                                        <motion.div
                                            key={service.id}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => {
                                                setSelectedService(service);
                                                setStep(2);
                                            }}
                                            className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${selectedService?.id === service.id
                                                    ? 'border-indigo-600 bg-indigo-50'
                                                    : 'border-slate-200 hover:border-indigo-300 bg-white'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg text-slate-900">{service.name}</h4>
                                                    {service.description && (
                                                        <p className="text-sm text-slate-600 mt-1">{service.description}</p>
                                                    )}
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="flex items-center gap-1 text-indigo-600 font-bold text-xl">
                                                        <DollarSign className="w-5 h-5" />
                                                        {service.price}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                                                        <Clock className="w-4 h-4" />
                                                        {service.duration} min
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Select Staff */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Choose Your Stylist</h3>
                                <div className="space-y-3">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => {
                                            setSelectedStaff(null);
                                            setStep(3);
                                        }}
                                        className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${!selectedStaff
                                                ? 'border-indigo-600 bg-indigo-50'
                                                : 'border-slate-200 hover:border-indigo-300 bg-white'
                                            }`}
                                    >
                                        <p className="font-semibold text-slate-900">No Preference - Any Available Stylist</p>
                                    </motion.div>
                                    {business.staff?.map((staff: any) => (
                                        <motion.div
                                            key={staff.id}
                                            whileHover={{ scale: 1.02 }}
                                            className={`border-2 rounded-2xl p-5 transition-all ${selectedStaff?.id === staff.id
                                                    ? 'border-indigo-600 bg-indigo-50'
                                                    : 'border-slate-200 hover:border-indigo-300 bg-white'
                                                }`}
                                        >
                                            <div
                                                onClick={() => {
                                                    setSelectedStaff(staff);
                                                    setStep(3);
                                                }}
                                                className="flex items-center gap-4 cursor-pointer"
                                            >
                                                {staff.image ? (
                                                    <img
                                                        src={staff.image.startsWith('http') ? staff.image : `http://localhost:3001${staff.image}`}
                                                        alt={staff.name}
                                                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                                        {staff.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg text-slate-900">{staff.name}</h4>
                                                    {staff.rating > 0 && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                            <span className="font-semibold text-slate-700">{staff.rating.toFixed(1)}</span>
                                                            <span className="text-sm text-slate-500">({staff.reviewCount} reviews)</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setViewingStaffId(staff.id);
                                                    setShowStaffProfile(true);
                                                }}
                                                className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                                            >
                                                View Full Profile →
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setStep(1)}
                                    className="mt-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Services
                                </button>
                            </motion.div>
                        )}

                        {/* Step 3: Select Date & Time */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Pick Date & Time</h3>
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">Select Date</label>
                                    <input
                                        type="date"
                                        min={getTodayDate()}
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 font-medium"
                                    />
                                </div>

                                {selectedDate && (
                                    <div>
                                        {availableSlots.length === 0 ? (
                                            <p className="text-slate-500">Loading available times...</p>
                                        ) : (
                                            <>
                                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                                    Available Time Slots
                                                </label>
                                                {availableSlots.filter((slot) => slot.available).length === 0 ? (
                                                    <p className="text-slate-500">No available time slots for this date</p>
                                                ) : (
                                                    <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                                                        {availableSlots
                                                            .filter((slot) => slot.available)
                                                            .map((slot) => (
                                                                <motion.button
                                                                    key={slot.time}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => {
                                                                        setSelectedTime(slot.time);
                                                                        setStep(4);
                                                                    }}
                                                                    className="px-4 py-3 border-2 border-slate-300 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 text-slate-900 font-medium transition-all"
                                                                >
                                                                    {new Date(slot.time).toLocaleTimeString('en-US', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    })}
                                                                </motion.button>
                                                            ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={() => setStep(2)}
                                    className="mt-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Staff Selection
                                </button>
                            </motion.div>
                        )}

                        {/* Step 4: Confirm Details */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Review Your Booking</h3>
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 space-y-4 border border-indigo-100">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600 font-medium">Business</p>
                                            <p className="font-bold text-slate-900 text-lg">{business.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Check className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600 font-medium">Service</p>
                                            <p className="font-bold text-slate-900 text-lg">{selectedService?.name}</p>
                                        </div>
                                    </div>
                                    {selectedStaff && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-600 font-medium">Stylist</p>
                                                <p className="font-bold text-slate-900 text-lg">{selectedStaff.name}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600 font-medium">Date & Time</p>
                                            <p className="font-bold text-slate-900 text-lg">
                                                {new Date(selectedTime).toLocaleDateString()} at{' '}
                                                {new Date(selectedTime).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 pt-4 border-t border-indigo-200">
                                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <DollarSign className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600 font-medium">Total Price</p>
                                            <p className="font-bold text-indigo-600 text-2xl">${selectedService?.price}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setStep(3)}
                                        className="flex-1 py-3 px-4 border-2 border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setStep(5)}
                                        className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        Continue
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: Contact Info */}
                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Contact Information</h3>
                                <p className="text-slate-600 mb-6">
                                    We'll use this to send you booking confirmations and reminders.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={userName}
                                            disabled
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-600 font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={userEmail}
                                            disabled
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-600 font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="(555) 123-4567"
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 font-medium"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">
                                            Required for booking confirmations and reminders
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setStep(4)}
                                        className="flex-1 py-3 px-4 border-2 border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleBooking}
                                        disabled={loading || !phoneNumber || phoneNumber.length < 10}
                                        className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Booking...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5" />
                                                Confirm & Book
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Staff Profile Modal */}
            {showStaffProfile && viewingStaffId && (
                <StaffProfileModal
                    staffId={viewingStaffId}
                    businessId={business.id}
                    onClose={() => {
                        setShowStaffProfile(false);
                        setViewingStaffId(null);
                    }}
                    onBookWithStaff={(staff) => {
                        setSelectedStaff(staff);
                        setShowStaffProfile(false);
                        setViewingStaffId(null);
                        setStep(3);
                    }}
                />
            )}
        </div>
    );
}
