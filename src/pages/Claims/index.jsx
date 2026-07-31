import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShieldAlt, FaHeartbeat, FaCar, FaHome, FaPlaneDeparture, FaBriefcase, 
  FaPhoneAlt, FaWhatsapp, FaChevronDown, FaChevronUp, FaFileAlt, FaCheckCircle
} from 'react-icons/fa';
import ScrollStack, { ScrollStackItem } from '../../components/ScrollStack/ScrollStack';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/Accordion';

export const Claims = () => {
  const [activeDocTab, setActiveDocTab] = useState('health');

  const docTabs = [
    { id: 'health', label: 'Health Insurance', icon: FaHeartbeat },
    { id: 'life', label: 'Life Insurance', icon: FaShieldAlt },
    { id: 'motor', label: 'Motor Insurance', icon: FaCar },
    { id: 'home', label: 'Home Insurance', icon: FaHome },
  ];

  const docsData = {
    health: ['Policy Document', 'Hospital Bills', 'Discharge Summary', 'Medical Reports', 'Identity Proof'],
    life: ['Policy Document', 'Death Certificate', 'Nominee ID Proof', 'Bank Details', 'Claim Form'],
    motor: ['RC Book', 'Driving Licence', 'FIR if applicable', 'Vehicle Photos', 'Claim Form'],
    home: ['Policy Document', 'Property Damage Photos', 'Estimate Report', 'Identity Proof'],
  };

  const faqs = [
    { q: "How do I register a claim?", a: "You can register a claim by contacting our 24x7 support team via phone or WhatsApp. We will immediately initiate the process with the respective insurance company on your behalf." },
    { q: "What documents are required?", a: "Required documents vary based on the type of insurance. Generally, you need the policy document, valid ID proof, and specific incident reports (like medical bills or FIR). Please check our Required Documents section for specifics." },
    { q: "How long does claim settlement take?", a: "While timelines vary by insurer and claim complexity, standard cashless health claims take 2-4 hours for approval, while reimbursement claims typically take 7-15 working days once all documents are submitted." },
    { q: "Will SK Smart Investments help me during the entire process?", a: "Absolutely. We provide end-to-end support, from the moment you notify us of the claim until the final settlement amount is credited to your account or hospital." },
    { q: "Can I track my claim status?", a: "Yes, our dedicated claims executive will provide you with regular status updates. You can also reach out to your assigned advisor anytime for a real-time update." },
    { q: "What should I do during an emergency?", a: "In an emergency, prioritize safety and medical attention first. Once stable, call our 24x7 Emergency Claims Support number, and we will handle the hospital coordination and cashless approvals." }
  ];

  return (
    <div className="min-h-screen bg-black text-neutral-200 overflow-x-hidden font-sans selection:bg-brand-accent selection:text-black pt-20">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-8 py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900/50 to-black z-10" />
          <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-brand-accent/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay z-20" />
        </div>

        <div className="relative z-30 max-w-5xl mx-auto text-center">

          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-[900] text-white tracking-tight uppercase leading-[1.1] mb-8">
            <motion.span initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="block">Hassle-Free</motion.span>
            <motion.span initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-white pb-2">Claims Assistance</motion.span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl sm:text-2xl text-neutral-400 font-light max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            We stand by you when it matters most. From claim registration to successful settlement, our dedicated experts guide you through every step with transparency, care, and professional support.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-brand-accent text-black rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(246,255,0,0.3)] cursor-pointer">
              Start a Claim
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors duration-300 backdrop-blur-md cursor-pointer flex items-center justify-center gap-2">
              <FaPhoneAlt className="text-sm" /> Talk to a Claims Expert
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. About Claims Assistance */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl sm:text-5xl font-[900] text-white uppercase tracking-tight mb-8">
              Claim Support <br />
              <span className="text-brand-accent">You Can Trust</span>
            </h2>
            <div className="space-y-6 text-lg text-neutral-300 leading-relaxed font-light">
              <p>
                At SK Smart Investments, our commitment extends far beyond helping you purchase an insurance policy. We believe true service begins when you need us the most. Our experienced claims support team provides end-to-end assistance throughout the claims process, ensuring every step is handled with professionalism, transparency, and care.
              </p>
              <p>
                From registering your claim and verifying documentation to coordinating with the insurance company and tracking your claim status, we remain by your side until the process is completed. Whether it's a health emergency, vehicle accident, life insurance claim, or property damage, we are committed to making the claims experience as smooth and stress-free as possible.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
            className="lg:w-1/2 relative w-full"
          >
            <div className="aspect-square w-full max-w-md mx-auto relative rounded-[40px] bg-neutral-900/50 border border-white/10 overflow-hidden backdrop-blur-xl shadow-2xl p-8 flex flex-col justify-center items-center text-center">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(246,255,0,0.1)_0%,rgba(0,0,0,0)_70%)]" />
               <div className="w-24 h-24 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(246,255,0,0.2)]">
                 <FaShieldAlt className="text-5xl text-brand-accent drop-shadow-[0_0_10px_rgba(246,255,0,0.5)]" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-4 relative z-10">100% Commitment</h3>
               <p className="text-neutral-400 relative z-10">We take ownership of your claim so you can focus on what matters most.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Claims Process */}
      <section className="py-32 px-4 sm:px-8 bg-neutral-950 relative border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-6xl font-[900] text-white uppercase tracking-tight">How It Works</h2>
            <p className="text-neutral-400 mt-6 max-w-2xl mx-auto text-lg">A streamlined, stress-free process designed to get your claim settled quickly.</p>
          </div>

          <div className="relative">
            {/* Horizontal Line - Desktop */}
            <motion.div 
              className="hidden lg:block absolute top-12 left-0 w-full h-1 bg-white/10 origin-left"
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.5 }}
            />
            
            {/* Vertical Line - Mobile */}
            <motion.div 
              className="lg:hidden absolute top-0 left-6 w-1 h-full bg-white/10 origin-top"
              initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.5 }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-6 relative z-10">
              {[
                { step: '01', title: 'Report Claim', desc: 'Notify us immediately through phone, WhatsApp, or email.' },
                { step: '02', title: 'Submit Docs', desc: 'Our advisors guide you in preparing the necessary documents.' },
                { step: '03', title: 'Verification', desc: 'We review all documents for accuracy before submission.' },
                { step: '04', title: 'Processing', desc: 'We coordinate with the insurer and track the status.' },
                { step: '05', title: 'Settlement', desc: 'We assist you until your claim is successfully settled.' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="flex flex-row lg:flex-col gap-6 lg:gap-0 lg:text-center group"
                >
                  <div className="relative flex flex-col items-center">
                    <div className="w-12 h-12 lg:w-24 lg:h-24 rounded-full bg-black border-4 border-brand-accent shadow-[0_0_20px_rgba(246,255,0,0.3)] flex items-center justify-center flex-shrink-0 lg:mb-8 z-10 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-lg lg:text-3xl font-[900] text-white">{item.step}</span>
                    </div>
                  </div>
                  <div className="pt-2 lg:pt-0">
                    <h4 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">{item.title}</h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Insurance Claims We Assist With */}
      <section className="py-32 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-6xl font-[900] text-white uppercase tracking-tight">Claims We Handle</h2>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
          <ScrollStack useWindowScroll={true} itemStackDistance={0} stackPosition="20%" baseScale={1}>
            {[
              { title: 'Health Insurance', icon: FaHeartbeat, color: 'text-red-400', bg: 'group-hover:bg-red-400/10' },
              { title: 'Life Insurance', icon: FaShieldAlt, color: 'text-blue-400', bg: 'group-hover:bg-blue-400/10' },
              { title: 'Motor Insurance', icon: FaCar, color: 'text-amber-400', bg: 'group-hover:bg-amber-400/10' },
              { title: 'Home Insurance', icon: FaHome, color: 'text-emerald-400', bg: 'group-hover:bg-emerald-400/10' },
              { title: 'Travel Insurance', icon: FaPlaneDeparture, color: 'text-cyan-400', bg: 'group-hover:bg-cyan-400/10' },
              { title: 'Business Insurance', icon: FaBriefcase, color: 'text-purple-400', bg: 'group-hover:bg-purple-400/10' },
            ].map((item, i) => (
              <ScrollStackItem 
                key={i}
                itemClassName="!h-auto !p-0 !my-4 !bg-transparent !shadow-none border-0"
              >
                <div className={`bg-neutral-900 border border-white/5 rounded-3xl p-8 transition-all duration-300 group shadow-[0_-10px_30px_rgba(0,0,0,0.5)]`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 transition-colors duration-300 ${item.bg}`}>
                      <item.icon className={`text-3xl ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title} Claims</h3>
                      <p className="text-neutral-400">Comprehensive support for document filing and fast-track processing.</p>
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </section>

      {/* 5. Required Documents */}
      <section className="py-24 px-4 sm:px-8 bg-neutral-950/50 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-[900] text-white uppercase tracking-tight mb-6">Required Documents</h2>
            <p className="text-neutral-400 text-lg">Select an insurance category to view the standard document checklist.</p>
          </div>

          {/* Custom Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {docTabs.map((tab) => {
              const isActive = activeDocTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDocTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all duration-300 cursor-pointer ${
                    isActive ? 'bg-brand-accent text-black shadow-[0_0_20px_rgba(246,255,0,0.3)]' : 'bg-neutral-900 border border-white/10 text-white hover:bg-neutral-800'
                  }`}
                >
                  <tab.icon className={isActive ? 'text-black' : 'text-neutral-400'} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Checklist */}
          <motion.div 
            key={activeDocTab}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-4 border-b border-white/10 pb-6">
              <FaFileAlt className="text-brand-accent" /> Document Checklist
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {docsData[activeDocTab].map((doc, i) => (
                <li key={i} className="flex items-start gap-4">
                  <FaCheckCircle className="text-brand-accent mt-1 flex-shrink-0" />
                  <span className="text-lg text-neutral-300">{doc}</span>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm text-neutral-500 italic">* Note: The exact documents may vary based on the insurance provider and the specific nature of the claim.</p>
          </motion.div>
        </div>
      </section>

      {/* 6. Why Choose Our Claims Support */}
      <section className="py-32 px-4 sm:px-8 max-w-7xl mx-auto">
         <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-6xl font-[900] text-white uppercase tracking-tight">Why Choose Us</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Dedicated Executive', desc: 'A single point of contact assigned specifically to handle your case.' },
            { title: 'End-to-End Support', desc: 'Complete assistance from documentation to final settlement.' },
            { title: 'Transparent Updates', desc: 'Clear communication without technical jargon.' },
            { title: 'Status Tracking', desc: 'Regular, proactive updates on your claim status.' },
            { title: 'Expert Coordination', desc: 'We negotiate and coordinate directly with the insurance company.' },
            { title: 'Personalized Care', desc: 'We treat every claim with empathy and urgency.' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-neutral-900/30 border border-white/5 rounded-2xl p-8 hover:bg-neutral-900/60 hover:border-brand-accent/30 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 text-6xl font-black text-white/[0.02] group-hover:text-brand-accent/[0.05] transition-colors pointer-events-none">
                0{i+1}
              </div>
              <h4 className="text-xl font-bold text-white mb-4 relative z-10">{item.title}</h4>
              <p className="text-neutral-400 relative z-10">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. Emergency Claims Support */}
      <section className="py-32 px-4 sm:px-8 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-brand-accent/[0.02]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-4xl sm:text-6xl font-[900] text-white uppercase tracking-tighter leading-none mb-4">
                Emergency<br /><span className="text-brand-accent">Support</span>
              </h2>
              <p className="text-neutral-400 text-lg font-medium max-w-sm">
                We're here for you when it matters most. Fast-track assistance for urgent claims.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Available 24/7
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Health Emergency */}
            <div className="relative overflow-hidden bg-neutral-900/50 rounded-[2.5rem] p-10 group border border-white/5 hover:border-red-500/50 transition-colors duration-500">
              <div className="absolute -inset-20 bg-gradient-to-br from-red-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full min-h-[320px]">
                 <div className="flex justify-between items-start mb-12">
                    <div className="w-20 h-20 rounded-full border border-red-500/30 flex items-center justify-center bg-red-500/10 group-hover:bg-red-500 group-hover:text-black transition-all duration-500 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                       <FaHeartbeat className="text-4xl" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">24x7 Assistance</span>
                 </div>
                 <h3 className="text-3xl font-[900] text-white uppercase tracking-tight mb-4">Health<br/>Emergency</h3>
                 <button className="mt-auto group/btn flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-white hover:text-red-400 transition-colors w-fit">
                   Call Now
                   <span className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:bg-red-500 group-hover/btn:border-red-500 group-hover/btn:text-black transition-all duration-300">
                     <FaPhoneAlt />
                   </span>
                 </button>
              </div>
            </div>

            {/* Motor Accident */}
            <div className="relative overflow-hidden bg-neutral-900/50 rounded-[2.5rem] p-10 group border border-white/5 hover:border-amber-500/50 transition-colors duration-500 lg:translate-y-8">
              <div className="absolute -inset-20 bg-gradient-to-br from-amber-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full min-h-[320px]">
                 <div className="flex justify-between items-start mb-12">
                    <div className="w-20 h-20 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-black transition-all duration-500 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                       <FaCar className="text-4xl" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">Immediate Support</span>
                 </div>
                 <h3 className="text-3xl font-[900] text-white uppercase tracking-tight mb-4">Motor<br/>Accident</h3>
                 <button className="mt-auto group/btn flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-white hover:text-amber-400 transition-colors w-fit">
                   Call Now
                   <span className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:bg-amber-500 group-hover/btn:border-amber-500 group-hover/btn:text-black transition-all duration-300">
                     <FaPhoneAlt />
                   </span>
                 </button>
              </div>
            </div>

            {/* WhatsApp Support */}
            <div className="relative overflow-hidden bg-neutral-900/50 rounded-[2.5rem] p-10 group border border-white/5 hover:border-green-500/50 transition-colors duration-500 lg:translate-y-16">
              <div className="absolute -inset-20 bg-gradient-to-br from-green-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full min-h-[320px]">
                 <div className="flex justify-between items-start mb-12">
                    <div className="w-20 h-20 rounded-full border border-green-500/30 flex items-center justify-center bg-green-500/10 group-hover:bg-green-500 group-hover:text-black transition-all duration-500 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                       <FaWhatsapp className="text-4xl" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">Quick Assistance</span>
                 </div>
                 <h3 className="text-3xl font-[900] text-white uppercase tracking-tight mb-4">WhatsApp<br/>Support</h3>
                 <button className="mt-auto group/btn flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-white hover:text-green-400 transition-colors w-fit">
                   Chat Now
                   <span className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:bg-green-500 group-hover/btn:border-green-500 group-hover/btn:text-black transition-all duration-300">
                     <FaWhatsapp className="text-xl" />
                   </span>
                 </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section className="py-32 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-[900] text-white uppercase tracking-tight">Claims FAQ</h2>
        </div>
        
        <Accordion type="single" collapsible className="space-y-0 border-t border-white/10">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-lg">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* 9. Customer Testimonials */}
      <section className="py-24 px-4 sm:px-8 border-y border-white/5 bg-neutral-950 overflow-hidden">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-6xl font-[900] text-white uppercase tracking-tight">Client Trust</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="bg-neutral-900/50 backdrop-blur-md p-10 rounded-3xl border border-white/10 relative"
            >
              <div className="text-5xl text-brand-accent/20 absolute top-6 left-6 font-serif">"</div>
              <div className="flex gap-1 text-brand-accent mb-6 relative z-10 text-xl">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-xl text-neutral-300 leading-relaxed font-light italic mb-8 relative z-10">
                "Our health insurance claim was handled professionally from start to finish. The team at SK Smart Investments coordinated with the hospital for cashless approval in the middle of the night. The entire process was smooth and stress-free."
              </p>
              <div>
                <h4 className="text-white font-bold text-lg">Rajesh Kumar</h4>
                <p className="text-neutral-500 text-sm uppercase tracking-wider">Health Claim</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-neutral-900/50 backdrop-blur-md p-10 rounded-3xl border border-white/10 relative"
            >
              <div className="text-5xl text-brand-accent/20 absolute top-6 left-6 font-serif">"</div>
              <div className="flex gap-1 text-brand-accent mb-6 relative z-10 text-xl">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-xl text-neutral-300 leading-relaxed font-light italic mb-8 relative z-10">
                "When my car was involved in an accident, I just had to make one call. They arranged the towing, surveyor inspection, and ensured the cashless repair was completed without me having to visit the garage constantly. Exceptional service."
              </p>
              <div>
                <h4 className="text-white font-bold text-lg">Anita Desai</h4>
                <p className="text-neutral-500 text-sm uppercase tracking-wider">Motor Claim</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 10. Insurance Partners (Marquee) */}
      <section className="py-16 border-b border-white/5 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>
        
        {/* We use inline Framer Motion for marquee to avoid adding to index.css */}
        <motion.div 
          animate={{ x: [0, -1035] }} // Approximate width of one set
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-16 whitespace-nowrap opacity-40 hover:opacity-80 transition-opacity w-max"
        >
          {[
            'LIC', 'Tata AIA', 'SBI Life', 'HDFC Life', 'ICICI Prudential', 
            'Star Health', 'Care Health', 'Bajaj Allianz', 'Niva Bupa',
            // Duplicate for infinite scroll effect
            'LIC', 'Tata AIA', 'SBI Life', 'HDFC Life', 'ICICI Prudential', 
            'Star Health', 'Care Health', 'Bajaj Allianz', 'Niva Bupa',
          ].map((partner, i) => (
            <span key={i} className="text-3xl font-[900] text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 uppercase tracking-widest">
              {partner}
            </span>
          ))}
        </motion.div>
      </section>

      {/* 11. Final CTA */}
      <section className="py-32 px-4 sm:px-8 relative overflow-hidden text-center flex flex-col items-center">
        <div className="absolute inset-0 bg-brand-accent/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-5xl sm:text-7xl font-[900] text-white uppercase tracking-tight mb-8">
            Need Help With Your Claim?
          </h2>
          <p className="text-xl sm:text-2xl text-neutral-400 font-light mb-12">
            Whether you're filing a new claim or tracking an existing one, our experienced claims advisors are here to support you every step of the way. Let us make the claims process simple, transparent, and stress-free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto px-10 py-5 bg-brand-accent text-black rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(246,255,0,0.3)] cursor-pointer">
              Start a Claim
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/10 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-colors duration-300 backdrop-blur-md cursor-pointer border border-white/20">
              Speak to a Claims Advisor
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Claims;
