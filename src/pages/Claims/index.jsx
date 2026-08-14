import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShieldAlt, FaHeartbeat, FaCar, FaHome, FaPlaneDeparture, FaBriefcase, 
  FaPhoneAlt, FaWhatsapp, FaCheckSquare, FaArrowRight, FaSearch
} from 'react-icons/fa';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/Accordion';

export const Claims = () => {
  const [activeDocTab, setActiveDocTab] = useState('health');
  
  // State for Claim Tracking dummy UI
  const [claimId, setClaimId] = useState('');
  const [trackingState, setTrackingState] = useState('idle'); // idle, loading, result

  const handleTrackClaim = (e) => {
    e.preventDefault();
    if (!claimId) return;
    setTrackingState('loading');
    setTimeout(() => {
      setTrackingState('result');
    }, 1500);
  };

  const resetTracking = () => {
    setClaimId('');
    setTrackingState('idle');
  };

  const docTabs = [
    { id: 'health', label: 'Health Claim' },
    { id: 'life', label: 'Life Claim' },
    { id: 'general', label: 'General Claim' },
  ];

  const docsData = {
    health: ['Policy document', 'Hospital bills', 'Discharge summary', 'Medical reports', 'Identity proof'],
    life: ['Policy document', 'Death certificate', 'Nominee ID proof', 'Bank details', 'Claim form'],
    general: ['Policy document', 'Incident report / FIR', 'Photographs of damage', 'Claim form', 'Identity proof'],
  };

  const faqs = [
    { q: "How do I register a claim?", a: "You can register a claim by contacting our 24x7 support team via phone or WhatsApp. We will immediately initiate the process with the respective insurance company on your behalf." },
    { q: "What documents do I need?", a: "Required documents vary based on the type of insurance. Generally, you need the policy document, valid ID proof, and specific incident reports (like medical bills or FIR). Please check our Required Documents section for specifics." },
    { q: "How long does a claim usually take?", a: "While timelines vary by insurer and claim complexity, standard cashless health claims take 2-4 hours for approval, while reimbursement claims typically take 7-15 working days once all documents are submitted." },
    { q: "Will SK Smart Investments assist me throughout the process?", a: "Absolutely. We provide end-to-end support, from the moment you notify us of the claim until the final settlement amount is credited to your account or hospital." },
    { q: "Can I track my claim?", a: "Yes, you can use our Track Claim tool on this page to see real-time updates. Our dedicated claims executive will also provide you with regular status updates." },
    { q: "What should I do during an emergency?", a: "In an emergency, prioritize safety and medical attention first. Once stable, call our 24x7 Emergency Claims Support number, and we will handle the hospital coordination and cashless approvals." }
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] dark:bg-black text-neutral-800 dark:text-neutral-200 overflow-x-hidden font-sans pt-24 selection:bg-brand-accent selection:text-black transition-colors duration-300">
      
      {/* 1. HERO — We Help You Through the Claim. */}
      <section className="relative px-6 lg:px-12 pt-16 pb-24 lg:pt-24 lg:pb-32 max-w-[1440px] mx-auto border-b border-black/10 dark:border-white/10 overflow-hidden lg:min-h-[70vh] flex items-center">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-brand-accent/10 dark:bg-brand-accent/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-red-500/10 dark:bg-red-500/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F7F5] dark:from-black via-[#F7F7F5]/90 dark:via-black/90 to-transparent" />
        </div>

        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-black text-black dark:text-white leading-[1] tracking-tighter mb-8 uppercase">
              We Help You <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black dark:from-white to-neutral-600 dark:to-neutral-500">
                Through the Claim.
              </span>
            </h1>
            
            <div className="pl-6 border-l-2 border-black/10 dark:border-white/10 max-w-2xl mb-12">
              <p className="text-xl text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                From filing your claim to receiving the settlement, our team guides you through every step.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <button className="px-8 py-4 bg-red-600 border border-red-500 text-white font-bold uppercase tracking-wider text-sm hover:bg-red-500 transition-colors flex items-center gap-3 shadow-[0_0_16px_rgba(220,38,38,0.35)] dark:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_24px_rgba(220,38,38,0.55)] dark:hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] rounded-xl">
                <FaPhoneAlt /> Emergency Support
              </button>
            </div>
          </motion.div>

          {/* Right Side - Image with Special Effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }} 
            animate={{ opacity: 1, scale: 1, rotate: 0 }} 
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 rounded-[40px] overflow-hidden border-4 border-white/50 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] bg-white/10 backdrop-blur-sm p-4"
            >
              <div className="rounded-[28px] overflow-hidden relative group">
                {/* Image Overlay/Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/20 to-transparent mix-blend-overlay z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img 
                  src="/claim.jpg" 
                  alt="Claims Support" 
                  className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
            </motion.div>

            {/* Decorative background elements behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-brand-accent/20 to-red-500/20 rounded-full blur-[60px] -z-10" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-8 -right-8 w-32 h-32 border border-black/10 dark:border-white/10 rounded-full border-dashed -z-10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -top-12 -left-4 w-24 h-24 border-2 border-brand-accent/30 rounded-full -z-10"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. Need to Make a Claim? */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-black/10 dark:border-white/10">
        <h2 className="text-4xl lg:text-5xl font-bold text-black dark:text-white tracking-tight mb-16">NEED TO MAKE A CLAIM?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 p-10 flex flex-col justify-between hover:shadow-lg dark:hover:shadow-none transition-all cursor-pointer group rounded-xl">
            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 transition-colors">
                <FaHeartbeat className="text-xl text-blue-600 dark:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">HEALTH CLAIM</h3>
              <p className="text-neutral-600 dark:text-neutral-400">Hospitalisation, treatment, medical expenses</p>
            </div>
          </div>
          <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 p-10 flex flex-col justify-between hover:shadow-lg dark:hover:shadow-none transition-all cursor-pointer group rounded-xl">
            <div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 transition-colors">
                <FaShieldAlt className="text-xl text-red-600 dark:text-red-400 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">LIFE CLAIM</h3>
              <p className="text-neutral-600 dark:text-neutral-400">Death and critical illness</p>
            </div>
          </div>
          <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-500/20 p-10 flex flex-col justify-between hover:shadow-lg dark:hover:shadow-none transition-all cursor-pointer group rounded-xl">
            <div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 transition-colors">
                <FaBriefcase className="text-xl text-emerald-600 dark:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">GENERAL CLAIM</h3>
              <p className="text-neutral-600 dark:text-neutral-400">Travel, business, property, etc.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 24/7 PRIORITY SUPPORT - High-end replacement for Emergency Support */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-black/10 dark:border-white/10">
        <div className="bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 p-12 lg:p-20 relative overflow-hidden shadow-sm dark:shadow-none">
          {/* Subtle accent blur */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-accent/5 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-16 justify-between items-start lg:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-px bg-brand-accent"></div>
                <span className="text-[#FFB300] dark:text-brand-accent font-bold tracking-[0.2em] uppercase text-xs">Priority Access</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-black dark:text-white tracking-tight mb-6">IMMEDIATE CLAIM ASSISTANCE</h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                Whether you're facing a medical emergency or an urgent accident, our dedicated rapid-response team is on standby to coordinate with hospitals and surveyors immediately.
              </p>
            </div>
            
            <div className="flex flex-col gap-8 min-w-[300px]">
              <div className="border-l-2 border-brand-accent pl-6">
                <p className="text-neutral-500 text-sm font-bold uppercase tracking-wider mb-2">24/7 Dedicated Hotline</p>
                <p className="text-3xl font-light text-black dark:text-white tracking-wider">+91 99944 51300</p>
              </div>
              <div className="border-l-2 border-black/20 dark:border-white/20 pl-6">
                <p className="text-neutral-500 text-sm font-bold uppercase tracking-wider mb-2">Priority Email</p>
                <p className="text-xl font-light text-black dark:text-white tracking-wider">skinvestments2025@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What Happens After You Contact Us? */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-black/10 dark:border-white/10">
        <h2 className="text-4xl lg:text-5xl font-bold text-black dark:text-white tracking-tight mb-16">WHAT HAPPENS AFTER YOU CONTACT US?</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {[
            { step: '01', title: 'TELL US ABOUT THE CLAIM', desc: 'Call, WhatsApp or email us and tell us what happened.' },
            { step: '02', title: 'SHARE YOUR DOCUMENTS', desc: "We'll tell you exactly what documents are needed." },
            { step: '03', title: 'WE CHECK EVERYTHING', desc: 'Our team reviews your documents before submitting them.' },
            { step: '04', title: 'WE FOLLOW UP', desc: 'We coordinate with the insurance company and track your claim.' },
            { step: '05', title: 'CLAIM SETTLEMENT', desc: 'We stay with you until the claim reaches its final stage.' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col">
              <div className="text-3xl font-black text-[#FFB300] dark:text-brand-accent mb-6 font-serif italic border-b border-black/10 dark:border-white/10 pb-4">
                {item.step}
              </div>
              <h4 className="text-xl font-bold text-black dark:text-white mb-3">{item.title}</h4>
              <p className="text-neutral-600 dark:text-neutral-400 text-base">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. What Documents Will I Need? */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-black/10 dark:border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-4xl font-bold text-black dark:text-white tracking-tight mb-8">WHAT DOCUMENTS WILL I NEED?</h2>
            <div className="flex flex-col gap-2">
              {docTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDocTab(tab.id)}
                  className={`flex items-center gap-4 px-6 py-4 text-left font-bold uppercase tracking-wider text-sm transition-colors border-l-4 ${
                    activeDocTab === tab.id 
                      ? 'bg-black/5 dark:bg-white/5 text-black dark:text-white border-brand-accent' 
                      : 'bg-transparent border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-8">
             <div className="bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 p-10 lg:p-16 min-h-full shadow-sm dark:shadow-none">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-8 border-b border-black/10 dark:border-white/10 pb-6">{docTabs.find(t => t.id === activeDocTab)?.label.toUpperCase()} CHECKLIST</h3>
                <ul className="space-y-4 mb-12">
                  {docsData[activeDocTab].map((doc, i) => (
                    <li key={i} className="flex items-center gap-4 text-lg text-black dark:text-white font-medium bg-black/[0.02] dark:bg-black/40 p-4 border border-black/5 dark:border-white/5">
                      <FaCheckSquare className="text-[#FFB300] dark:text-brand-accent text-xl" /> {doc}
                    </li>
                  ))}
                </ul>
                <div className="p-4 bg-brand-accent/[0.08] dark:bg-brand-accent/10 border-l-4 border-brand-accent text-neutral-800 dark:text-brand-accent text-sm">
                  <strong className="text-[#6B7300] dark:text-brand-accent">Important:</strong> Required documents can vary depending on your insurer and the nature of your claim.
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. What Type of Claims Can We Help With? */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-black/10 dark:border-white/10">
        <h2 className="text-4xl lg:text-5xl font-bold text-black dark:text-white tracking-tight mb-16 text-center">WHAT TYPE OF CLAIMS CAN WE HELP WITH?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 dark:bg-white/10">
          {[
            { title: 'HEALTH', desc: 'Medical emergencies and hospitalisation.', bgClass: 'bg-blue-50 dark:bg-blue-900/10' },
            { title: 'LIFE', desc: 'Death and critical illness claims.', bgClass: 'bg-emerald-50 dark:bg-emerald-900/10' },
            { title: 'GENERAL', desc: 'Travel, business, property, and more.', bgClass: 'bg-amber-50 dark:bg-amber-900/10' },
          ].map((item, i) => (
            <div key={i} className={`p-12 transition-colors flex flex-col justify-between ${item.bgClass}`}>
              <div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{item.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Why Have Us Handle Your Claim? & 9. FAQ */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-black/10 dark:border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
           
           <div>
             <h2 className="text-4xl font-bold text-black dark:text-white tracking-tight mb-12">WHY HAVE US HANDLE YOUR CLAIM?</h2>
             <ul className="space-y-10">
               {[
                 { title: 'ONE DEDICATED EXECUTIVE', desc: 'One person follows your case.' },
                 { title: 'END-TO-END ASSISTANCE', desc: 'From documentation to settlement.' },
                 { title: 'CLEAR UPDATES', desc: 'We explain what is happening without confusing insurance jargon.' },
                 { title: 'CLAIM TRACKING', desc: 'We keep you updated on your claim status.' },
                 { title: 'INSURER COORDINATION', desc: 'We communicate with the insurance company on your behalf.' },
               ].map((item, i) => (
                 <li key={i} className="border-l-2 border-brand-accent pl-6">
                   <h4 className="text-xl font-bold text-black dark:text-white mb-2">{item.title}</h4>
                   <p className="text-neutral-600 dark:text-neutral-400">{item.desc}</p>
                 </li>
               ))}
             </ul>
           </div>

           <div>
             <h2 className="text-4xl font-bold text-black dark:text-white tracking-tight mb-12">FAQ</h2>
             <Accordion type="single" collapsible className="space-y-0">
               {faqs.map((faq, index) => (
                 <AccordionItem key={index} value={`faq-${index}`} className="border-b border-black/10 dark:border-white/10">
                   <AccordionTrigger className="text-lg py-6 text-black dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300">{faq.q}</AccordionTrigger>
                   <AccordionContent className="text-base text-neutral-600 dark:text-neutral-400 pb-6 leading-relaxed">
                     {faq.a}
                   </AccordionContent>
                 </AccordionItem>
               ))}
             </Accordion>
           </div>

        </div>
      </section>

      {/* 10. CLIENT EXPERIENCES - Real Support When It Matters */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto border-b border-black/10 dark:border-white/10">
        <h2 className="text-4xl font-bold text-black dark:text-white tracking-tight mb-16">REAL SUPPORT WHEN IT MATTERS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="border-t-4 border-black/20 dark:border-white/20 pt-8">
            <p className="text-xl text-neutral-700 dark:text-neutral-300 leading-relaxed mb-8">
              "Our health insurance claim was handled professionally from start to finish. The team at SK Smart Investments coordinated with the hospital for cashless approval in the middle of the night. The entire process was smooth and stress-free."
            </p>
            <h4 className="text-black dark:text-white font-bold uppercase tracking-wider text-sm">Rajesh Kumar</h4>
            <p className="text-neutral-500 text-sm">Health Claim</p>
          </div>
          <div className="border-t-4 border-black/20 dark:border-white/20 pt-8">
            <p className="text-xl text-neutral-700 dark:text-neutral-300 leading-relaxed mb-8">
              "When my car was involved in an accident, I just had to make one call. They arranged the towing, surveyor inspection, and ensured the cashless repair was completed without me having to visit the garage constantly. Exceptional service."
            </p>
            <h4 className="text-black dark:text-white font-bold uppercase tracking-wider text-sm">Anita Desai</h4>
            <p className="text-neutral-500 text-sm">General Claim</p>
          </div>
        </div>
      </section>

      {/* 11. Final CTA */}
      <section className="py-32 px-6 lg:px-12 bg-black dark:bg-white text-white dark:text-black text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
            Don't Handle Your Claim Alone.
          </h2>
          <p className="text-xl font-medium mb-12 text-neutral-400 dark:text-neutral-600">
            Tell us what happened. Our team will guide you through the next step.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="tel:+919994451300" 
              className="px-10 py-5 bg-white dark:bg-black text-black dark:text-white font-bold uppercase tracking-wider text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors shadow-xl"
            >
              Talk to an Advisor
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Claims;
