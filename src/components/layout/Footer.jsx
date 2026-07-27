import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { useTranslation } from '../../context/LanguageContext';
import { FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaInstagram, FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-white/5 pt-8 pb-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Brand Panel */}
          <div className="space-y-2.5">
            <Link to="/">
              <Logo showTagline={false} />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footer_desc')}
            </p>
            <div className="flex space-x-3 pt-1">
              <a href="https://www.instagram.com/sk_smartinvestments/" target="_blank" rel="noopener noreferrer" className="p-2 bg-navy-900 rounded-lg hover:text-gold-400 transition-colors" title="Instagram"><FaInstagram /></a>
              <a href="https://www.linkedin.com/company/sksmartinvestments/" target="_blank" rel="noopener noreferrer" className="p-2 bg-navy-900 rounded-lg hover:text-gold-400 transition-colors" title="LinkedIn"><FaLinkedin /></a>
              <a href="https://wa.me/919840723956?text=Hi%20SK%20Smart%20Investments%2C%20I%20have%20a%20query%20about%20your%20services." target="_blank" rel="noopener noreferrer" className="p-2 bg-navy-900 rounded-lg hover:text-emerald-500 transition-colors" title="WhatsApp Support"><FaWhatsapp /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2.5 border-l-2 border-gold-400 pl-2">{t('footer_insurance')}</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/plans?category=Health" className="hover:text-gold-400 transition-colors">Health Platinum Cover</Link></li>
              <li><Link to="/plans?category=Life" className="hover:text-gold-400 transition-colors">Term Life Elite</Link></li>
              <li><Link to="/plans?category=Motor" className="hover:text-gold-400 transition-colors">Auto Max Cover</Link></li>
              <li><Link to="/plans?category=Home" className="hover:text-gold-400 transition-colors">Safe Haven Home Policy</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2.5 border-l-2 border-gold-400 pl-2">{t('footer_company')}</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">{t('about')}</Link></li>
              <li><Link to="/appointment" className="hover:text-gold-400 text-gold-400 font-semibold transition-colors flex items-center space-x-1"><span>{t('book_appointment')}</span></Link></li>
              <li><Link to="/support" className="hover:text-gold-400 transition-colors">{t('contact')}</Link></li>
              <li><Link to="/calculator" className="hover:text-gold-400 transition-colors">{t('calc')}</Link></li>
              <li><Link to="/careers" className="hover:text-gold-400 transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2.5 border-l-2 border-gold-400 pl-2">{t('footer_contact')}</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start space-x-2">
                <FaMapMarkerAlt className="text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white text-[11px]">Corporate Office</p>
                  <a 
                    href="https://maps.google.com/?q=MD+Plaza+West+Raja+Street+Kanchipuram" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-slate-400 hover:text-gold-400 hover:underline mt-0.5 block"
                  >
                    # 104, MD Plaza, 1st Floor, West Raja Street, Kanchipuram - 631502.
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <FaEnvelope className="text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white text-[11px]">{t('footer_email')}</p>
                  <a 
                    href="mailto:skinvestments2025@gmail.com" 
                    className="text-slate-400 hover:text-gold-400 hover:underline mt-0.5 block"
                  >
                    skinvestments2025@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <FaPhoneAlt className="text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white text-[11px]">Phone Hotline</p>
                  <a 
                    href="tel:+919840723956" 
                    className="text-slate-400 hover:text-gold-400 hover:underline mt-0.5 block font-sans"
                  >
                    +91 98407 23956
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <FaWhatsapp className="text-emerald-500 shrink-0 mt-0.5 text-sm" />
                <div>
                  <p className="font-semibold text-white text-[11px]">WhatsApp Support</p>
                  <a 
                    href="https://wa.me/919840723956?text=Hi%20SK%20Smart%20Investments%2C%20I%20have%20a%20query%20about%20your%20services." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-400 hover:underline block mt-0.5"
                  >
                    +91 98407 23956
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer bar */}
        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{t('footer_rights')}</p>
          <div className="flex flex-wrap items-center space-x-4">
            <Link to="/privacy" className="hover:text-gold-400 hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
