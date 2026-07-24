import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaWhatsapp, FaInstagram, FaCalendarAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { saveTicket } from '../../services/api';
import { subscribeToCollection } from '../../services/firebaseService';

export const Support = () => {
  const { t } = useTranslation();
  const [contactSuccess, setContactSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToCollection('faqs', setFaqs);
    return () => unsubscribe();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const success = await saveTicket(form);
    if (success) {
      setContactSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        setContactSuccess(false);
      }, 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="text-center">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-500 bg-gold-500/10 rounded-full">
          {t('support_badge')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-950 dark:text-white mt-2">
          {t('support_title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto text-sm">
          {t('support_subtitle')}
        </p>
      </div>

      {/* Main Grid: Info Cards & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact info list */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 text-left space-y-6">
            <h3 className="text-lg font-bold text-navy-950 dark:text-white border-l-2 border-gold-400 pl-2">
              {t('corp_office')}
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-xs">
                <div className="p-2.5 bg-slate-100 dark:bg-navy-900 rounded-xl text-gold-500 mt-0.5 shrink-0">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="font-semibold text-navy-950 dark:text-white">Corporate Office</p>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    # 104, MD Plaza, 1st Floor, West Raja Street, Kanchipuram - 631502.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="p-2.5 bg-slate-100 dark:bg-navy-900 rounded-xl text-gold-500 mt-0.5 shrink-0">
                  <FaClock />
                </div>
                <div>
                  <p className="font-semibold text-navy-950 dark:text-white">{t('office_hours')}</p>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    Open · Closes 6:30 pm (Mon-Sat)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="p-2.5 bg-slate-100 dark:bg-navy-900 rounded-xl text-gold-500 mt-0.5 shrink-0">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="font-semibold text-navy-950 dark:text-white">{t('email_comms')}</p>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    skinvestments2025@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <span className="p-2.5 bg-slate-100 dark:bg-navy-900 rounded-xl text-gold-500 mt-0.5 shrink-0">📞</span>
                <div>
                  <p className="font-semibold text-navy-950 dark:text-white">Phone Hotline</p>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5 font-sans">
                    +91 98407 23956
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="p-2.5 bg-pink-500/10 text-pink-500 rounded-xl mt-0.5 shrink-0">
                  <FaInstagram className="text-base" />
                </div>
                <div>
                  <p className="font-semibold text-navy-950 dark:text-white">Instagram Portal</p>
                  <a 
                    href="https://www.instagram.com/sk_smartinvestments/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-pink-500 hover:underline font-bold mt-0.5 block"
                  >
                    @sk_smartinvestments
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl mt-0.5 shrink-0">
                  <FaWhatsapp className="text-base" />
                </div>
                <div>
                  <p className="font-semibold text-navy-950 dark:text-white">WhatsApp Support</p>
                  <a 
                    href="https://wa.me/919840723956?text=Hi%20SK%20Smart%20Investments%2C%20I%20have%20a%20query%20about%20your%20services." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-500 hover:underline font-bold mt-0.5 block"
                  >
                    Chat Now on WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <span className="p-2.5 bg-slate-100 dark:bg-navy-900 rounded-xl text-gold-500 mt-0.5 shrink-0">💼</span>
                <div>
                  <p className="font-semibold text-navy-950 dark:text-white">Managing Director</p>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    Prakash Gajendiran
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment Booking Banner Card */}
            <div className="pt-4 border-t border-slate-200/50 dark:border-white/10">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-gold-500/10 via-amber-500/10 to-gold-500/10 border border-gold-500/30 text-left space-y-2">
                <div className="flex items-center space-x-2 text-gold-500 dark:text-gold-400 font-bold text-xs">
                  <FaCalendarAlt />
                  <span>Book Advisory Session</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Prefer a scheduled 1-on-1 consultation? Pick your date & time slot.
                </p>
                <Link
                  to="/appointment"
                  className="inline-flex items-center justify-center space-x-2 w-full py-2 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>Book Appointment Now</span>
                  <span>➔</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 sm:p-8 text-left space-y-6">
            <h3 className="text-lg font-bold text-navy-950 dark:text-white border-l-2 border-gold-400 pl-2">
              Send Online Inquiry
            </h3>

            {contactSuccess && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-emerald-600 dark:text-emerald-400 text-xs">
                <FaCheckCircle className="text-lg shrink-0" />
                <span>Thank you! Your ticket query has been registered. An agent will contact you shortly.</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Full Name</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full px-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-navy-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter Email"
                    className="w-full px-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-navy-950 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Inquiry Subject</label>
                <input
                  required
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Subject"
                  className="w-full px-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-navy-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Message Description</label>
                <textarea
                  required
                  rows="4"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Your Message"
                  className="w-full px-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-navy-950 dark:text-white focus:outline-none focus:border-gold-400"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="gold" className="px-6 py-2.5">
                  {t('submit_ticket')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FAQs Accordion Section */}
      {faqs && faqs.length > 0 && (
        <div className="pt-10 border-t border-slate-200/50 dark:border-white/10 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-navy-950 dark:text-white">{t('faq_title') || 'Frequently Asked Questions'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Find quick answers to common queries regarding underwriting cycles, policies renewal, claims validation, and payout procedures.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 text-left">
            {faqs.map((faq, idx) => (
              <div 
                key={faq.id || idx} 
                className="glass-panel dark:glass-panel-gold rounded-2xl border border-slate-200/40 dark:border-white/5 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-navy-950 dark:text-white font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-navy-900/40 transition-colors cursor-pointer text-left"
                >
                  <span>{faq.question}</span>
                  {openFaq === idx ? <FaChevronUp className="text-gold-500 shrink-0 ml-4" /> : <FaChevronDown className="text-slate-400 shrink-0 ml-4" />}
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-navy-950/20 whitespace-pre-line">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Support;
