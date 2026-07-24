import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { FaShieldAlt, FaLock, FaEye, FaFileContract, FaUserCheck, FaChevronRight } from 'react-icons/fa';

export const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: FaShieldAlt,
      title: '1. Introduction & Overview',
      content: 'SK Smart Investments ("we", "our", or "us") is dedicated to protecting your privacy and personal data. This Privacy Policy details how we collect, handle, store, and secure information gathered from visitors and registered clients across our insurance Comparison and Investment consultancy services in accordance with Indian financial regulatory standards.'
    },
    {
      icon: FaLock,
      title: '2. Information We Collect',
      content: 'We gather personal data when you interact with our forms, calculations, or registration portal. This includes: identification coordinates (name, email address, phone contact), insurance preferences, financial profiling metadata (such as salary details used for underwriting calculations), and system logging data (IP addresses and authentication status logs).'
    },
    {
      icon: FaEye,
      title: '3. Processing & Usage Purpose',
      content: 'We process information strictly to: supply detailed comparative analytics on life, health, and general insurance products; coordinate inquiries and claim verification queues; execute email confirmation and user authentication sequences; and maintain systemic stability via logging and diagnostic monitoring.'
    },
    {
      icon: FaFileContract,
      title: '4. Third-Party Sharing & Partners',
      content: 'As an authorized distribution partner, we coordinate policy applications directly with leading carriers (such as Tata AIA, ICICI Prudential, and HDFC Life). Your data is shared strictly with these underwriting entities upon your explicit consent when applying for tailored plans.'
    },
    {
      icon: FaUserCheck,
      title: '5. Data Security & Storage Controls',
      content: 'All user data and transaction logs are stored inside Firebase Firestore servers, protected by robust security rules restricting read/write capabilities to the document owners and verified operations managers. We enforce standard TLS/SSL encryption protocols for all client transactions.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-500 bg-gold-500/10 rounded-full">
          Legal & Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-white mt-2">
          Privacy Policy
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
          Learn how SK Smart Investments manages, secures, and handles your financial underwriting information.
        </p>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side-Panel Navigation list */}
        <div className="lg:col-span-1 hidden lg:block space-y-2">
          <div className="sticky top-24 glass-panel p-4 rounded-2xl border border-slate-200/50 dark:border-white/5 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Sections</p>
            {sections.map((sec, idx) => (
              <a 
                href={`#sec-${idx}`} 
                key={idx}
                className="flex items-center justify-between p-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-gold-500 hover:bg-slate-50 dark:hover:bg-navy-900 rounded-xl transition-all group"
              >
                <span>{sec.title.split(' ')[1]}</span>
                <FaChevronRight className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        {/* Right Clauses List */}
        <div className="lg:col-span-3 space-y-6">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div 
                id={`sec-${idx}`}
                key={idx} 
                className="scroll-mt-24 p-6 bg-white dark:bg-navy-900 rounded-3xl border border-slate-200/40 dark:border-white/5 shadow-sm space-y-3 text-left hover:border-gold-500/20 dark:hover:border-gold-400/20 transition-colors duration-300"
              >
                <div className="flex items-center space-x-3 text-gold-500">
                  <div className="p-2.5 bg-slate-50 dark:bg-navy-950 rounded-xl">
                    <Icon className="text-lg" />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-navy-955 dark:text-white">
                    {sec.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium pl-1">
                  {sec.content}
                </p>
              </div>
            );
          })}

          {/* Redressal panel */}
          <div className="p-6 bg-gold-500/5 dark:bg-gold-500/2 border border-gold-500/20 rounded-3xl text-left space-y-4">
            <h4 className="text-sm font-extrabold text-navy-950 dark:text-gold-400">6. Redressal & Support Queries</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              If you have any questions concerning data privacy, user access rights, or wish to delete your profile documents from our systems, please reach out to our legal support desk at:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a 
                href="mailto:skinvestments2025@gmail.com" 
                className="px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-extrabold text-xs rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer shadow-sm"
              >
                ✉ Email Support
              </a>
              <a 
                href="https://wa.me/919840723956?text=Hi%20SK%20Smart%20Investments%2C%20I%20have%20a%20query%20about%20my%20data%20privacy." 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer shadow-sm"
              >
                💬 WhatsApp Compliance
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default PrivacyPolicy;
