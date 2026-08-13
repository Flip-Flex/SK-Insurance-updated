import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { 
  FaShieldAlt, 
  FaLock, 
  FaEye, 
  FaFileContract, 
  FaUserCheck, 
  FaChevronRight,
  FaInfoCircle,
  FaDatabase,
  FaCookieBite,
  FaEnvelope,
  FaExternalLinkAlt,
  FaChild,
  FaGavel,
  FaSyncAlt,
  FaPhoneAlt,
  FaShareAlt,
  FaWhatsapp
} from 'react-icons/fa';

export const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: FaInfoCircle,
      title: '1. About Us',
      content: (
        <div className="space-y-3">
          <p><strong>Legal Name:</strong> SK Smart Investments</p>
          <p><strong>Brand Name:</strong> SK Smart Investments</p>
          <p><strong>Registered / Corporate Address:</strong> #104, West Raja Street, Kanchipuram</p>
          <p><strong>Email:</strong> skinvestments2025@gmail.com</p>
          <p><strong>Phone:</strong> +91 99944 51300</p>
          <p><strong>Privacy Contact / Grievance Contact:</strong> Mr. Prakash Gajendiran, Founder & MD, skinvestments2025@gmail.com</p>
          <p>
            SK Smart Investments provides insurance-related advisory, assistance, facilitation, financial planning, and related services as applicable to its business and regulatory authorization.
          </p>
          <p>
            Where a product is issued by an insurance company, the insurance contract is between the customer and the relevant insurer and is governed by the insurer's policy terms and conditions.
          </p>
        </div>
      )
    },
    {
      icon: FaDatabase,
      title: '2. Information We Collect',
      content: (
        <div className="space-y-4">
          <p>Depending on the service you request, we may collect:</p>
          
          <div>
            <h4 className="font-bold text-navy-950 dark:text-white mb-2">Personal Information</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Full name</li>
              <li>Mobile number</li>
              <li>Email address</li>
              <li>Residential or communication address</li>
              <li>Date of birth or age</li>
              <li>Gender, where relevant to the requested service</li>
              <li>Identification information where required</li>
              <li>Employment or occupation information, where relevant</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-navy-950 dark:text-white mb-2">Insurance and Financial Information</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Existing policy details</li>
              <li>Insurance requirements and coverage preferences</li>
              <li>Policy number and premium-related information</li>
              <li>Nominee information</li>
              <li>Claim-related information</li>
              <li>Financial information required for a specific insurance or financial service</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-navy-950 dark:text-white mb-2">Health and Claim Information</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Medical history and existing medical conditions</li>
              <li>Hospitalisation and medical reports</li>
              <li>Prescriptions, bills, and discharge summaries</li>
              <li>Claim documents and other information required by the relevant insurer</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-navy-950 dark:text-white mb-2">Technical Information</h4>
            <p className="mb-2">When you use our website, certain technical information may be collected automatically, such as:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>IP address, Browser type, Device type, and Operating system</li>
              <li>Pages visited and Approximate usage information</li>
              <li>Date and time of website access and Website interaction information</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      icon: FaEye,
      title: '3. How We Use Your Information',
      content: (
        <div className="space-y-3">
          <p>We may use your information to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Respond to enquiries and provide insurance-related assistance</li>
            <li>Understand your insurance requirements and facilitate quotations</li>
            <li>Help you compare or understand available products</li>
            <li>Process service requests and communicate with insurance companies</li>
            <li>Assist with policy issuance, servicing, renewal, or claims where applicable</li>
            <li>Verify information and documents</li>
            <li>Respond to customer support requests and improve our website and services</li>
            <li>Prevent fraud, misuse, or unauthorized activity</li>
            <li>Maintain records required for legal, regulatory, accounting, or operational purposes</li>
            <li>Communicate important service-related information</li>
            <li>Send marketing or promotional communications where permitted and where you have provided the required consent</li>
          </ul>
          <p>We will not use personal information for purposes unrelated to the purpose for which it was collected unless permitted or required by applicable law.</p>
        </div>
      )
    },
    {
      icon: FaShareAlt,
      title: '4. Insurance Company & Service Provider Sharing',
      content: (
        <div className="space-y-3">
          <p>Where necessary to provide a requested insurance or related service, information may be shared with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The relevant insurance company</li>
            <li>Third-party administrators (TPAs)</li>
            <li>Hospitals or healthcare service providers, where applicable</li>
            <li>Surveyors or claim-related service providers</li>
            <li>Payment service providers</li>
            <li>Technology and hosting providers</li>
            <li>Professional advisers</li>
            <li>Regulatory or government authorities where required by law</li>
          </ul>
          <p>The information shared will depend on the service requested. For example, a health insurance application or claim may require relevant personal and medical information to be provided to the applicable insurer or its authorized service providers.</p>
        </div>
      )
    },
    {
      icon: FaFileContract,
      title: '5. Consent',
      content: (
        <div className="space-y-3">
          <p>Where consent is required, we will seek your consent before processing personal information for the relevant purpose.</p>
          <p>You may withdraw consent where permitted by applicable law. Withdrawal of consent may affect our ability to provide certain services where the information is necessary to provide those services.</p>
          <p>The Digital Personal Data Protection framework requires notices to explain, in clear language, the personal data being processed and the purposes for processing.</p>
        </div>
      )
    },
    {
      icon: FaShieldAlt,
      title: '6. Data Security',
      content: (
        <div className="space-y-3">
          <p>We use reasonable technical and organizational safeguards designed to protect personal information against unauthorized access, loss, misuse, alteration, disclosure, or destruction. These measures may include:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access controls and authentication mechanisms</li>
            <li>Secure transmission where applicable</li>
            <li>Role-based access</li>
            <li>Secure storage practices</li>
            <li>Monitoring and security controls</li>
          </ul>
          <p>However, no internet transmission or storage system can be guaranteed to be completely secure.</p>
        </div>
      )
    },
    {
      icon: FaLock,
      title: '7. Data Retention',
      content: (
        <div className="space-y-3">
          <p>We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Providing requested services</li>
            <li>Maintaining business records</li>
            <li>Meeting contractual obligations</li>
            <li>Meeting legal or regulatory requirements</li>
            <li>Resolving disputes</li>
            <li>Preventing fraud or misuse</li>
          </ul>
          <p>When information is no longer required, it may be deleted, anonymized, or securely disposed of in accordance with applicable requirements.</p>
        </div>
      )
    },
    {
      icon: FaCookieBite,
      title: '8. Cookies & Similar Technologies',
      content: (
        <div className="space-y-3">
          <p>Our website may use cookies or similar technologies to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Maintain website functionality</li>
            <li>Remember preferences</li>
            <li>Understand website usage</li>
            <li>Improve performance and measure website activity</li>
          </ul>
          <p>You may control cookies through your browser settings where supported. Disabling certain cookies may affect some website functionality.</p>
        </div>
      )
    },
    {
      icon: FaEnvelope,
      title: '9. Marketing Communications',
      content: (
        <div className="space-y-3">
          <p>Where permitted, we may contact you about relevant products, services, updates, offers, or educational content.</p>
          <p>You may request to stop receiving promotional communications at any time. Service-related communications may continue where necessary to provide a service you have requested.</p>
        </div>
      )
    },
    {
      icon: FaExternalLinkAlt,
      title: '10. Third-Party Websites',
      content: (
        <div className="space-y-3">
          <p>Our website may contain links to insurance companies, payment providers, social media platforms, or other third-party websites.</p>
          <p>We are not responsible for the privacy practices or content of third-party websites. You should review their respective privacy policies before providing information to them.</p>
        </div>
      )
    },
    {
      icon: FaChild,
      title: '11. Children\'s Information',
      content: (
        <div className="space-y-3">
          <p>Our services are intended for adults and persons legally capable of entering into relevant agreements.</p>
          <p>We do not knowingly seek to collect personal information from children except where permitted by applicable law and where necessary for a specific insurance service involving a child.</p>
        </div>
      )
    },
    {
      icon: FaUserCheck,
      title: '12. Your Rights and Choices',
      content: (
        <div className="space-y-3">
          <p>Subject to applicable law, you may have rights relating to your personal information, including the ability to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Request information about processing of your personal data</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion where applicable</li>
            <li>Withdraw consent where applicable</li>
            <li>Raise a complaint regarding processing of your personal information</li>
          </ul>
          <p>We may need to verify your identity before processing certain requests.</p>
        </div>
      )
    },
    {
      icon: FaGavel,
      title: '13. Grievances and Complaints',
      content: (
        <div className="space-y-3">
          <p>If you have a privacy-related concern, please contact us first using the contact information provided below.</p>
          <p>For insurance-related grievances, customers should first use the grievance redressal mechanism of the relevant insurer/intermediary as applicable.</p>
          <p>IRDAI's Bima Bharosa system provides a mechanism for policyholders to register and track grievances and, where appropriate, escalate unresolved complaints.</p>
        </div>
      )
    },
    {
      icon: FaSyncAlt,
      title: '14. Changes to This Policy',
      content: (
        <div className="space-y-3">
          <p>We may update this Privacy Policy from time to time.</p>
          <p>Any updated version will be published on this page with a revised "Last Updated" date.</p>
        </div>
      )
    },
    {
      icon: FaPhoneAlt,
      title: '15. Contact Us',
      content: (
        <div className="space-y-3">
          <p>For questions about this Privacy Policy:</p>
          <p><strong>SK Smart Investments</strong></p>
          <p><strong>Email:</strong> skinvestments2025@gmail.com</p>
          <p><strong>Phone:</strong> +91 99944 51300</p>
          <p><strong>Address:</strong> #104, West Raja Street, Kanchipuram</p>
          <p><strong>Privacy / Grievance Contact:</strong> Mr. Prakash Gajendiran, Founder & MD</p>
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
          Privacy Policy
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm">
          Last Updated: August 2026
        </p>
        <div className="max-w-3xl mx-auto text-left mt-8 p-6 bg-slate-50 dark:bg-navy-900/50 rounded-2xl text-sm text-slate-600 dark:text-slate-300 leading-relaxed shadow-sm">
          <p>
            SK Smart Investments ("SK Smart Investments", "we", "us", or "our") respects your privacy and is committed to protecting the personal information you provide when you use our website, services, forms, calculators, insurance-related assistance, and other digital services.
          </p>
          <p className="mt-3">
            This Privacy Policy explains what information we collect, why we collect it, how we use it, when it may be shared, and the choices available to you.
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
            <h4 className="text-base font-extrabold text-navy-950 dark:text-gold-400">Questions about your data?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              If you have any questions concerning data privacy, user access rights, or wish to manage your profile documents from our systems, please reach out to our legal support desk at:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <a 
                href="mailto:skinvestments2025@gmail.com" 
                className="px-5 py-3 bg-gold-500 hover:bg-gold-600 text-navy-950 font-extrabold text-sm rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer shadow-sm"
              >
                <FaEnvelope className="mr-2" /> Email Support
              </a>
              <a 
                href="https://wa.me/919994451300?text=Hi%20SK%20Smart%20Investments%2C%20I%20have%20a%20query%20about%20my%20data%20privacy." 
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

export default PrivacyPolicy;
