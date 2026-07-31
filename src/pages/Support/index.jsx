import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { 
  FaClock, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, 
  FaWhatsapp, FaInstagram, FaCalendarAlt, FaChevronDown, 
  FaPhoneAlt 
} from 'react-icons/fa';
import { subscribeToCollection } from '../../services/firebaseService';

export const Support = () => {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToCollection('faqs', setFaqs);
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-accent/20 rounded-full blur-[120px] opacity-50 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-brand-accent/5 rounded-full blur-[150px] opacity-40 mix-blend-screen pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 space-y-32">
        
        {/* Title Section */}
        <div className="text-left max-w-4xl">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
            How Can We<br/><span className="text-brand-accent">Help You?</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl font-medium leading-relaxed">
            {t('support_subtitle') || 'Reach out to our experts for personalized assistance, claims support, or to schedule a consultation.'}
          </p>
        </div>

        {/* Bento Box Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Corporate Office (Spans 2 columns) */}
          <div className="lg:col-span-2 bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-brand-accent/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 h-full flex flex-col justify-start">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-brand-accent mb-8 group-hover:scale-110 group-hover:bg-brand-accent group-hover:text-black transition-all duration-500 shadow-xl">
                <FaMapMarkerAlt className="text-2xl" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-3">Corporate Office</h3>
                <p className="text-2xl font-bold text-white leading-tight">
                  # 104, MD Plaza, 1st Floor,<br/>West Raja Street,<br/>Kanchipuram - 631502.
                </p>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
            <div className="relative z-10 h-full flex flex-col justify-start">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white mb-3 group-hover:bg-brand-accent group-hover:text-black transition-all duration-500 shadow-xl">
                <FaClock className="text-sm" />
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Office Hours</h3>
                <p className="text-sm font-bold text-white">Mon - Sat<br/><span className="text-neutral-400 text-xs">Closes 6:30 pm</span></p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-brand-accent/50 transition-all duration-500">
            <div className="absolute inset-0 bg-brand-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            <div className="relative z-10 h-full flex flex-col justify-start">
              <div className="w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-4 group-hover:bg-brand-accent group-hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(246,255,0,0.2)]">
                <FaPhoneAlt className="text-xl" />
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-2">Call Us</h3>
                <p className="text-base font-bold text-white tracking-wide">+91 98407 23956</p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="lg:col-span-2 bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
             <div className="relative z-10 h-full flex flex-col justify-start md:flex-row md:items-end">
               <div>
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white mb-4 group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-xl">
                    <FaEnvelope className="text-xl" />
                  </div>
                  <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Email Address</h3>
                  <p className="text-lg sm:text-xl font-bold text-white">skinvestments2025@gmail.com</p>
               </div>
             </div>
          </div>

          {/* WhatsApp */}
          <a href="https://wa.me/919840723956?text=Hi%20SK%20Smart%20Investments%2C%20I%20have%20a%20query%20about%20your%20services." target="_blank" rel="noopener noreferrer" className="bg-[#25D366]/10 backdrop-blur-xl border border-[#25D366]/20 rounded-3xl p-6 relative overflow-hidden group hover:border-[#25D366]/50 hover:bg-[#25D366]/20 transition-all duration-500 block">
             <div className="relative z-10 h-full flex flex-col justify-start">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] mb-4 group-hover:bg-[#25D366] group-hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(37,211,102,0.2)]">
                  <FaWhatsapp className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-[#25D366] uppercase tracking-widest mb-2">WhatsApp</h3>
                  <p className="text-base font-bold text-white flex items-center justify-between">Chat Now <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">&rarr;</span></p>
                </div>
             </div>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/sk_smartinvestments/" target="_blank" rel="noopener noreferrer" className="bg-[#E1306C]/10 backdrop-blur-xl border border-[#E1306C]/20 rounded-3xl p-6 relative overflow-hidden group hover:border-[#E1306C]/50 hover:bg-[#E1306C]/20 transition-all duration-500 block">
             <div className="relative z-10 h-full flex flex-col justify-start">
                <div className="w-12 h-12 rounded-full bg-[#E1306C]/20 flex items-center justify-center text-[#E1306C] mb-4 group-hover:bg-[#E1306C] group-hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(225,48,108,0.2)]">
                  <FaInstagram className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-[#E1306C] uppercase tracking-widest mb-2">Instagram</h3>
                  <p className="text-base font-bold text-white flex items-center justify-between">@sk_smart... <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">&rarr;</span></p>
                </div>
             </div>
          </a>
        </div>

        {/* Appointment Split */}
        <div className="max-w-4xl mx-auto items-center">
           
           {/* Appointment Side */}
           <div className="bg-brand-accent rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(246,255,0,0.15)] group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col h-full min-h-[400px]">
                 <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center text-brand-accent mb-8 shadow-2xl">
                    <FaCalendarAlt className="text-3xl" />
                 </div>
                 
                 <h2 className="text-4xl sm:text-5xl lg:text-7xl font-[900] text-black uppercase tracking-tighter leading-[0.9] mb-6">
                    Book An<br/>Advisory<br/>Session
                 </h2>
                 <p className="text-black/70 text-xl font-bold mb-12 max-w-lg">
                    Prefer a scheduled 1-on-1 consultation? Pick your date & time slot with our experts.
                 </p>
                 
                 <Link
                   to="/appointment"
                   className="mt-auto group/btn flex items-center gap-4 text-sm font-black uppercase tracking-widest text-black hover:text-neutral-800 transition-colors w-fit"
                 >
                   Book Appointment
                   <span className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center group-hover/btn:bg-black group-hover/btn:text-brand-accent transition-all duration-300">
                     &rarr;
                   </span>
                 </Link>
              </div>
           </div>
        </div>

        {/* FAQs Sticky Layout */}
        {faqs && faqs.length > 0 && (
          <div className="pt-32 border-t border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
             <div className="lg:col-span-4 lg:sticky lg:top-32">
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6">
                 Got<br/><span className="text-brand-accent">Questions?</span>
               </h2>
               <p className="text-neutral-400 text-lg font-medium">
                 Find quick answers to common queries regarding our services, claims validation, and procedures.
               </p>
             </div>

             <div className="lg:col-span-8 space-y-4">
               {faqs.map((faq, idx) => (
                 <div 
                   key={faq.id || idx} 
                   className={`bg-neutral-900/50 backdrop-blur-xl rounded-[2rem] border transition-all duration-300 overflow-hidden ${openFaq === idx ? 'border-brand-accent shadow-[0_0_30px_rgba(246,255,0,0.1)]' : 'border-white/5 hover:border-white/20'}`}
                 >
                   <button
                     onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                     className="w-full px-8 py-7 flex items-center justify-between text-white font-bold text-lg cursor-pointer text-left focus:outline-none"
                   >
                     <span className="pr-8">{faq.question}</span>
                     <div className={`p-4 rounded-full shrink-0 transition-all duration-300 ${openFaq === idx ? 'bg-brand-accent text-black rotate-180' : 'bg-white/5 text-white/50 group-hover:bg-white/10'}`}>
                       <FaChevronDown className="text-sm" />
                     </div>
                   </button>
 
                   {openFaq === idx && (
                     <div className="px-8 pb-8 pt-2 text-base text-neutral-400 font-medium leading-relaxed bg-black/20 whitespace-pre-line border-t border-white/5">
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
