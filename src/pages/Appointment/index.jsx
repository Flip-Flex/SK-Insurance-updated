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
  const [currentStep, setCurrentStep] = useState(1);

  // Available Services
  const services = [
    { id: 'health', name: 'Health & Medical Insurance', icon: FaHeartbeat, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'life', name: 'Term Life & Family Protection', icon: FaShieldAlt, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'sip', name: 'Mutual Funds & SIP Investment', icon: FaChartLine, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'retirement', name: 'Retirement & Pension Solutions', icon: FaPiggyBank, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'general', name: 'General Financial Audit', icon: FaRegListAlt, color: 'text-amber-500', bg: 'bg-amber-500/10' }
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
    { id: 'in_person', name: 'In-Person (HQ)', icon: FaMapMarkerAlt, desc: 'Visit our Kanchipuram Office' },
    { id: 'whatsapp_video', name: 'WhatsApp Video', icon: FaVideo, desc: 'Face-to-face mobile call' },
    { id: 'phone', name: 'Phone Call', icon: FaPhone, desc: 'Direct voice advisory' }
  ];

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = 'Valid 10-digit number is required.';
    }

    if (!formData.date) {
      newErrors.date = 'Select a date.';
    } else {
      const selected = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.date = 'Date cannot be in the past.';
      }
    }

    if (!formData.timeSlot) newErrors.timeSlot = 'Select a time slot.';
    if (!formData.service) newErrors.service = 'Select a service.';
    if (!formData.mode) newErrors.mode = 'Select a consultation mode.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep = (step) => {
    if (step === 1) {
      return !!formData.service;
    }
    if (step === 2) {
      const newErrors = {};
      let isValid = true;
      if (!formData.date) { newErrors.date = 'Select a date.'; isValid = false; }
      else {
        const selected = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) { newErrors.date = 'Date cannot be in the past.'; isValid = false; }
      }
      if (!formData.timeSlot) { newErrors.timeSlot = 'Select a time slot.'; isValid = false; }
      if (!formData.mode) { newErrors.mode = 'Select a consultation mode.'; isValid = false; }
      setErrors(prev => ({...prev, date: newErrors.date, timeSlot: newErrors.timeSlot, mode: newErrors.mode}));
      return isValid;
    }
    if (step === 3) {
      return validateForm();
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
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
    setErrors(prev => ({ ...prev, service: null }));
    setTimeout(() => {
      setCurrentStep(2);
    }, 300); // Auto advance after a slight delay
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

    try {
      await saveAppointment(newBooking);
    } catch (err) {
      console.error('Failed to save to Firestore:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setBookingConfirmed(newBooking);
    }, 800);
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

  const minDateStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 text-left transition-colors duration-500 relative overflow-hidden">
      
      {/* Background Animated Blobs for Glassmorphism Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/30 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 -right-20 w-80 h-80 bg-neutral-400/30 dark:bg-amber-400/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-600/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* Header Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center space-y-6 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
            Schedule an <span className="bg-gradient-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent">Appointment</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Secure your future today. Book a 1-on-1 personalized advisory consultation with Certified Financial Planner Prakash Gajendiran & team.
          </p>
        </motion.div>

        {/* Feature Pill Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {[
            { title: '100% Free Consultation', desc: 'Zero fee for initial strategy session', icon: FaCheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { title: 'Instant WhatsApp Sync', desc: 'Direct message confirmation & reminders', icon: FaWhatsapp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { title: 'Certified Planning', desc: 'Licensed Tata AIA, LIC & HDFC distributor', icon: FaShieldAlt, color: 'text-blue-500', bg: 'bg-blue-500/10' }
          ].map((feature, idx) => (
            <div key={idx} className="p-5 rounded-3xl bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center space-x-4 transition-transform hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center text-xl shrink-0 shadow-inner`}>
                <feature.icon />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-950 dark:text-white">{feature.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{feature.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main Appointment Form Container (Glassmorphism) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-white/70 dark:bg-neutral-900/50 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-3xl sm:rounded-[2.5rem] shadow-2xl dark:shadow-amber-500/5 overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-white/40 to-transparent dark:from-neutral-800/40 dark:to-transparent p-4 sm:p-8 border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                <FaCalendarAlt className="text-lg sm:text-xl" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-white">Booking Details</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Customize your consultation</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-8">
            
            {/* Progress Tracker */}
            <div className="flex items-center justify-between mb-8 sm:mb-10 relative px-2 sm:px-10">
              <div className="absolute top-4 sm:top-5 left-6 right-6 sm:left-8 sm:right-8 h-1 bg-slate-200 dark:bg-neutral-800 -translate-y-1/2 rounded-full z-0"></div>
              <div className="absolute top-4 sm:top-5 left-6 sm:left-8 h-1 bg-amber-500 -translate-y-1/2 rounded-full z-0 transition-all duration-500" style={{ width: `${((currentStep - 1) / 2) * 100}%`, maxWidth: 'calc(100% - 3rem)' }}></div>
              {[1, 2, 3].map((step) => (
                <div key={step} className={`relative z-10 flex flex-col items-center justify-center space-y-1.5 sm:space-y-2`}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-500 ${currentStep >= step ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20' : 'bg-slate-200 dark:bg-neutral-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-white/10'}`}>
                    {step < currentStep ? <FaCheckCircle className="text-sm sm:text-lg" /> : step}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${currentStep >= step ? 'text-neutral-950 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {step === 1 ? 'Service' : step === 2 ? 'Schedule' : 'Details'}
                  </span>
                </div>
              ))}
            </div>

            <div className="min-h-[350px]">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Service Selection */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h4 className="text-lg font-bold text-neutral-950 dark:text-white">What type of advice do you need?</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select one of our premium services below</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {services.map((item) => {
                        const Icon = item.icon;
                        const isSelected = formData.service === item.name;
                        return (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            key={item.id}
                            onClick={() => handleServiceSelect(item.name)}
                            className={`p-3 sm:p-4 rounded-2xl text-left flex flex-row sm:flex-col items-center sm:justify-center sm:text-center space-x-4 sm:space-x-0 sm:space-y-3 transition-all duration-300 relative overflow-hidden ${
                              isSelected
                                ? 'border-transparent shadow-lg shadow-amber-500/20 bg-white dark:bg-neutral-800 ring-2 ring-amber-500'
                                : 'border-slate-200 dark:border-white/10 bg-white/50 dark:bg-neutral-900/30 hover:bg-white dark:hover:bg-neutral-800 border'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-full pointer-events-none" />
                            )}
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0 ${isSelected ? 'bg-amber-500 text-white shadow-md' : item.bg + ' ' + item.color} transition-colors`}>
                              <Icon />
                            </div>
                            <div className="flex-1 sm:flex-none">
                              <p className={`text-sm font-bold leading-tight ${isSelected ? 'text-neutral-950 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                {item.name}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="absolute top-1/2 -translate-y-1/2 sm:translate-y-0 sm:top-3 right-4 sm:right-3 text-amber-500">
                                <FaCheckCircle className="text-sm" />
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                    {errors.service && <p className="text-sm text-center text-rose-500 font-semibold">{errors.service}</p>}
                  </motion.div>
                )}

                {/* STEP 2: Schedule & Mode */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
                      {/* Date & Time */}
                      <div className="space-y-6 bg-slate-50/50 dark:bg-neutral-950/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-white/5">
                        <div className="space-y-3 sm:space-y-4">
                          <label className="text-sm font-bold text-neutral-950 dark:text-white tracking-wide">
                            Preferred Date <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="date"
                            min={minDateStr}
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl text-sm font-medium text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-sm cursor-pointer"
                          />
                          {errors.date && <p className="text-xs text-rose-500 font-semibold pl-2">{errors.date}</p>}
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                          <label className="text-sm font-bold text-neutral-950 dark:text-white tracking-wide">
                            Time Slot <span className="text-rose-500">*</span>
                          </label>
                          <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            {timeSlots.map((slot) => {
                              const isSelected = formData.timeSlot === slot;
                              return (
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  type="button"
                                  key={slot}
                                  onClick={() => handleTimeSelect(slot)}
                                  className={`py-2.5 px-1 sm:py-3 sm:px-2 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold text-center transition-all duration-300 border ${
                                    isSelected
                                      ? 'bg-gradient-to-r from-amber-500 to-amber-500 text-white border-transparent shadow-md shadow-amber-500/30'
                                      : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-amber-400 hover:text-amber-500 dark:hover:text-amber-400'
                                  }`}
                                >
                                  {slot}
                                </motion.button>
                              );
                            })}
                          </div>
                          {errors.timeSlot && <p className="text-xs text-rose-500 font-semibold pl-2">{errors.timeSlot}</p>}
                        </div>
                      </div>

                      {/* Consultation Mode */}
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-neutral-950 dark:text-white tracking-wide">
                          Consultation Mode <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-col gap-3">
                          {consultationModes.map((modeItem) => {
                            const Icon = modeItem.icon;
                            const isSelected = formData.mode === modeItem.name;
                            return (
                              <motion.button
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                key={modeItem.id}
                                onClick={() => handleModeSelect(modeItem.name)}
                                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between transition-all duration-300 border ${
                                  isSelected
                                    ? 'bg-white dark:bg-neutral-800 border-amber-500 ring-1 ring-amber-500 shadow-md'
                                    : 'bg-white/50 dark:bg-neutral-900/30 border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-neutral-800'
                                }`}
                              >
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                  <div className={`w-10 h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-lg ${isSelected ? 'bg-amber-500 text-white shadow-inner' : 'bg-slate-100 dark:bg-neutral-950 text-slate-500 dark:text-slate-400'}`}>
                                    <Icon />
                                  </div>
                                  <div className="text-left">
                                    <span className={`block text-xs sm:text-sm font-bold ${isSelected ? 'text-neutral-950 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                      {modeItem.name}
                                    </span>
                                    <span className="block text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                      {modeItem.desc}
                                    </span>
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[8px] sm:text-[10px]">
                                    <FaCheckCircle />
                                  </div>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                        {errors.mode && <p className="text-xs text-rose-500 font-semibold pl-2">{errors.mode}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Contact Info */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 ml-1">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors">
                            <FaUser className="text-sm" />
                          </div>
                          <input
                            type="text"
                            name="fullName"
                            placeholder="e.g. Rahul Sharma"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-neutral-950 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-sm"
                          />
                        </div>
                        {errors.fullName && <p className="text-xs text-rose-500 font-semibold pl-2">{errors.fullName}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 ml-1">
                          WhatsApp / Mobile No. <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                            <FaWhatsapp className="text-sm" />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="+91 99944 51300"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-neutral-950 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
                          />
                        </div>
                        {errors.phone && <p className="text-xs text-rose-500 font-semibold pl-2">{errors.phone}</p>}
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 ml-1">
                          Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors">
                            <FaEnvelope className="text-sm" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            placeholder="rahul@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-neutral-950 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 ml-1">
                          Additional Notes <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative group">
                          <div className="absolute top-4 left-4 pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors">
                            <FaCommentDots className="text-sm" />
                          </div>
                          <textarea
                            name="notes"
                            rows={3}
                            placeholder="Describe any specific goals or questions..."
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-neutral-950 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-sm resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation & Submit Footer */}
            <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-all"
                  >
                    Back
                  </button>
                )}
              </div>

              <div>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl font-extrabold text-xs sm:text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md flex items-center space-x-2"
                  >
                    <span>Next Step</span>
                    <FaArrowRight className="text-xs" />
                  </button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl font-extrabold text-xs sm:text-sm text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] flex items-center justify-center space-x-2 sm:space-x-3 transition-all cursor-pointer relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    {isSubmitting ? (
                      <span className="relative z-10 whitespace-nowrap">Processing...</span>
                    ) : (
                      <span className="relative z-10 flex items-center space-x-2 sm:space-x-3 whitespace-nowrap">
                        <FaWhatsapp className="text-lg sm:text-xl animate-pulse" />
                        <span>Confirm Booking</span>
                      </span>
                    )}
                  </motion.button>
                )}
              </div>
            </div>

          </form>
        </motion.div>

        {/* Corporate Address & Contact Info Footer */}
        <div className="p-6 sm:p-8 rounded-[2rem] bg-neutral-950 dark:bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl relative overflow-hidden z-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-start space-x-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 text-2xl shrink-0 backdrop-blur-md">
              <FaMapMarkerAlt />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-white tracking-wide">SK Smart Corporate HQ</h4>
              <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
                # 104, MD Plaza, 1st Floor, West Raja Street, Kanchipuram - 631502.
              </p>
              <div className="inline-flex items-center space-x-2 mt-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                <FaClock className="text-amber-400 text-xs" />
                <p className="text-xs text-slate-300 font-semibold">Mon - Sat: 9:00 AM - 7:00 PM</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 shrink-0 relative z-10 w-full md:w-auto">
            <a
              href="tel:+919994451300"
              className="flex-1 md:flex-none text-center px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold text-white transition-all backdrop-blur-sm"
            >
              Call Us
            </a>
            <a
              href="https://wa.me/919994451300"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(5,150,105,0.4)]"
            >
              <FaWhatsapp className="text-lg" />
              <span>Message</span>
            </a>
          </div>
        </div>

      </div>

      {/* Confirmation Modal - Ticket Style */}
      <AnimatePresence>
        {bookingConfirmed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden text-left filter drop-shadow-2xl"
            >
              {/* Ticket Top Half */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-white text-center relative border-b-2 border-dashed border-white/40">
                
                {/* Cutouts for Ticket Effect */}
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-neutral-950/80 rounded-full" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-neutral-950/80 rounded-full" />
                
                <button
                  onClick={() => setBookingConfirmed(null)}
                  className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/20 transition-all cursor-pointer"
                >
                  <FaTimes />
                </button>
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white mx-auto flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
                  <FaCheckCircle />
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight">Booking Ready</h3>
                <p className="text-sm text-emerald-100 mt-2 opacity-90">
                  Your appointment slot is reserved. Confirm via WhatsApp to lock it in.
                </p>
              </div>

              {/* Ticket Bottom Half */}
              <div className="p-8 space-y-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-950 relative">
                
                {/* Reference ID Bar */}
                <div className="p-4 bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Ticket / Ref ID</p>
                    <p className="text-base font-extrabold text-neutral-950 dark:text-white font-mono tracking-wider">{bookingConfirmed.id}</p>
                  </div>
                  <button
                    onClick={handleCopyRef}
                    className="p-3 bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-700 rounded-xl text-neutral-950 dark:text-white shadow-sm border border-slate-200 dark:border-white/5 transition-all"
                    title="Copy ID"
                  >
                    {copiedRef ? <FaCheckCircle className="text-emerald-500" /> : <FaCopy />}
                  </button>
                </div>

                {/* Booking Summary Box */}
                <div className="space-y-4 text-sm text-neutral-950 dark:text-slate-200 px-2">
                  <div className="flex justify-between items-end border-b border-slate-100 dark:border-white/5 pb-3">
                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Client</span>
                    <span className="font-extrabold text-right">{bookingConfirmed.fullName}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-100 dark:border-white/5 pb-3">
                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Service</span>
                    <span className="font-extrabold text-amber-500 text-right max-w-[180px] leading-tight">{bookingConfirmed.service}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-100 dark:border-white/5 pb-3">
                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Date & Time</span>
                    <span className="font-extrabold text-right">{bookingConfirmed.date}<br/><span className="text-slate-400 font-medium text-xs">{bookingConfirmed.timeSlot}</span></span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Mode</span>
                    <span className="font-extrabold text-right">{bookingConfirmed.mode}</span>
                  </div>
                </div>

                {/* WhatsApp Action Buttons */}
                <div className="pt-4 space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOpenWhatsApp}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold rounded-2xl flex items-center justify-center space-x-3 text-base shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer transition-colors"
                  >
                    <FaWhatsapp className="text-2xl" />
                    <span>Send Confirmation</span>
                  </motion.button>

                  <button
                    onClick={() => setBookingConfirmed(null)}
                    className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-center cursor-pointer transition-colors"
                  >
                    Wait, I need to edit details
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

