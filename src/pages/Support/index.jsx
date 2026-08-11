import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { 
  FaClock, FaEnvelope, FaMapMarkerAlt, 
  FaWhatsapp, FaInstagram, FaCalendarAlt, FaChevronDown, 
  FaPhoneAlt
} from 'react-icons/fa';
import { subscribeToCollection } from '../../services/firebaseService';

export const Support = () => {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);


  return (
    <div className="min-h-screen bg-[#000000] text-white pt-24 pb-32 xl:pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Title ── */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Support & <span className="text-[#F6FF00]">Contact</span>
          </h1>
          <p className="text-neutral-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            {t('support_subtitle') || 'Reach out to our experts for personalized assistance, claims support, or to schedule a consultation.'}
          </p>
        </div>

        {/* ── Main Layout: Contact Cards & Form ── */}
        <div className="grid grid-cols-1 max-w-3xl mx-auto gap-12 items-start mb-24">
          
          {/* Left Column: Contact Cards */}
          <div className="space-y-6">
            
            {/* Corporate Office */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-full bg-white/5 flex items-center justify-center text-white">
                <FaMapMarkerAlt className="text-lg" />
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Corporate Office</h3>
                <p className="text-sm font-bold text-white leading-relaxed">
                  # 104, MD Plaza, 1st Floor,<br/>West Raja Street,<br/>Kanchipuram - 631502.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all flex flex-col justify-center items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#F6FF00]/10 flex items-center justify-center text-[#F6FF00] mb-4">
                  <FaPhoneAlt />
                </div>
                <h3 className="text-[10px] font-bold text-[#F6FF00] uppercase tracking-widest mb-1">Call Us</h3>
                <p className="text-sm font-bold text-white tracking-wide">+91 99944 51300</p>
              </div>
              
              {/* Office Hours */}
              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all flex flex-col justify-center items-center text-center">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white mb-4">
                  <FaClock />
                </div>
                <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Office Hours</h3>
                <p className="text-sm font-bold text-white">Mon - Sat <br/><span className="text-neutral-400 text-xs font-normal">Closes 6:30 pm</span></p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all flex items-center gap-4">
              <div className="w-12 h-12 shrink-0 rounded-full bg-white/5 flex items-center justify-center text-white">
                <FaEnvelope className="text-lg" />
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Email Address</h3>
                <p className="text-sm md:text-base font-bold text-white">skinvestments2025@gmail.com</p>
              </div>
            </div>

            {/* Social / Messaging */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <a href="https://wa.me/919994451300?text=Hi%20SK%20Smart%20Investments%2C%20I%20have%20a%20query%20about%20your%20services." target="_blank" rel="noopener noreferrer" className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-[#25D366]/50 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 shrink-0 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-black transition-colors">
                  <FaWhatsapp className="text-lg" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 group-hover:text-[#25D366] transition-colors">WhatsApp</h3>
                  <p className="text-sm font-bold text-white">Chat Now &rarr;</p>
                </div>
              </a>
              <a href="https://www.instagram.com/sk_smartinvestments/" target="_blank" rel="noopener noreferrer" className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-[#E1306C]/50 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 shrink-0 rounded-full bg-[#E1306C]/10 flex items-center justify-center text-[#E1306C] group-hover:bg-[#E1306C] group-hover:text-white transition-colors">
                  <FaInstagram className="text-lg" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 group-hover:text-[#E1306C] transition-colors">Instagram</h3>
                  <p className="text-sm font-bold text-white">@sk_smart... &rarr;</p>
                </div>
              </a>
            </div>

          </div>

        </div>

        {/* ── Appointment Banner ── */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 mb-24">
           <div>
             <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 rounded-full bg-[#F6FF00] flex items-center justify-center text-black">
                  <FaCalendarAlt className="text-sm" />
               </div>
               <h2 className="text-2xl font-bold text-white tracking-tight">
                  Book An Advisory Session
               </h2>
             </div>
             <p className="text-neutral-400 text-sm font-medium max-w-xl">
                Prefer a scheduled 1-on-1 consultation? Pick your preferred date and time slot to discuss your portfolio with our experts.
             </p>
           </div>
           
           <Link
             to="/appointment"
             className="w-full md:w-auto px-8 py-4 bg-[#F6FF00] text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-colors text-center whitespace-nowrap"
           >
             Book Appointment
           </Link>
        </div>

        {/* ── FAQs Section ── */}
        {faqs && faqs.length > 0 && (
          <div className="pt-24 border-t border-white/10">
             <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
                 Got <span className="text-[#F6FF00]">Questions?</span>
               </h2>
               <p className="text-neutral-400 text-sm font-medium">
                 Find quick answers to common queries regarding our services and procedures.
               </p>
             </div>

             <div className="max-w-3xl mx-auto space-y-4">
               {faqs.map((faq, idx) => (
                 <div 
                   key={faq.id || idx} 
                   className={`bg-[#0A0A0A] rounded-xl border transition-all duration-200 overflow-hidden ${openFaq === idx ? 'border-[#F6FF00]/50 shadow-[0_0_20px_rgba(246,255,0,0.05)]' : 'border-white/10 hover:border-white/20'}`}
                 >
                   <button
                     onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                     className="w-full px-6 py-5 flex items-center justify-between text-white font-bold text-sm cursor-pointer text-left focus:outline-none"
                   >
                     <span className="pr-8">{faq.question}</span>
                     <div className={`p-2 rounded-full shrink-0 transition-all duration-300 ${openFaq === idx ? 'bg-[#F6FF00] text-black rotate-180' : 'bg-[#111111] text-white/50'}`}>
                       <FaChevronDown className="text-xs" />
                     </div>
                   </button>
 
                   {openFaq === idx && (
                     <div className="px-6 pb-6 pt-1 text-sm text-neutral-400 font-medium leading-relaxed bg-[#0A0A0A] whitespace-pre-line">
                       {faq.answer}
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Support;
