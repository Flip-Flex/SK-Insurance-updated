import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { 
  FaInfoCircle,
  FaDesktop,
  FaShieldAlt,
  FaFileContract,
  FaCalculator,
  FaHandsHelping,
  FaUserCheck,
  FaCreditCard,
  FaExternalLinkAlt,
  FaCopyright,
  FaServer,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSyncAlt,
  FaBan,
  FaGavel,
  FaRegFrown,
  FaPhoneAlt,
  FaChevronRight,
  FaEnvelope,
  FaWhatsapp
} from 'react-icons/fa';

export const TermsOfService = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: FaInfoCircle,
      title: '1. About SK Smart Investments',
      content: (
        <div className="space-y-3">
          <p><strong>Legal Name:</strong> SK Smart Investments</p>
          <p><strong>Brand Name:</strong> SK Smart Investments</p>
          <p><strong>Registered / Corporate Address:</strong> #104, West Raja Street, Kanchipuram</p>
          <p><strong>Email:</strong> skinvestments2025@gmail.com</p>
          <p>
            SK Smart Investments provides insurance-related information, advisory, assistance, facilitation, financial planning, and related services as applicable to its business and regulatory authorization.
          </p>
        </div>
      )
    },
    {
      icon: FaDesktop,
      title: '2. Website Information',
      content: (
        <div className="space-y-3">
          <p>The information provided on this website is intended for general informational purposes.</p>
          <p>Website content may include:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Insurance information</li>
            <li>Product descriptions</li>
            <li>Coverage information</li>
            <li>Premium illustrations</li>
            <li>Financial education</li>
            <li>Calculators</li>
            <li>Claims guidance</li>
            <li>General financial information</li>
          </ul>
          <p>Website information should not be treated as a substitute for the official policy wording, proposal form, benefit illustration, schedule, or other documents issued by the relevant insurer.</p>
        </div>
      )
    },
    {
      icon: FaShieldAlt,
      title: '3. Insurance Products',
      content: (
        <div className="space-y-3">
          <p>Insurance products displayed on this website may be offered by third-party insurance companies.</p>
          <p>The relevant insurer determines the applicable:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Policy terms</li>
            <li>Coverage</li>
            <li>Premium</li>
            <li>Eligibility</li>
            <li>Underwriting</li>
            <li>Exclusions</li>
            <li>Waiting periods</li>
            <li>Deductibles</li>
            <li>Claim decisions</li>
            <li>Policy issuance</li>
          </ul>
          <p>Availability and pricing may change.</p>
          <p>A quotation or illustration displayed on the website does not by itself constitute acceptance of risk or confirmation that a policy has been issued.</p>
          <p>The final insurance contract is governed by the policy documents issued by the relevant insurer.</p>
        </div>
      )
    },
    {
      icon: FaFileContract,
      title: '4. Insurance Plan Information',
      content: (
        <div className="space-y-3">
          <p>We make reasonable efforts to present insurance information accurately.</p>
          <p>However, information displayed on the website may change and may depend on:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Insurer guidelines</li>
            <li>Applicant information</li>
            <li>Medical underwriting</li>
            <li>Location</li>
            <li>Policy options</li>
            <li>Product availability</li>
            <li>Regulatory requirements</li>
          </ul>
          <p>Users should verify the final terms directly from the relevant insurer's official policy documents before purchasing a policy.</p>
        </div>
      )
    },
    {
      icon: FaCalculator,
      title: '5. Premium Calculators and Estimates',
      content: (
        <div className="space-y-3">
          <p>Any premium calculator, coverage calculator, investment illustration, or similar tool on the website provides an estimate based on the assumptions and information entered by the user.</p>
          <p>The result is not a guaranteed quotation or promise of policy issuance.</p>
          <p>Actual premiums, benefits, eligibility, returns, and other terms may differ.</p>
        </div>
      )
    },
    {
      icon: FaHandsHelping,
      title: '6. Claims Assistance',
      content: (
        <div className="space-y-3">
          <p>Where SK Smart Investments provides claims assistance, our role may include:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Guiding customers regarding documentation</li>
            <li>Assisting with claim registration</li>
            <li>Coordinating communications</li>
            <li>Helping track claim status</li>
            <li>Providing general procedural guidance</li>
          </ul>
          <p>The insurer remains responsible for assessing and deciding the claim according to the applicable policy terms and underwriting/claims procedures.</p>
          <p>SK Smart Investments does not guarantee claim approval, claim amount, or settlement time.</p>
        </div>
      )
    },
    {
      icon: FaUserCheck,
      title: '7. User Responsibilities',
      content: (
        <div className="space-y-3">
          <p>You agree to provide accurate and complete information when using our services.</p>
          <p>You must not:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide false information</li>
            <li>Upload fraudulent documents</li>
            <li>Misrepresent medical or financial information</li>
            <li>Attempt unauthorized access</li>
            <li>Interfere with website security</li>
            <li>Use the website for unlawful purposes</li>
            <li>Copy or reproduce protected website content without authorization</li>
          </ul>
          <p>Providing incorrect information may affect insurance eligibility, policy issuance, or claims.</p>
        </div>
      )
    },
    {
      icon: FaCreditCard,
      title: '8. Payments',
      content: (
        <div className="space-y-3">
          <p>Where payment functionality is available, payments may be processed through the relevant authorized payment provider or insurer.</p>
          <p>Users should verify the payment recipient and transaction details before making a payment.</p>
          <p>We do not guarantee the availability of any third-party payment service.</p>
        </div>
      )
    },
    {
      icon: FaExternalLinkAlt,
      title: '9. Third-Party Services',
      content: (
        <div className="space-y-3">
          <p>The website may link to or integrate with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Insurance companies</li>
            <li>Payment providers</li>
            <li>Healthcare providers</li>
            <li>Government or regulatory websites</li>
            <li>Social media platforms</li>
            <li>Other third-party services</li>
          </ul>
          <p>Those services operate under their own terms and privacy policies.</p>
        </div>
      )
    },
    {
      icon: FaCopyright,
      title: '10. Intellectual Property',
      content: (
        <div className="space-y-3">
          <p>Unless otherwise stated, website content including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Logos</li>
            <li>Branding</li>
            <li>Text</li>
            <li>Graphics</li>
            <li>Images</li>
            <li>Website design</li>
            <li>Software</li>
            <li>Original content</li>
          </ul>
          <p>belongs to SK Smart Investments or its respective licensors.</p>
          <p>You may not reproduce, modify, distribute, or commercially exploit such content without appropriate authorization.</p>
          <p>Third-party trademarks and logos remain the property of their respective owners.</p>
        </div>
      )
    },
    {
      icon: FaServer,
      title: '11. Website Availability',
      content: (
        <div className="space-y-3">
          <p>We aim to keep the website available and functional, but we do not guarantee uninterrupted access.</p>
          <p>The website may occasionally be unavailable because of:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Maintenance</li>
            <li>Technical failures</li>
            <li>Security incidents</li>
            <li>Network problems</li>
            <li>Third-party service interruptions</li>
            <li>Circumstances beyond our reasonable control</li>
          </ul>
        </div>
      )
    },
    {
      icon: FaExclamationTriangle,
      title: '12. Limitation of Liability',
      content: (
        <div className="space-y-3">
          <p>To the extent permitted by applicable law, SK Smart Investments will not be responsible for losses arising solely from:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Reliance on general website information</li>
            <li>Third-party website failures</li>
            <li>Incorrect information submitted by users</li>
            <li>Insurer decisions</li>
            <li>Policy exclusions or conditions</li>
            <li>Changes in product availability</li>
            <li>Delays caused by third parties</li>
          </ul>
          <p>Nothing in these Terms is intended to exclude or limit liability that cannot legally be excluded or limited.</p>
        </div>
      )
    },
    {
      icon: FaTimesCircle,
      title: '13. No Guarantee of Insurance Outcomes',
      content: (
        <div className="space-y-3">
          <p>Nothing on this website guarantees:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Policy approval</li>
            <li>Insurance coverage</li>
            <li>Claim approval</li>
            <li>Claim settlement</li>
            <li>Investment returns</li>
            <li>Specific financial outcomes</li>
          </ul>
          <p>All such outcomes depend on the relevant contract, insurer, product terms, applicable law, and individual circumstances.</p>
        </div>
      )
    },
    {
      icon: FaSyncAlt,
      title: '14. Changes to the Website',
      content: (
        <div className="space-y-3">
          <p>We may modify, update, suspend, or discontinue parts of the website or its features from time to time.</p>
          <p>We may also update website information when products, services, regulations, or business practices change.</p>
        </div>
      )
    },
    {
      icon: FaBan,
      title: '15. Suspension or Termination',
      content: (
        <div className="space-y-3">
          <p>We may restrict or suspend access to the website where reasonably necessary to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Protect the website</li>
            <li>Prevent fraud or misuse</li>
            <li>Comply with law</li>
            <li>Protect users</li>
            <li>Protect our systems</li>
          </ul>
        </div>
      )
    },
    {
      icon: FaGavel,
      title: '16. Governing Law',
      content: (
        <div className="space-y-3">
          <p>These Terms shall be governed by the laws applicable in India.</p>
          <p>Subject to applicable law, disputes shall be subject to the jurisdiction of the courts at Kanchipuram, Tamil Nadu.</p>
        </div>
      )
    },
    {
      icon: FaRegFrown,
      title: '17. Grievances',
      content: (
        <div className="space-y-3">
          <p>For questions or complaints regarding our website or services:</p>
          <p><strong>Email:</strong> skinvestments2025@gmail.com</p>
          <p><strong>Phone:</strong> +91 99944 51300</p>
          <p><strong>Address:</strong> #104, West Raja Street, Kanchipuram</p>
          <p>For insurance grievances, customers may also use the applicable insurer grievance mechanism and, where appropriate, IRDAI's Bima Bharosa grievance system. IRDAI states that policyholders should generally approach the insurer's grievance officer first and may escalate unresolved grievances through Bima Bharosa.</p>
        </div>
      )
    },
    {
      icon: FaPhoneAlt,
      title: '18. Contact',
      content: (
        <div className="space-y-3">
          <p><strong>SK Smart Investments</strong></p>
          <p><strong>Legal Entity:</strong> SK Smart Investments</p>
          <p><strong>Address:</strong> #104, West Raja Street, Kanchipuram</p>
          <p><strong>Email:</strong> skinvestments2025@gmail.com</p>
          <p><strong>Phone:</strong> +91 99944 51300</p>
          <p><strong>Website:</strong> sk-insurance-01.web.app</p>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-500 bg-gold-500/10 rounded-full">
          Legal & Compliance
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-950 dark:text-white mt-4">
          Terms of Service
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm">
          Last Updated: August 2026
        </p>
        <div className="max-w-3xl mx-auto text-left mt-8 p-6 bg-slate-50 dark:bg-navy-900/50 rounded-2xl text-sm text-slate-600 dark:text-slate-300 leading-relaxed shadow-sm">
          <p>
            These Terms of Service ("Terms") govern your access to and use of the SK Smart Investments website and related digital services.
          </p>
          <p className="mt-3">
            By accessing or using this website, you agree to these Terms. If you do not agree with them, please do not use the website.
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side-Panel Navigation list */}
        <div className="lg:col-span-3 hidden lg:block space-y-2">
          <div className="sticky top-24 glass-panel p-5 rounded-2xl border border-slate-200/50 dark:border-white/5 space-y-1 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Index</p>
            {sections.map((sec, idx) => (
              <a 
                href={`#sec-${idx}`} 
                key={idx}
                className="flex items-center justify-between p-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-gold-500 hover:bg-slate-50 dark:hover:bg-navy-900 rounded-xl transition-all group"
              >
                <span className="truncate pr-2">{sec.title.replace(/^\d+\.\s*/, '')}</span>
                <FaChevronRight className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Right Clauses List */}
        <div className="lg:col-span-9 space-y-6">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div 
                id={`sec-${idx}`}
                key={idx} 
                className="scroll-mt-24 p-6 sm:p-8 bg-white dark:bg-navy-900 rounded-3xl border border-slate-200/40 dark:border-white/5 shadow-sm space-y-5 text-left hover:border-gold-500/30 dark:hover:border-gold-400/30 transition-colors duration-300"
              >
                <div className="flex items-center space-x-4 text-gold-500 border-b border-slate-100 dark:border-white/5 pb-4">
                  <div className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl">
                    <Icon className="text-xl" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-navy-955 dark:text-white">
                    {sec.title}
                  </h3>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium pl-1">
                  {sec.content}
                </div>
              </div>
            );
          })}

          {/* Redressal panel */}
          <div className="p-8 bg-gold-500/5 dark:bg-gold-500/2 border border-gold-500/20 rounded-3xl text-left space-y-4 mt-12">
            <h4 className="text-base font-extrabold text-navy-950 dark:text-gold-400">Questions about our terms?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              If you have any questions concerning our terms of service, policies, or need legal assistance with your account, please reach out to our legal support desk at:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <a 
                href="mailto:skinvestments2025@gmail.com" 
                className="px-5 py-3 bg-gold-500 hover:bg-gold-600 text-navy-950 font-extrabold text-sm rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer shadow-sm"
              >
                <FaEnvelope className="mr-2" /> Email Support
              </a>
              <a 
                href="https://wa.me/919994451300?text=Hi%20SK%20Smart%20Investments%2C%20I%20have%20a%20query%20about%20your%20Terms%20of%20Service." 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer shadow-sm"
              >
                <FaWhatsapp className="mr-2" /> WhatsApp Compliance
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TermsOfService;
