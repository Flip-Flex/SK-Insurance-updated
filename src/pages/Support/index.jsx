import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { 
  FaClock, FaEnvelope, FaMapMarkerAlt, 
  FaWhatsapp, FaInstagram, FaCalendarAlt, FaChevronDown, 
  FaPhoneAlt, FaArrowRight, FaShieldAlt, FaHeadset
} from 'react-icons/fa';
import { subscribeToCollection } from '../../services/firebaseService';

export const Support = () => {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#F7F7F5] dark:bg-[#000000] text-black dark:text-white pt-24 pb-24 font-sans transition-colors duration-300">

      {/* ── HERO ── */}
      <section className="relative px-4 sm:px-8 max-w-7xl mx-auto pb-20 border-b border-black/10 dark:border-white/10 overflow-hidden transition-colors">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-brand-accent/10 dark:bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end"
        >
          <div className="lg:col-span-8">
            <span className="text-xs text-[#FFB300] dark:text-[#FFB300] uppercase tracking-widest font-bold">We're Here to Help</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl uppercase font-black text-black dark:text-white tracking-tight mt-4 leading-[1.05]">
              TALK TO A REAL<br />INSURANCE ADVISOR.
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-medium max-w-xl mt-6">
              {t('support_subtitle') || 'Whether it\'s a quick question, a claims concern, or planning your next policy — our team responds fast and explains things clearly.'}
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <a 
              href="https://wa.me/919994451300?text=Hi%20SK%20Smart%20Investments%2C%20I%20have%20a%20query%20about%20your%20services."
              target="_blank" rel="noopener noreferrer"
              className="w-full lg:w-auto px-8 py-5 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#FFB300] dark:hover:bg-[#FFB300] hover:text-black transition-colors flex items-center justify-center gap-3 shadow-lg dark:shadow-none"
            >
              <FaWhatsapp className="text-base" /> Chat With Us Now
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── QUICK CONTACT STRIP ── */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto py-16 border-b border-black/10 dark:border-white/10 transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <a href="tel:+919994451300" className="bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-2xl p-6 hover:border-black/30 dark:hover:border-white/20 hover:shadow-lg dark:hover:shadow-none transition-all group shadow-sm dark:shadow-none">
            <div className="w-11 h-11 rounded-xl bg-[#FFB300]/15 dark:bg-[#FFB300]/10 flex items-center justify-center text-[#FFB300] dark:text-[#FFB300] mb-5 group-hover:bg-[#FFB300] dark:group-hover:bg-[#FFB300] group-hover:text-black transition-colors">
              <FaPhoneAlt />
            </div>
            <h3 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">Call Us Directly</h3>
            <p className="text-base font-bold text-black dark:text-white">+91 99944 51300</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Mon – Sat, closes 6:30 pm</p>
          </a>

          <a href="https://wa.me/919994451300" target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-2xl p-6 hover:border-[#25D366]/50 hover:shadow-lg dark:hover:shadow-none transition-all group shadow-sm dark:shadow-none">
            <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] mb-5 group-hover:bg-[#25D366] group-hover:text-white dark:group-hover:text-black transition-colors">
              <FaWhatsapp />
            </div>
            <h3 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">WhatsApp</h3>
            <p className="text-base font-bold text-black dark:text-white">Chat Instantly</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Fastest response time</p>
          </a>

          <a href="mailto:skinvestments2025@gmail.com" className="bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-2xl p-6 hover:border-black/30 dark:hover:border-white/20 hover:shadow-lg dark:hover:shadow-none transition-all group shadow-sm dark:shadow-none">
            <div className="w-11 h-11 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-black dark:text-white mb-5 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
              <FaEnvelope />
            </div>
            <h3 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">Email Address</h3>
            <p className="text-sm font-bold text-black dark:text-white break-all">skinvestments2025@gmail.com</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Replies within 24 hrs</p>
          </a>

          <a href="https://www.instagram.com/sk_smartinvestments/" target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-2xl p-6 hover:border-[#E1306C]/50 hover:shadow-lg dark:hover:shadow-none transition-all group shadow-sm dark:shadow-none">
            <div className="w-11 h-11 rounded-xl bg-[#E1306C]/10 flex items-center justify-center text-[#E1306C] mb-5 group-hover:bg-[#E1306C] group-hover:text-white transition-colors">
              <FaInstagram />
            </div>
            <h3 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">Instagram</h3>
            <p className="text-base font-bold text-black dark:text-white">@sk_smartinvestments</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Follow for updates</p>
          </a>

        </div>
      </section>

      {/* ── OFFICE + APPOINTMENT ── */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto py-16 border-b border-black/10 dark:border-white/10 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Office details card */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-2xl p-8 sm:p-10 shadow-sm dark:shadow-none flex flex-col justify-between transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-black dark:text-white mb-6">
                <FaMapMarkerAlt className="text-lg" />
              </div>
              <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">Corporate Office</h3>
              <p className="text-xl font-bold text-black dark:text-white leading-relaxed mb-6">
                # 104, MD Plaza, 1st Floor,<br/>West Raja Street,<br/>Kanchipuram – 631502.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 border-t border-black/5 dark:border-white/5">
              <div className="w-9 h-9 rounded-full bg-[#FFB300]/15 dark:bg-[#FFB300]/10 flex items-center justify-center text-[#FFB300] dark:text-[#FFB300] shrink-0">
                <FaClock className="text-sm" />
              </div>
              <div>
                <p className="text-sm font-bold text-black dark:text-white">Mon – Sat</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Closes 6:30 pm daily</p>
              </div>
            </div>
          </div>

          {/* Appointment banner — intentionally dark for contrast against the light page */}
          <div className="lg:col-span-7 bg-black dark:bg-[#111111] text-white border border-transparent dark:border-white/10 rounded-2xl p-8 sm:p-12 shadow-lg dark:shadow-none relative overflow-hidden flex flex-col justify-between transition-colors">
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#FFB300]/20 dark:bg-[#FFB300]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-[#FFB300] dark:bg-[#FFB300] flex items-center justify-center text-black shrink-0">
                  <FaCalendarAlt className="text-sm" />
                </div>
                <span className="text-[#FFB300] dark:text-[#FFB300] text-xs font-bold uppercase tracking-widest">Book a Session</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 leading-snug text-white">
                Prefer a Scheduled 1-on-1 Consultation?
              </h2>
              <p className="text-neutral-300 dark:text-neutral-400 text-sm font-medium max-w-md mb-8">
                Pick a date and time that works for you, and we'll walk through your policy options or claims in detail.
              </p>
            </div>
            <Link
              to="/appointment"
              className="relative z-10 w-full sm:w-fit px-8 py-4 bg-[#FFB300] dark:bg-[#FFB300] text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-colors text-center whitespace-nowrap flex items-center justify-center gap-2"
            >
              Book Appointment <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto py-16 border-b border-black/10 dark:border-white/10 transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-2">
            <div className="w-11 h-11 rounded-full bg-[#FFB300]/15 dark:bg-[#FFB300]/10 flex items-center justify-center text-[#FFB300] dark:text-[#FFB300] shrink-0">
              <FaShieldAlt />
            </div>
            <div>
              <h4 className="text-base font-bold text-black dark:text-white mb-1">Licensed & Trusted</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Working with 16+ leading insurers to get you the right cover.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-2">
            <div className="w-11 h-11 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black dark:text-white shrink-0">
              <FaHeadset />
            </div>
            <div>
              <h4 className="text-base font-bold text-black dark:text-white mb-1">Real Human Support</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">No bots, no call centres — you speak directly with our advisors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      {faqs && faqs.length > 0 && (
        <section className="px-4 sm:px-8 max-w-7xl mx-auto pt-20 transition-colors">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-4">
              Got <span className="text-[#FFB300] dark:text-[#FFB300]">Questions?</span>
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">
              Find quick answers to common queries regarding our services and procedures.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={faq.id || idx} 
                className={`bg-white dark:bg-[#0A0A0A] rounded-xl border transition-all duration-200 overflow-hidden shadow-sm dark:shadow-none ${openFaq === idx ? 'border-[#FFB300]/60 dark:border-[#FFB300]/50 shadow-[0_0_20px_rgba(201,209,0,0.15)] dark:shadow-[0_0_20px_rgba(255, 179, 0,0.05)]' : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-black dark:text-white font-bold text-sm cursor-pointer text-left focus:outline-none"
                >
                  <span className="pr-8">{faq.question}</span>
                  <div className={`p-2 rounded-full shrink-0 transition-all duration-300 ${openFaq === idx ? 'bg-[#FFB300] dark:bg-[#FFB300] text-black rotate-180' : 'bg-black/5 dark:bg-[#111111] text-black/50 dark:text-white/50'}`}>
                    <FaChevronDown className="text-xs" />
                  </div>
                </button>

                {openFaq === idx && (
                  <div className="px-6 pb-6 pt-1 text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed bg-white dark:bg-[#0A0A0A] whitespace-pre-line">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── FINAL CTA — intentionally dark for contrast against the light page ── */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto pt-24 transition-colors">
        <div className="bg-black dark:bg-[#0A0A0A] text-white rounded-2xl p-10 sm:p-16 text-center relative overflow-hidden shadow-xl dark:shadow-none border border-transparent dark:border-white/10 transition-colors">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#FFB300]/15 dark:bg-[#FFB300]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-white">
              Still Have Questions?
            </h2>
            <p className="text-neutral-300 dark:text-neutral-400 text-sm sm:text-base font-medium mb-8">
              Our team is one message away. Reach out and we'll get back to you the same day.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="https://wa.me/919994451300?text=Hi%20SK%20Smart%20Investments%2C%20I%20have%20a%20query%20about%20your%20services."
                target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 bg-[#FFB300] dark:bg-[#FFB300] text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                <FaWhatsapp /> Message Us
              </a>
              <a 
                href="tel:+919994451300"
                className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <FaPhoneAlt /> Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
export default Support;
