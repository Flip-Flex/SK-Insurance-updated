import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { useTranslation } from '../context/LanguageContext';
import { FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaInstagram, FaWhatsapp, FaPhoneAlt, FaArrowRight } from 'react-icons/fa';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-slate-950 dark:bg-black text-white pt-20 pb-10 overflow-hidden border-t border-white/10 dark:border-white/5 transition-colors duration-300">


      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Panel */}
          <div className="space-y-6">
            <Link to="/" className="inline-block relative group">
              <div className="absolute inset-0 bg-brand-accent/20 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Logo showTagline={false} />
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed font-medium">
              {t('footer_desc')} Elevating your financial security with premium, tailored insurance solutions.
            </p>
            <div className="flex space-x-4 pt-2">
              {[
                { icon: FaInstagram, url: "https://www.instagram.com/sk_smartinvestments/", color: "hover:text-pink-500 hover:border-pink-500/50 hover:bg-pink-500/10" },
                { icon: FaLinkedin, url: "https://www.linkedin.com/company/sksmartinvestments/", color: "hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/10" },
                { icon: FaWhatsapp, url: "https://wa.me/919994451300?text=Hi", color: "hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/10" }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 transition-all duration-300 ${social.color}`}
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-[900] text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
              {t('footer_insurance')}
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Health Insurance", path: "/plans?category=Health" },
                { name: "Life Insurance", path: "/plans?category=Life" },
                { name: "Motor Insurance", path: "/plans?category=Motor" },
                { name: "Home Insurance", path: "/plans?category=Home" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="group flex items-center gap-2 text-sm text-neutral-400 font-medium hover:text-white transition-colors">
                    <span className="text-brand-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <FaArrowRight className="text-[10px]" />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-[900] text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
              {t('footer_company')}
            </h4>
            <ul className="space-y-4">
              {[
                { name: t('about'), path: "/about" },
                { name: t('book_appointment'), path: "/appointment", highlight: true },
                { name: t('contact'), path: "/support" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className={`group flex items-center gap-2 text-sm font-medium transition-colors ${link.highlight ? 'text-brand-accent hover:text-brand-accent/80 drop-shadow-[0_0_10px_rgba(255,179,0,0.3)]' : 'text-neutral-400 hover:text-white'}`}>
                    <span className={`${link.highlight ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'} text-brand-accent transition-all duration-300`}>
                      <FaArrowRight className="text-[10px]" />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-[900] text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
              {t('footer_contact')}
            </h4>
            <ul className="space-y-6">
              
              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-accent/10 group-hover:border-brand-accent/30 transition-all duration-300 shadow-xl">
                  <FaMapMarkerAlt className="text-neutral-400 group-hover:text-brand-accent transition-colors" />
                </div>
                <div>
                  <p className="font-[900] text-white text-[10px] uppercase tracking-widest mb-1">Corporate Office</p>
                  <a href="https://maps.google.com/?q=MD+Plaza+West+Raja+Street+Kanchipuram" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-400 font-medium leading-relaxed group-hover:text-white transition-colors block">
                    # 104, MD Plaza, 1st Floor, West Raja Street, Kanchipuram - 631502.
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-accent/10 group-hover:border-brand-accent/30 transition-all duration-300 shadow-xl">
                  <FaEnvelope className="text-neutral-400 group-hover:text-brand-accent transition-colors" />
                </div>
                <div>
                  <p className="font-[900] text-white text-[10px] uppercase tracking-widest mb-1">{t('footer_email')}</p>
                  <a href="mailto:skinvestments2025@gmail.com" className="text-sm text-neutral-400 font-medium group-hover:text-white transition-colors block">
                    skinvestments2025@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-accent/10 group-hover:border-brand-accent/30 transition-all duration-300 shadow-xl">
                  <FaPhoneAlt className="text-neutral-400 group-hover:text-brand-accent transition-colors" />
                </div>
                <div>
                  <p className="font-[900] text-white text-[10px] uppercase tracking-widest mb-1">Phone Hotline</p>
                  <a href="tel:+919994451300" className="text-sm text-neutral-400 font-medium group-hover:text-white transition-colors block font-sans">
                    +91 99944 51300
                  </a>
                </div>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-neutral-500 font-medium tracking-wide">
            {t('footer_rights')}
          </p>
          <div className="flex items-center gap-6 text-[10px] sm:text-[11px] text-neutral-500 font-bold uppercase tracking-widest md:pr-16 lg:pr-20">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
