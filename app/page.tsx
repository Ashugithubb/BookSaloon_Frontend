'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import {
  Sparkles, Calendar, Star, Users, Shield, Zap,
  Clock, MapPin, Heart, TrendingUp, Award, CheckCircle,
  Menu, X, ArrowRight, ChevronDown, LogOut, LayoutDashboard
} from 'lucide-react';
import { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = (role?: string) => {
    switch (role) {
      case 'OWNER':
        return '/business';
      case 'STAFF':
        return '/staff';
      case 'ADMIN':
        return '/admin';
      default:
        return '/customer';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-rose-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
                BookSalon
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                How It Works
              </Link>
              <Link href="#testimonials" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                Reviews
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 shadow-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-semibold text-slate-700">{user.name?.split(' ')[0]}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden ring-1 ring-black/5"
                      >
                        <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                          <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                          <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                            {user.role}
                          </span>
                        </div>
                        <div className="p-2">
                          <Link
                            href={getDashboardLink(user.role)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/role-selection?intent=login" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                    Login
                  </Link>
                  <Link
                    href="/role-selection?intent=signup"
                    className="bg-gradient-to-r from-indigo-600 to-rose-500 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-900" />
              ) : (
                <Menu className="w-6 h-6 text-slate-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-200 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <Link href="#features" className="block text-slate-700 hover:text-indigo-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Features
                </Link>
                <Link href="#how-it-works" className="block text-slate-700 hover:text-indigo-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  How It Works
                </Link>
                <Link href="#testimonials" className="block text-slate-700 hover:text-indigo-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Reviews
                </Link>

                {user ? (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href={getDashboardLink(user.role)}
                      className="flex items-center gap-2 w-full bg-indigo-50 text-indigo-600 px-4 py-3 rounded-xl font-semibold mb-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full bg-rose-50 text-rose-600 px-4 py-3 rounded-xl font-semibold"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/role-selection?intent=login" className="block text-slate-700 hover:text-indigo-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                    <Link
                      href="/role-selection?intent=signup"
                      className="block text-center bg-gradient-to-r from-indigo-600 to-rose-500 text-white px-6 py-3 rounded-full font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-rose-50">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-400/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-rose-400/20 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-6">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-semibold text-slate-700">Trusted by 10,000+ customers</span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
                  Your Beauty,{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 bg-clip-text text-transparent">
                    Your Schedule
                  </span>
                </h1>

                <p className="text-xl sm:text-2xl text-slate-600 mb-8 leading-relaxed">
                  Book appointments at top-rated salons in seconds. No calls, no hassle, just beauty on your terms.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link
                    href={user ? getDashboardLink(user.role) : "/role-selection?intent=signup"}
                    className="group relative bg-gradient-to-r from-indigo-600 to-rose-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  >
                    {user ? 'Go to Dashboard' : 'Get Started Free'}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/customer"
                    className="bg-white text-slate-700 px-8 py-4 rounded-full text-lg font-semibold border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300 flex items-center justify-center"
                  >
                    Browse Salons
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600">500+</div>
                    <div className="text-sm text-slate-600">Partner Salons</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-rose-500">10k+</div>
                    <div className="text-sm text-slate-600">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-3xl font-bold text-amber-500">
                      4.9 <Star className="w-6 h-6 fill-current ml-1" />
                    </div>
                    <div className="text-sm text-slate-600">Average Rating</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-[500px] lg:h-[600px]">
                {/* Placeholder for hero image */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-rose-100 rounded-3xl shadow-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <Sparkles className="w-24 h-24 text-indigo-600 mx-auto mb-4" />
                    {/* <p className="text-slate-600 text-lg">Hero Illustration</p> */}
                  </div>
                </div>
                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-10 -left-10 bg-white p-4 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-8 h-8 text-indigo-600" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Next Appointment</div>
                      <div className="text-xs text-slate-600">Tomorrow, 2:00 PM</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute bottom-10 -right-10 bg-white p-4 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center space-x-2">
                    <Star className="w-6 h-6 text-amber-500 fill-current" />
                    <div className="text-lg font-bold text-slate-900">4.9/5</div>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">2,450 Reviews</div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="w-8 h-8 text-slate-400" />
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Trust Bar Component
function TrustBar() {
  const brands = [
    { name: 'Glam Studio', icon: Sparkles },
    { name: 'Elite Cuts', icon: Award },
    { name: 'Beauty Bar', icon: Heart },
    { name: 'Style House', icon: Star },
    { name: 'Luxe Salon', icon: TrendingUp },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Trusted by leading salons</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {brands.map((brand, index) => (
            <div key={index} className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-rose-100 rounded-lg flex items-center justify-center">
                <brand.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-lg font-bold text-slate-700">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Book your appointment in under 60 seconds. No phone calls, no waiting.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Clock,
      title: 'Real-Time Availability',
      description: 'See live availability and choose the perfect time slot that fits your schedule.',
      gradient: 'from-purple-500 to-rose-500',
    },
    {
      icon: Star,
      title: 'Verified Reviews',
      description: 'Read authentic reviews from real customers to make informed decisions.',
      gradient: 'from-rose-500 to-amber-500',
    },
    {
      icon: Users,
      title: 'Choose Your Stylist',
      description: 'View staff profiles, ratings, and reviews before booking your appointment.',
      gradient: 'from-amber-500 to-indigo-500',
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Your data is encrypted and protected. Book with confidence.',
      gradient: 'from-indigo-500 to-rose-500',
    },
    {
      icon: Heart,
      title: 'Smart Reminders',
      description: 'Never miss an appointment with automatic email and SMS reminders.',
      gradient: 'from-rose-500 to-purple-500',
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need,{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
              All in One Place
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features designed to make your beauty booking experience seamless and delightful.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity`} />

      <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <feature.icon className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
      <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Search & Discover',
      description: 'Browse salons near you, filter by services, ratings, and availability.',
      icon: MapPin,
    },
    {
      number: 2,
      title: 'Choose & Book',
      description: 'Select your service, preferred stylist, and pick a convenient time slot.',
      icon: Calendar,
    },
    {
      number: 3,
      title: 'Enjoy & Review',
      description: 'Get your service and share your experience to help others.',
      icon: Star,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Book in{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Getting your perfect beauty appointment has never been easier.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-rose-500 opacity-20" style={{ top: '4rem' }} />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative text-center"
            >
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-rose-500 text-white rounded-full text-3xl font-bold mb-6 shadow-lg">
                {step.number}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-rose-500 rounded-full animate-ping opacity-20" />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <step.icon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 text-lg">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const stats = [
    { value: 500, suffix: '+', label: 'Partner Salons', icon: MapPin },
    { value: 10000, suffix: '+', label: 'Happy Customers', icon: Users },
    { value: 4.9, suffix: '★', label: 'Average Rating', icon: Star, decimals: 1 },
    { value: 50, suffix: '+', label: 'Cities Covered', icon: TrendingUp },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <div className="text-5xl font-bold text-white mb-2">
                {inView && (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix}
                  />
                )}
              </div>
              <div className="text-white/90 text-lg font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Regular Customer',
      image: '👩',
      rating: 5,
      text: 'BookSalon has completely changed how I book my hair appointments. So easy and convenient!',
    },
    {
      name: 'Michael Chen',
      role: 'Business Owner',
      image: '👨',
      rating: 5,
      text: 'As a salon owner, this platform has helped us manage bookings effortlessly. Highly recommend!',
    },
    {
      name: 'Emily Davis',
      role: 'Beauty Enthusiast',
      image: '👱‍♀️',
      rating: 5,
      text: 'Love being able to read reviews and choose my stylist. The reminders are super helpful too!',
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Loved by{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            See what our customers and salon partners have to say.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 text-lg mb-6 leading-relaxed">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="text-4xl mr-4">{testimonial.image}</div>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'Simply browse salons, select your desired service and time slot, and confirm your booking. It takes less than a minute!',
    },
    {
      question: 'Can I cancel or reschedule?',
      answer: 'Yes! You can cancel or reschedule your appointment from your dashboard. Please check the salon\'s cancellation policy.',
    },
    {
      question: 'Is it free to use?',
      answer: 'Absolutely! BookSalon is completely free for customers. You only pay for the services you book.',
    },
    {
      question: 'How do I become a partner salon?',
      answer: 'Click "Register Your Salon" and fill out the registration form. Our team will review and get back to you within 24 hours.',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
              >
                <span className="font-semibold text-slate-900 text-lg">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-600 transition-transform ${openIndex === index ? 'rotate-180' : ''
                    }`}
                />
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="px-6 pb-5"
                >
                  <p className="text-slate-600 text-lg leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Beauty Routine?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands of happy customers and salon partners. Get started in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-100 hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Sign Up as Customer
            </Link>
            <Link
              href="/signup"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              Register Your Salon
            </Link>
          </div>
          <p className="text-white/80 text-sm mt-6">No credit card required • Free forever</p>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-rose-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">BookSalon</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Your trusted platform for seamless salon bookings and beauty appointments.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">For Customers</h4>
            <ul className="space-y-3 text-slate-400">
              <li><Link href="/customer" className="hover:text-white transition-colors">Browse Salons</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">For Businesses</h4>
            <ul className="space-y-3 text-slate-400">
              <li><Link href="/business" className="hover:text-white transition-colors">Business Dashboard</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Register Salon</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">© 2025 BookSalon. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <CheckCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
