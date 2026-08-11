import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { Modal } from '../../components/ui/Modal';
import { subscribeToCollection } from '../../services/firebaseService';
import { FaCheck, FaShieldAlt, FaUserShield, FaBriefcase, FaFileSignature, FaHeartbeat, FaCar, FaSearch, FaArrowRight, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { cn } from '../../utils/cn';

// Clean Professional Company Logo Component
const CompanyLogo = ({ company }) => {
  const comp = (company || '').toLowerCase();
  let logoUrl = '/logos/lic.png';

  if (comp.includes('sbi')) logoUrl = '/logos/sbi_life.png';
  else if (comp.includes('postal')) logoUrl = '/logos/Postal Office.png';
  else if (comp.includes('hdfc')) logoUrl = '/logos/hdfc_life.png';
  else if (comp.includes('icici')) logoUrl = '/logos/icici_prudential.png';
  else if (comp.includes('tata')) logoUrl = '/logos/tata_aia.png';
  else if (comp.includes('star')) logoUrl = '/logos/star_health.png';
  else if (comp.includes('niva') || comp.includes('bupa')) logoUrl = '/logos/niva_bupa.png';
  else if (comp.includes('bajaj')) logoUrl = '/logos/bajaj_allianz.png';
  else if (comp.includes('future') || comp.includes('generali')) logoUrl = '/logos/Future Generali.jpg';
  else if (comp.includes('birla') || comp.includes('aditya')) logoUrl = '/logos/Aditya Birla Sun Life.jpg';
  else if (comp.includes('oriental')) logoUrl = '/logos/oriental_insurance.png';
  else if (comp.includes('allianz')) logoUrl = '/logos/bajaj_allianz.png';
  else if (comp.includes('kotak')) logoUrl = '/logos/Kotak Mahindra Life.jpg';
  else if (comp.includes('pnb')) logoUrl = '/logos/PNB MetLife.png';
  else if (comp.includes('manipal') || comp.includes('cigna')) logoUrl = '/logos/ManipalCigna Health.png';
  else if (comp.includes('max') || comp.includes('axis')) logoUrl = '/logos/axis_max.png';

  return (
    <div className="w-full h-full flex items-center justify-center p-2 rounded-lg bg-white/5 overflow-hidden">
      <img
        src={logoUrl}
        alt={company}
        className="max-w-full max-h-full object-contain"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    </div>
  );
};

// Skeleton Loader Component
const PlanSkeleton = () => (
  <div className="rounded-xl border border-white/10 bg-[#0A0A0A] p-6 flex flex-col relative overflow-hidden animate-pulse">
    <div className="flex justify-between items-start mb-6">
      <div className="w-20 h-10 bg-white/10 rounded-lg"></div>
      <div className="w-24 h-6 bg-white/10 rounded-full"></div>
    </div>
    <div className="w-3/4 h-6 bg-white/10 rounded mb-6"></div>
    <div className="w-1/2 h-10 bg-white/10 rounded mb-4"></div>
    <div className="w-1/3 h-4 bg-white/10 rounded mb-8"></div>
    <div className="space-y-4 mb-8 flex-1">
      <div className="w-full h-3 bg-white/10 rounded"></div>
      <div className="w-5/6 h-3 bg-white/10 rounded"></div>
      <div className="w-4/5 h-3 bg-white/10 rounded"></div>
    </div>
    <div className="flex gap-4">
      <div className="w-1/2 h-12 bg-white/10 rounded-lg"></div>
      <div className="w-1/2 h-12 bg-white/10 rounded-lg"></div>
    </div>
  </div>
);

export const Plans = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeCompanyFilter, setActiveCompanyFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Pricing specific state
  const [isMonthly, setIsMonthly] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);

  // Compare Feature and Details Modal States
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [planDetailsModal, setPlanDetailsModal] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleToggle = (monthly) => {
    setIsMonthly(monthly);
  };

  const toggleCompare = (plan) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === plan.id);
      if (exists) return prev.filter(p => p.id !== plan.id);
      if (prev.length >= 3) return prev; // Limit to 3
      return [...prev, plan];
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) setActiveFilter(category);
    else setActiveFilter('ALL');
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCollection('plans', (data) => {
      if (data && data.length > 0) {
        const sorted = [...data].sort((a, b) => {
          const isTataA = (a.company || '').toLowerCase().includes('tata');
          const isTataB = (b.company || '').toLowerCase().includes('tata');
          
          if (isTataA && !isTataB) return -1;
          if (!isTataA && isTataB) return 1;

          const orderA = a.displayOrder !== undefined ? parseInt(a.displayOrder) : 999;
          const orderB = b.displayOrder !== undefined ? parseInt(b.displayOrder) : 999;
          return orderA - orderB;
        });
        setPlans(sorted);
      } else {
        setPlans([]); 
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filterOptions = [
    { label: 'All Plans', value: 'ALL' },
    { label: 'Term Insurance', value: 'Term Insurance' },
    { label: 'ULIP', value: 'ULIP' },
    { label: 'Savings Plan', value: 'Savings Plan' },
    { label: 'Pension Plan', value: 'Pension Plan' },
    { label: 'Child Plan', value: 'Child Plan' },
    { label: 'Health Care', value: 'Health' },
    { label: 'Motor & Home', value: 'Motor' }
  ];

  const ALL_SIXTEEN_COMPANIES = [
    { label: 'All Insurers', value: 'ALL' },
    { label: 'Tata AIA', value: 'Tata AIA' },
    { label: 'Postal Office', value: 'Postal Office' },
    { label: 'Future Generali', value: 'Future Generali' },
    { label: 'Bajaj', value: 'Bajaj' },
    { label: 'Aditya Birla', value: 'Aditya Birla' },
    { label: 'Oriental', value: 'Oriental Insurance' },
    { label: 'ICICI', value: 'ICICI' },
    { label: 'HDFC', value: 'HDFC' },
    { label: 'SBI', value: 'SBI' },
    { label: 'Niva Bupa', value: 'Niva Bupa' },
    { label: 'Allianz', value: 'Allianz' },
    { label: 'Kotak', value: 'Kotak' },
    { label: 'PNB', value: 'PNB' },
    { label: 'Manipal Cigna', value: 'Manipal Cigna' },
    { label: 'Star Health', value: 'Star Health' },
    { label: 'Axis Max', value: 'Axis Max' }
  ];

  const finalFilteredPlans = plans.filter(plan => {
    if (plan.isVisible === false || plan.status === 'Inactive') return false;

    let categoryMatch = true;
    if (activeFilter !== 'ALL') {
      if (activeFilter === 'Motor') {
        categoryMatch = plan.category === 'Motor' || plan.category === 'Home' || plan.category === 'Travel';
      } else {
        categoryMatch = plan.category === activeFilter || plan.categoryTag === activeFilter;
      }
    }

    let companyMatch = true;
    if (activeCompanyFilter !== 'ALL') {
      const compLower = (plan.company || '').toLowerCase();
      const targetLower = activeCompanyFilter.toLowerCase();

      if (targetLower === 'postal office') companyMatch = compLower.includes('postal');
      else if (targetLower === 'future generali') companyMatch = compLower.includes('future') || compLower.includes('generali');
      else if (targetLower === 'bajaj') companyMatch = compLower.includes('bajaj');
      else if (targetLower === 'aditya birla') companyMatch = compLower.includes('aditya') || compLower.includes('birla');
      else if (targetLower === 'oriental') companyMatch = compLower.includes('oriental');
      else if (targetLower === 'tata aia') companyMatch = compLower.includes('tata');
      else if (targetLower === 'icici') companyMatch = compLower.includes('icici');
      else if (targetLower === 'hdfc') companyMatch = compLower.includes('hdfc');
      else if (targetLower === 'sbi') companyMatch = compLower.includes('sbi');
      else if (targetLower === 'niva bupa') companyMatch = compLower.includes('niva') || compLower.includes('bupa');
      else if (targetLower === 'allianz') companyMatch = compLower.includes('allianz');
      else if (targetLower === 'kotak') companyMatch = compLower.includes('kotak');
      else if (targetLower === 'pnb') companyMatch = compLower.includes('pnb');
      else if (targetLower === 'manipal cigna') companyMatch = compLower.includes('manipal') || compLower.includes('cigna');
      else if (targetLower === 'star health') companyMatch = compLower.includes('star');
      else if (targetLower === 'axis max') companyMatch = compLower.includes('max') || compLower.includes('axis');
    }

    let searchMatch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (plan.name || plan.title || '').toLowerCase();
      const comp = (plan.company || '').toLowerCase();
      const desc = (plan.description || '').toLowerCase();
      const cat = (plan.category || '').toLowerCase();
      searchMatch = name.includes(q) || comp.includes(q) || desc.includes(q) || cat.includes(q);
    }

    return categoryMatch && companyMatch && searchMatch;
  });

  const handleApply = (plan) => {
    setSelectedPlan(plan);
    setWizardStep(1);
    setShowApplyModal(true);
  };

  const handleWizardSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setWizardStep(2);
    }, 2000);
  };

  return (
    <div className="w-full bg-black min-h-screen text-white pb-32">
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4 w-full">
          <span className="text-xs text-brand-accent uppercase tracking-widest font-bold">Insurance Plans</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            Protection Designed Around You
          </h1>
          <p className="text-base sm:text-lg text-white/60 font-medium max-w-2xl mx-auto mt-4">
            Explore insurance plans from trusted providers and find coverage designed around your needs.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full max-w-2xl mt-10 relative">
          <div className="relative flex items-center w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-1 pl-4 shadow-sm focus-within:border-white/30 transition-colors">
            <FaSearch className="text-white/40 text-lg shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plans, insurers or coverage..."
              className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-white/40 text-base"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-3 text-white/40 hover:text-white transition-colors shrink-0">
                <FaTimes />
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Filters (Categories & Insurers & Billing) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto pb-12 space-y-8">
        
        {/* Categories */}
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2 hide-scrollbar whitespace-nowrap border-b border-white/5">
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={cn(
                  "px-5 py-3 text-sm font-semibold transition-colors relative",
                  isActive ? "text-brand-accent" : "text-white/60 hover:text-white"
                )}
              >
                {opt.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-accent rounded-t-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Insurers & Billing */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          {/* Insurer Filter */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Insurer</span>
            <div className="relative">
              <select
                value={activeCompanyFilter}
                onChange={(e) => setActiveCompanyFilter(e.target.value)}
                className="appearance-none bg-[#0A0A0A] border border-white/10 text-white text-sm font-medium rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-white/30 transition-colors"
              >
                {ALL_SIXTEEN_COMPANIES.map((comp) => (
                  <option key={comp.value} value={comp.value}>
                    {comp.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center bg-[#0A0A0A] border border-white/10 p-1 rounded-lg">
            <button
              onClick={() => handleToggle(true)}
              className={cn(
                "px-6 py-2 rounded-md text-xs font-bold transition-colors uppercase tracking-wider",
                isMonthly ? "bg-white text-black" : "text-white/60 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => handleToggle(false)}
              className={cn(
                "px-6 py-2 rounded-md text-xs font-bold transition-colors uppercase tracking-wider flex items-center gap-2",
                !isMonthly ? "bg-white text-black" : "text-white/60 hover:text-white"
              )}
            >
              Annual
              <span className={!isMonthly ? "text-brand-accent bg-black px-1.5 py-0.5 rounded text-[9px]" : "text-brand-accent"}>Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto pb-20">
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PlanSkeleton />
            <PlanSkeleton />
            <PlanSkeleton />
          </div>
        ) : finalFilteredPlans.length === 0 ? (
          <div className="text-center py-24 bg-[#0A0A0A] rounded-2xl border border-white/10">
            <FaShieldAlt className="text-5xl text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No plans found</h3>
            <p className="text-white/60 mb-6 text-sm">Try changing your search or filters to see available plans.</p>
            <button 
              onClick={() => { setActiveFilter('ALL'); setActiveCompanyFilter('ALL'); setSearchQuery(''); }}
              className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {finalFilteredPlans.map((plan, idx) => {
              const monthlyPrice = parseInt(plan.premiumMonthly || plan.premiumAmount) || 0;
              const yearlyPrice = Math.floor(monthlyPrice * 12 * 0.8);
              const displayPrice = isMonthly ? monthlyPrice : yearlyPrice;
              const displayPeriod = isMonthly ? "month" : "year";
              const isSelectedForCompare = compareList.some(p => p.id === plan.id);

              return (
                <motion.div 
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
                  className="rounded-xl border border-white/10 bg-[#0A0A0A] hover:bg-[#111] p-6 flex flex-col relative transition-all duration-300"
                >
                  {/* Card Header: Logo, Category, Compare Checkbox */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4 items-center">
                      <div className="w-[72px] h-12">
                        <CompanyLogo company={plan.company} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/10 px-2 py-1 rounded">
                        {plan.categoryTag || plan.category}
                      </span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <span className="text-[10px] uppercase font-bold text-white/40 group-hover:text-white transition-colors">Compare</span>
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                        isSelectedForCompare ? "bg-brand-accent border-brand-accent text-black" : "border-white/20 bg-transparent text-transparent"
                      )}>
                        <FaCheck className="w-2.5 h-2.5" />
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={isSelectedForCompare}
                        onChange={() => toggleCompare(plan)} 
                      />
                    </label>
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-xl font-bold text-white mb-6 line-clamp-2 min-h-[56px]">
                    {plan.name || plan.title}
                  </h3>

                  {/* Financial Details */}
                  <div className="flex flex-col gap-2 mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white tracking-tight">₹{displayPrice.toLocaleString('en-IN')}</span>
                      <span className="text-sm font-medium text-white/60">/{displayPeriod}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-white/60">Coverage </span>
                      <span className="font-bold text-white">{plan.coverageAmount}</span>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="flex-1 mb-8">
                    <ul className="space-y-3">
                      {(plan.features || []).slice(0, 4).map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3">
                          <FaCheck className="h-4 w-4 text-brand-accent mt-0.5 shrink-0" />
                          <span className="text-sm text-white/80 leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
                    <button 
                      onClick={() => setPlanDetailsModal(plan)}
                      className="w-full py-3 rounded-lg border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleApply(plan)}
                      className="w-full py-3 rounded-lg bg-brand-accent text-black font-bold text-xs uppercase tracking-wider hover:bg-[#E5ED00] transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                    {plan.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Compare Sticky Bar */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-white/10 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  {compareList.map((p, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-[#0A0A0A] p-1.5 flex items-center justify-center overflow-hidden z-10 relative">
                      <CompanyLogo company={p.company} />
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleCompare(p); }} 
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <FaTimes className="text-white text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{compareList.length} of 3 plans selected</span>
                  <span className="text-xs text-white/40">Select up to 3 plans to compare</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCompareList([])}
                  className="hidden sm:block px-4 py-2 text-xs font-bold text-white/60 hover:text-white uppercase tracking-wider transition-colors"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setShowCompareModal(true)}
                  disabled={compareList.length < 2}
                  className="px-6 py-3 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors"
                >
                  Compare Plans
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <Modal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        title="Compare Plans"
        size="lg"
      >
        <div className="bg-[#0A0A0A] text-white p-2 sm:p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="p-4 border-b border-white/10 w-1/4">Features</th>
                {compareList.map(plan => (
                  <th key={plan.id} className="p-4 border-b border-white/10 w-1/4 align-top">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-16 h-10">
                        <CompanyLogo company={plan.company} />
                      </div>
                      <button onClick={() => {
                        toggleCompare(plan);
                        if (compareList.length <= 2) setShowCompareModal(false);
                      }} className="text-white/40 hover:text-white transition-colors">
                        <FaTimes />
                      </button>
                    </div>
                    <h4 className="text-base font-bold mb-1">{plan.name || plan.title}</h4>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <td className="p-4 border-b border-white/5 text-white/60 font-medium">Category</td>
                {compareList.map(plan => (
                  <td key={plan.id} className="p-4 border-b border-white/5 font-bold">{plan.categoryTag || plan.category}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b border-white/5 text-white/60 font-medium">Premium</td>
                {compareList.map(plan => {
                  const monthlyPrice = parseInt(plan.premiumMonthly || plan.premiumAmount) || 0;
                  const yearlyPrice = Math.floor(monthlyPrice * 12 * 0.8);
                  return (
                    <td key={plan.id} className="p-4 border-b border-white/5">
                      <div className="font-bold">₹{monthlyPrice.toLocaleString('en-IN')} / mo</div>
                      <div className="text-xs text-white/40">₹{yearlyPrice.toLocaleString('en-IN')} / yr</div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-4 border-b border-white/5 text-white/60 font-medium">Coverage</td>
                {compareList.map(plan => (
                  <td key={plan.id} className="p-4 border-b border-white/5 font-bold">{plan.coverageAmount}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b border-white/5 text-white/60 font-medium align-top">Key Benefits</td>
                {compareList.map(plan => (
                  <td key={plan.id} className="p-4 border-b border-white/5 align-top">
                    <ul className="space-y-2">
                      {(plan.features || []).map((f, i) => (
                        <li key={i} className="flex gap-2">
                          <FaCheck className="w-3 h-3 text-brand-accent shrink-0 mt-1" />
                          <span className="text-white/80">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-white/5 text-white/60 font-medium align-top">Description</td>
                {compareList.map(plan => (
                  <td key={plan.id} className="p-4 border-white/5 align-top">
                    <p className="text-white/60 text-xs leading-relaxed">{plan.description}</p>
                    <button 
                      onClick={() => { setShowCompareModal(false); handleApply(plan); }}
                      className="mt-6 w-full py-2.5 rounded-lg bg-brand-accent text-black font-bold text-xs uppercase tracking-wider hover:bg-[#E5ED00] transition-colors"
                    >
                      Apply Now
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Plan Details Modal */}
      <Modal
        isOpen={!!planDetailsModal}
        onClose={() => setPlanDetailsModal(null)}
        title=""
        size="md"
      >
        {planDetailsModal && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-b from-[#151515] to-[#0A0A0A] text-white rounded-2xl p-5 -m-6 relative overflow-hidden border border-white/5 shadow-2xl"
          >
            {/* Decorative top glow and background effects */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-50" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-accent/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-20 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1.5 shadow-lg ring-1 ring-white/10 backdrop-blur-sm">
                <CompanyLogo company={planDetailsModal.company} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-2.5 py-1 rounded-lg backdrop-blur-md">
                {planDetailsModal.categoryTag || planDetailsModal.category}
              </span>
            </div>
            
            <h3 className="text-2xl font-black text-white mb-1 tracking-tight relative z-10">
              {planDetailsModal.name || planDetailsModal.title}
            </h3>
            
            <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-white/[0.03] rounded-xl border border-white/10 relative overflow-hidden backdrop-blur-sm group hover:border-white/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 border-r border-white/10 pr-3">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                  Premium
                </p>
                <p className="text-xl font-black text-white drop-shadow-md">
                  ₹{parseInt(planDetailsModal.premiumMonthly || planDetailsModal.premiumAmount || 0).toLocaleString('en-IN')}
                  <span className="text-xs font-bold text-white/40 ml-1">/mo</span>
                </p>
              </div>
              <div className="relative z-10 pl-2">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                  Coverage
                </p>
                <p className="text-xl font-black text-white drop-shadow-md">{planDetailsModal.coverageAmount}</p>
              </div>
            </div>

            <div className="mb-4 relative z-10">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="h-3 w-1 bg-brand-accent rounded-full" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Key Benefits</h4>
              </div>
              <ul className="space-y-2">
                {(planDetailsModal.features || []).map((feature, fIdx) => (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (fIdx * 0.1) }}
                    key={fIdx} 
                    className="flex items-start gap-2.5 group/item"
                  >
                    <div className="bg-brand-accent/20 p-1 rounded-full mt-0.5 group-hover/item:bg-brand-accent/40 transition-colors">
                      <FaCheck className="h-2.5 w-2.5 text-brand-accent" />
                    </div>
                    <span className="text-[13px] text-white/80 leading-relaxed font-medium group-hover/item:text-white transition-colors">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="mb-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-1 bg-white/20 rounded-full" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/80">Description</h4>
              </div>
              <p className="text-xs text-white/60 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                {planDetailsModal.description}
              </p>
            </div>

            <div className="flex gap-3 relative z-10 pt-1">
              <button 
                onClick={() => setPlanDetailsModal(null)}
                className="w-1/3 py-2.5 rounded-lg border border-white/20 text-white font-bold text-[11px] uppercase tracking-wider hover:bg-white/10 hover:border-white/30 transition-all active:scale-[0.98]"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setPlanDetailsModal(null);
                  handleApply(planDetailsModal);
                }}
                className="w-2/3 py-2.5 rounded-lg bg-brand-accent text-black font-black text-[11px] uppercase tracking-wider hover:bg-[#E5ED00] hover:shadow-[0_0_15px_rgba(229,237,0,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Apply Now <FaArrowRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </motion.div>
        )}
      </Modal>

      {/* Apply Wizard Modal (Preserved as requested) */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={selectedPlan ? `Policy Application: ${selectedPlan.name || selectedPlan.title}` : ''}
        size="md"
      >
        <div className="bg-[#0A0A0A] text-white rounded-2xl p-2 -m-6 sm:-m-8">
          {wizardStep === 1 ? (
            <form onSubmit={handleWizardSubmit} className="space-y-6 p-6 sm:p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-[900] uppercase tracking-tight text-white mb-2">Secure Your Plan</h3>
                <p className="text-sm text-white/60 font-medium">Please provide details below to configure and request policy underwriting approval.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2">Full Legal Name</label>
                  <input required type="text" className="w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-accent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2">Email Address</label>
                  <input required type="email" className="w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-accent outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2">Mobile Phone</label>
                  <input required type="tel" className="w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-accent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2">Date of Birth</label>
                  <input required type="date" className="w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:border-brand-accent outline-none transition-all [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2">Upload ID Copy</label>
                <div className="p-8 border border-dashed border-white/20 rounded-lg text-center cursor-pointer hover:bg-white/5 hover:border-white/40 transition-all group">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Click to upload document (PDF/JPEG)</span>
                </div>
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                <p className="font-bold text-white/80 text-sm mb-4">Premium Quote Outline</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60 font-medium text-xs uppercase tracking-wider">Monthly Premium:</span>
                  <span className="font-black text-xl">₹{parseInt(selectedPlan?.premiumMonthly || selectedPlan?.premiumAmount || 0).toLocaleString('en-IN')}/mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 font-medium text-xs uppercase tracking-wider">Standard Sum Assured:</span>
                  <span className="font-black text-xl">{selectedPlan?.coverageAmount}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4">
                <button type="button" onClick={() => setShowApplyModal(false)} disabled={isSubmitting} className="px-6 py-3 rounded-lg border border-white/20 text-white font-bold uppercase tracking-wider text-xs hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-lg bg-brand-accent text-black font-bold uppercase tracking-wider text-xs hover:bg-[#E5ED00] transition-colors flex items-center justify-center gap-3">
                  {isSubmitting ? 'Processing...' : 'Submit Application'}
                  {!isSubmitting && <FaArrowRight />}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-20 px-8">
              <div className="inline-flex p-6 rounded-full bg-brand-accent/20 text-brand-accent text-5xl mb-8">
                <FaCheckCircle />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Application Received!</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-10 max-w-sm mx-auto">
                Your application has been logged in our system. A verification case has been assigned to our team. We will contact you shortly.
              </p>
              <button onClick={() => setShowApplyModal(false)} className="px-8 py-3 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors">
                Close
              </button>
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
};
export default Plans;
