import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { saveAppointment } from '../../services/api';
import { Button } from '../../components/ui/Button';
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaShieldAlt,
  FaCheckCircle,
  FaUserTie,
  FaVideo,
  FaMapMarkerAlt,
  FaCommentDots,
  FaRegListAlt,
  FaTimes,
  FaExternalLinkAlt,
  FaArrowRight,
  FaCopy,
  FaHeartbeat,
  FaPiggyBank,
  FaChartLine,
  FaInfoCircle
} from 'react-icons/fa';

export const Appointment = () => {
  const { t } = useTranslation();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    service: 'Health & Medical Insurance',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '11:00 AM',
    mode: 'In-Person (Kanchipuram HQ)',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Available Services
  const services = [
    { id: 'health', name: 'Health & Medical Insurance', icon: FaHeartbeat, color: 'text-rose-500 bg-rose-500/10' },
    { id: 'life', name: 'Term Life & Family Protection', icon: FaShieldAlt, color: 'text-amber-500 bg-amber-500/10' },
    { id: 'sip', name: 'Mutual Funds & SIP Investment', icon: FaChartLine, color: 'text-emerald-500 bg-emerald-500/10' },
    { id: 'retirement', name: 'Retirement & Pension Solutions', icon: FaPiggyBank, color: 'text-blue-500 bg-blue-500/10' },
    { id: 'general', name: 'General Financial Audit', icon: FaRegListAlt, color: 'text-purple-500 bg-purple-500/10' }
  ];

  // Available Time Slots
  const timeSlots = [
    '09:30 AM',
    '11:00 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM'
  ];

  // Consultation Modes
  const consultationModes = [
    { id: 'in_person', name: 'In-Person (Kanchipuram HQ)', icon: FaMapMarkerAlt, desc: 'Visit HQ at MD Plaza, West Raja Street' },
    { id: 'whatsapp_video', name: 'WhatsApp Video Call', icon: FaVideo, desc: 'Face-to-face video consultation on mobile' },
    { id: 'phone', name: 'Phone Call', icon: FaPhone, desc: 'Direct voice call advisory' }
  ];

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    
    // Clean phone number check
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = 'Valid 10-digit WhatsApp/Phone number is required.';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a preferred date.';
    } else {
      const selected = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.date = 'Date cannot be in the past.';
      }
    }

    if (!formData.timeSlot) newErrors.timeSlot = 'Please select a time slot.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleServiceSelect = (serviceName) => {
    setFormData(prev => ({ ...prev, service: serviceName }));
  };

  const handleTimeSelect = (slot) => {
    setFormData(prev => ({ ...prev, timeSlot: slot }));
  };

  const handleModeSelect = (modeName) => {
    setFormData(prev => ({ ...prev, mode: modeName }));
  };

  // Build WhatsApp URL
  const generateWhatsAppUrl = (refId, data) => {
    const text = `📅 *NEW APPOINTMENT BOOKING REQUEST*
----------------------------------------
🆔 *Reference ID:* ${refId}
👤 *Client Name:* ${data.fullName}
📞 *WhatsApp Number:* ${data.phone}
📧 *Email:* ${data.email || 'Not provided'}
💼 *Service Needed:* ${data.service}
📆 *Preferred Date:* ${data.date}
⏰ *Preferred Time:* ${data.timeSlot}
📍 *Consultation Mode:* ${data.mode}
📝 *Notes / Queries:* ${data.notes || 'None'}
----------------------------------------
Hi SK Smart Investments, please confirm my appointment slot. Thank you!`;

    const encoded = encodeURIComponent(text);
    return `https://wa.me/919994451300?text=${encoded}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const refId = `SK-APT-${Math.floor(100000 + Math.random() * 900000)}`;
    const whatsappUrl = generateWhatsAppUrl(refId, formData);

    const newBooking = {
      id: refId,
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'Pending WhatsApp Confirmation',
      whatsappUrl
    };

    // Store in Firestore
    try {
      await saveAppointment(newBooking);
    } catch (err) {
      console.error('Failed to save to Firestore:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setBookingConfirmed(newBooking);
    }, 600);
  };

  const handleOpenWhatsApp = () => {
    if (bookingConfirmed?.whatsappUrl) {
      window.open(bookingConfirmed.whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyRef = () => {
    if (bookingConfirmed?.id) {
      navigator.clipboard.writeText(bookingConfirmed.id);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  // Min date string (today)
  const minDateStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-12 px-4 sm:px-6 lg:px-8 text-left transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider">
            <FaUserTie className="text-sm" />
            <span>Expert Financial Advisory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 dark:text-white tracking-tight leading-tight">
            Schedule an <span className="bg-gradient-to-r from-gold-500 to-amber-500 bg-clip-text text-transparent">Appointment</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Book a 1-on-1 personalized advisory consultation with Certified Financial Planner Prakash Gajendiran & team. Receive instant confirmation directly on WhatsApp.
          </p>
        </motion.div>

        {/* Feature Pill Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/60 dark:border-white/5 shadow-sm flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg shrink-0">
              <FaCheckCircle />
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy-950 dark:text-white">100% Free Consultation</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero fee for initial strategy session</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/60 dark:border-white/5 shadow-sm flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-500 flex items-center justify-center text-lg shrink-0">
              <FaWhatsapp />
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy-950 dark:text-white">Instant WhatsApp Confirmation</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct message confirmation & reminders</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/60 dark:border-white/5 shadow-sm flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-lg shrink-0">
              <FaShieldAlt />
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy-950 dark:text-white">Certified Planning</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Licensed Tata AIA, LIC & HDFC distributor</p>
            </div>
          </div>
        </div>

        {/* Main Appointment Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-navy-900 border border-slate-200/70 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 p-6 text-white border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <FaCalendarAlt className="text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold">Appointment Details</h3>
                <p className="text-xs text-slate-400">Fill in your preferred date, time, and service below</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-full border border-white/10 hidden sm:inline-block">
              Fast & Direct
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">

            {/* Section 1: Service Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-navy-950 dark:text-white uppercase tracking-wider">
                1. Select Advisory Service <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {services.map((item) => {
                  const Icon = item.icon;
                  const isSelected = formData.service === item.name;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => handleServiceSelect(item.name)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-gold-500 bg-gold-500/10 shadow-md ring-1 ring-gold-500'
                          : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/50 dark:bg-navy-950/40'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${item.color}`}>
                        <Icon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-gold-500 dark:text-gold-400' : 'text-navy-950 dark:text-white'}`}>
                          {item.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Date & Time Picker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Date Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-navy-950 dark:text-white uppercase tracking-wider">
                  2. Preferred Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    min={minDateStr}
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-2xl text-xs text-navy-950 dark:text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-sans"
                  />
                </div>
                {errors.date && (
                  <p className="text-[11px] text-rose-500 font-semibold">{errors.date}</p>
                )}
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-navy-950 dark:text-white uppercase tracking-wider">
                  3. Preferred Time Slot <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = formData.timeSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => handleTimeSelect(slot)}
                        className={`py-2.5 px-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gold-500 text-white border-gold-500 shadow-md'
                            : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-gold-400'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
                {errors.timeSlot && (
                  <p className="text-[11px] text-rose-500 font-semibold">{errors.timeSlot}</p>
                )}
              </div>
            </div>

            {/* Section 3: Consultation Mode */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-navy-950 dark:text-white uppercase tracking-wider">
                4. Consultation Mode <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {consultationModes.map((modeItem) => {
                  const Icon = modeItem.icon;
                  const isSelected = formData.mode === modeItem.name;
                  return (
                    <button
                      type="button"
                      key={modeItem.id}
                      onClick={() => handleModeSelect(modeItem.name)}
                      className={`p-3.5 rounded-2xl border text-left space-y-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-gold-500 bg-gold-500/10 shadow-md ring-1 ring-gold-500'
                          : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/50 dark:bg-navy-950/40'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className={`text-sm ${isSelected ? 'text-gold-500' : 'text-slate-400'}`} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-gold-500 dark:text-gold-400' : 'text-navy-950 dark:text-white'}`}>
                          {modeItem.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {modeItem.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Contact Information */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-white/5">
              <h4 className="text-xs font-bold text-navy-950 dark:text-white uppercase tracking-wider">
                5. Your Contact Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FaUser className="text-xs" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-[10px] text-rose-500 font-semibold">{errors.fullName}</p>
                  )}
                </div>

                {/* WhatsApp / Phone Number */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    WhatsApp / Mobile No. <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FaWhatsapp className="text-xs text-emerald-500" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. +91 99944 51300"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[10px] text-rose-500 font-semibold">{errors.phone}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FaEnvelope className="text-xs" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

              </div>

              {/* Notes / Queries */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Additional Notes or Specific Queries <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                    <FaCommentDots className="text-xs" />
                  </div>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Describe any existing policy details, coverage goal, or specific question..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                <FaInfoCircle className="text-gold-500 shrink-0" />
                <span>Redirects to WhatsApp with formatted booking message</span>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 flex items-center justify-center space-x-3 shadow-xl hover:shadow-gold-500/20"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <FaWhatsapp className="text-lg text-emerald-950 animate-pulse" />
                    <span className="font-bold">Confirm & Redirect to WhatsApp</span>
                    <FaArrowRight className="text-xs" />
                  </>
                )}
              </Button>
            </div>

          </form>
        </motion.div>

        {/* Corporate Address & Contact Info Footer */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-navy-900 to-navy-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 text-xl shrink-0">
              <FaMapMarkerAlt />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">SK Smart Corporate Office (HQ)</h4>
              <p className="text-xs text-slate-300">
                # 104, MD Plaza, 1st Floor, West Raja Street, Kanchipuram - 631502.
              </p>
              <p className="text-[11px] text-gold-400 font-semibold">
                Operating Hours: Mon - Sat: 9:00 AM - 7:00 PM
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="tel:+919994451300"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold text-white transition-all"
            >
              📞 Call Hotline
            </a>
            <a
              href="https://wa.me/919994451300"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-lg"
            >
              <FaWhatsapp />
              <span>Direct WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {bookingConfirmed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-left"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white text-center relative">
                <button
                  onClick={() => setBookingConfirmed(null)}
                  className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-all cursor-pointer"
                >
                  <FaTimes />
                </button>
                <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 mx-auto flex items-center justify-center text-white text-2xl mb-3 shadow-inner">
                  <FaCheckCircle />
                </div>
                <h3 className="text-xl font-extrabold">Appointment Details Ready!</h3>
                <p className="text-xs text-emerald-100 mt-1">
                  Click below to open WhatsApp and send your pre-formatted confirmation message.
                </p>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                
                {/* Reference ID Bar */}
                <div className="p-3 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Booking Reference ID</p>
                    <p className="text-sm font-extrabold text-gold-500 font-mono">{bookingConfirmed.id}</p>
                  </div>
                  <button
                    onClick={handleCopyRef}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-navy-800 hover:bg-slate-300 dark:hover:bg-navy-700 rounded-lg text-xs font-semibold text-navy-950 dark:text-white flex items-center space-x-1.5 cursor-pointer transition-all"
                  >
                    <FaCopy className="text-xs" />
                    <span>{copiedRef ? 'Copied!' : 'Copy ID'}</span>
                  </button>
                </div>

                {/* Booking Summary Box */}
                <div className="space-y-2.5 text-xs text-navy-950 dark:text-slate-200 p-4 bg-slate-50/70 dark:bg-navy-950/40 rounded-2xl border border-slate-200/50 dark:border-white/5">
                  <div className="flex justify-between border-b border-slate-200/40 dark:border-white/5 pb-2">
                    <span className="text-slate-500">Client Name:</span>
                    <span className="font-bold">{bookingConfirmed.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/40 dark:border-white/5 pb-2">
                    <span className="text-slate-500">WhatsApp / Phone:</span>
                    <span className="font-bold font-mono">{bookingConfirmed.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/40 dark:border-white/5 pb-2">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-bold text-gold-500">{bookingConfirmed.service}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/40 dark:border-white/5 pb-2">
                    <span className="text-slate-500">Date & Slot:</span>
                    <span className="font-bold">{bookingConfirmed.date} ({bookingConfirmed.timeSlot})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consultation Mode:</span>
                    <span className="font-bold">{bookingConfirmed.mode}</span>
                  </div>
                </div>

                {/* WhatsApp Action Buttons */}
                <div className="pt-2 space-y-2">
                  <Button
                    variant="gold"
                    onClick={handleOpenWhatsApp}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 text-sm shadow-xl cursor-pointer"
                  >
                    <FaWhatsapp className="text-xl text-white animate-bounce" />
                    <span>Open WhatsApp to Confirm</span>
                    <FaExternalLinkAlt className="text-xs" />
                  </Button>

                  <button
                    onClick={() => setBookingConfirmed(null)}
                    className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-center cursor-pointer"
                  >
                    Close & Edit Booking Details
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Appointment;
