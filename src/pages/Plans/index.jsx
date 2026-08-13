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
  let scaleClass = 'scale-100';

  if (comp.includes('sbi')) { logoUrl = '/logos/sbi_life.png'; scaleClass = 'scale-[1.4]'; }
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
  else if (comp.includes('max') || comp.includes('axis')) { logoUrl = '/logos/axis_max.png'; scaleClass = 'scale-[1.4]'; }

  return (
    <div className="w-full h-full flex items-center justify-center p-1 rounded-lg bg-white dark:bg-stone-200 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-black/5 dark:border-none">
      <img
        src={logoUrl}
        alt={company}
        className={`w-full h-full object-contain ${scaleClass} mix-blend-multiply`}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    </div>
  );
};

// Skeleton Loader Component
const PlanSkeleton = () => (
  <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0A0A0A] p-6 flex flex-col relative overflow-hidden animate-pulse shadow-sm dark:shadow-none">
    <div className="flex justify-between items-start mb-6">
      <div className="w-20 h-10 bg-black/5 dark:bg-white/10 rounded-lg"></div>
      <div className="w-24 h-6 bg-black/5 dark:bg-white/10 rounded-full"></div>
    </div>
    <div className="w-3/4 h-6 bg-black/5 dark:bg-white/10 rounded mb-6"></div>
    <div className="w-1/2 h-10 bg-black/5 dark:bg-white/10 rounded mb-4"></div>
    <div className="w-1/3 h-4 bg-black/5 dark:bg-white/10 rounded mb-8"></div>
    <div className="space-y-4 mb-8 flex-1">
      <div className="w-full h-3 bg-black/5 dark:bg-white/10 rounded"></div>
      <div className="w-5/6 h-3 bg-black/5 dark:bg-white/10 rounded"></div>
      <div className="w-4/5 h-3 bg-black/5 dark:bg-white/10 rounded"></div>
    </div>
    <div className="flex gap-4">
      <div className="flex-1 h-12 bg-black/5 dark:bg-white/10 rounded-lg"></div>
      <div className="flex-1 h-12 bg-black/5 dark:bg-white/10 rounded-lg"></div>
    </div>
  </div>
);

// Dynamic pastel hover background based on category
const getCategoryHoverGlow = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('health')) return 'group-hover/card:bg-red-100 dark:group-hover/card:bg-red-500/10';
  if (cat.includes('motor') || cat.includes('vehicle')) return 'group-hover/card:bg-blue-100 dark:group-hover/card:bg-blue-500/10';
  if (cat.includes('life')) return 'group-hover/card:bg-emerald-100 dark:group-hover/card:bg-emerald-500/10';
  if (cat.includes('home')) return 'group-hover/card:bg-amber-100 dark:group-hover/card:bg-amber-500/10';
  if (cat.includes('travel')) return 'group-hover/card:bg-purple-100 dark:group-hover/card:bg-purple-500/10';
  return 'group-hover/card:bg-stone-100 dark:group-hover/card:bg-stone-500/10';
};

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
    <div className="w-full bg-[#F7F7F5] dark:bg-black min-h-screen text-black dark:text-white pb-32 transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4 w-full">
          <span className="text-xs text-brand-accent uppercase tracking-widest font-bold">Insurance Plans</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl uppercase font-black text-black dark:text-white tracking-tight">
            PROTECTION DESIGNED AROUND YOU
          </h1>
          <p className="text-base sm:text-lg text-black/60 dark:text-white/60 font-medium max-w-2xl mx-auto mt-4">
            Explore insurance plans from trusted providers and find coverage designed around your needs.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full max-w-2xl mt-10 relative">
          <div className="relative flex items-center w-full bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-lg p-1 pl-4 shadow-sm focus-within:border-black/30 dark:focus-within:border-white/30 transition-colors">
            <FaSearch className="text-black/40 dark:text-white/40 text-lg shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plans, insurers or coverage..."
              className="w-full bg-transparent border-none text-black dark:text-white px-4 py-3 focus:outline-none placeholder-black/40 dark:placeholder-white/40 text-base"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-3 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors shrink-0">
                <FaTimes />
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Filters (Categories & Insurers & Billing) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto pb-12 space-y-6">
        
        {/* Categories - Desktop Tabs */}
        <div className="hidden sm:flex overflow-x-auto pb-2 sm:mx-0 sm:px-0 gap-2 hide-scrollbar whitespace-nowrap border-b border-black/5 dark:border-white/5">
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={cn(
                  "px-5 py-3 text-sm font-semibold transition-colors relative",
                  isActive ? "text-brand-accent" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
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

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          
          <div className="grid grid-cols-2 sm:flex sm:flex-row w-full sm:w-auto gap-4">
            
            {/* Categories - Mobile Dropdown */}
            <div className="block sm:hidden col-span-1">
              <div className="flex flex-col gap-1.5 h-full">
                <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider pl-1">Category</span>
                <div className="relative h-full">
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="appearance-none w-full h-full min-h-[44px] bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 text-black dark:text-white text-xs font-bold rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:border-black/30 dark:focus:border-white/30 transition-colors shadow-sm"
                  >
                    {filterOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Insurer Filter */}
            <div className="col-span-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 h-full justify-end sm:justify-start">
                <span className="text-[10px] sm:text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-wider pl-1 sm:pl-0">Insurer</span>
                <div className="relative w-full sm:w-auto h-full sm:h-auto">
                  <select
                    value={activeCompanyFilter}
                    onChange={(e) => setActiveCompanyFilter(e.target.value)}
                    className="appearance-none w-full h-full min-h-[44px] sm:h-auto sm:min-h-0 sm:w-auto bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 text-black dark:text-white text-xs sm:text-sm font-medium rounded-lg px-3 sm:px-4 py-2.5 pr-8 sm:pr-10 focus:outline-none focus:border-black/30 dark:focus:border-white/30 transition-colors"
                  >
                    {ALL_SIXTEEN_COMPANIES.map((comp) => (
                      <option key={comp.value} value={comp.value}>
                        {comp.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 sm:px-3 pointer-events-none">
                    <svg className="w-4 h-4 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Billing Toggle */}
          <div className="w-full sm:w-auto flex justify-start sm:justify-end">
            <div className="flex items-center w-full sm:w-auto bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 p-1 rounded-lg transition-colors">
              <button
                onClick={() => handleToggle(true)}
                className={cn(
                  "flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-2 rounded-md text-[10px] sm:text-xs font-bold transition-colors uppercase tracking-wider",
                  isMonthly ? "bg-black dark:bg-white text-white dark:text-black" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => handleToggle(false)}
                className={cn(
                  "flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-2 rounded-md text-[10px] sm:text-xs font-bold transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2",
                  !isMonthly ? "bg-black dark:bg-white text-white dark:text-black" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                )}
              >
                Annual
                <span className={cn(
                  "px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[9px]",
                  !isMonthly ? "text-brand-accent bg-white dark:bg-black" : "text-brand-accent"
                )}>Save 20%</span>
              </button>
            </div>
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
          <div className="text-center py-24 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-black/10 dark:border-white/10 shadow-sm dark:shadow-none">
            <FaShieldAlt className="text-5xl text-black/10 dark:text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">No plans found</h3>
            <p className="text-black/60 dark:text-white/60 mb-6 text-sm">Try changing your search or filters to see available plans.</p>
            <button 
              onClick={() => { setActiveFilter('ALL'); setActiveCompanyFilter('ALL'); setSearchQuery(''); }}
              className="px-6 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white rounded-lg font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
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
                  className="rounded-xl border border-black/10 dark:border-white/10 bg-stone-50 dark:bg-[#0A0A0A] hover:shadow-lg dark:hover:shadow-none hover:border-black/20 dark:hover:bg-[#111] flex flex-col relative transition-all duration-300 shadow-sm dark:shadow-none overflow-hidden group/card"
                >
                  <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 rounded-xl ${getCategoryHoverGlow(plan.categoryTag || plan.category)}`} />
                  {plan.thumbnailUrl && (
                    <div className="w-full h-32 border-b border-black/10 dark:border-white/10 relative shrink-0 z-10">
                      <img src={plan.thumbnailUrl} alt={plan.name || plan.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1 relative z-10">
                  {/* Card Header: Logo, Category, Compare Checkbox */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4 items-center">
                      <div className="w-[72px] h-12">
                        <CompanyLogo company={plan.company} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-black/80 dark:text-white/80 bg-black/5 dark:bg-white/10 px-2 py-1 rounded">
                        {plan.categoryTag || plan.category}
                      </span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <span className="text-[10px] uppercase font-bold text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors">Compare</span>
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                        isSelectedForCompare ? "bg-brand-accent border-brand-accent text-black" : "border-black/20 dark:border-white/20 bg-transparent text-transparent"
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
                  <h3 className="text-xl font-bold text-black dark:text-white mb-6 line-clamp-2 min-h-[56px]">
                    {plan.name || plan.title}
                  </h3>

                  {/* Financial Details */}
                  <div className="flex flex-col gap-2 mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-black dark:text-white tracking-tight">₹{displayPrice.toLocaleString('en-IN')}</span>
                      <span className="text-sm font-medium text-black/60 dark:text-white/60">/{displayPeriod}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-black/60 dark:text-white/60">Coverage </span>
                      <span className="font-bold text-black dark:text-white">{plan.coverageAmount}</span>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="flex-1 mb-8">
                    <ul className="space-y-3">
                      {(plan.features || []).slice(0, 4).map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3">
                          <FaCheck className="h-4 w-4 text-brand-accent mt-0.5 shrink-0" />
                          <span className="text-sm text-black/80 dark:text-white/80 leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
                    <button 
                      onClick={() => setPlanDetailsModal(plan)}
                      className="w-full py-3 rounded-lg border border-black/20 dark:border-white/20 text-black dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleApply(plan)}
                      className="w-full py-3 rounded-lg bg-brand-accent text-black font-bold text-xs uppercase tracking-wider hover:bg-[#E6A100] transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-black/40 dark:text-white/40 line-clamp-2 leading-relaxed">
                    {plan.description}
                  </p>
                  </div>
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
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0A0A0A] border-t border-black/10 dark:border-white/10 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40 transition-colors"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  {compareList.map((p, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-white dark:border-[#0A0A0A] p-1.5 flex items-center justify-center overflow-hidden z-10 relative shadow-md dark:shadow-none">
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
                  <span className="text-sm font-bold text-black dark:text-white">{compareList.length} of 3 plans selected</span>
                  <span className="text-xs text-black/40 dark:text-white/40">Select up to 3 plans to compare</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCompareList([])}
                  className="hidden sm:block px-4 py-2 text-xs font-bold text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setShowCompareModal(true)}
                  disabled={compareList.length < 2}
                  className="px-6 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
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
        <div className="bg-white dark:bg-[#0A0A0A] text-black dark:text-white p-2 sm:p-6 overflow-x-auto transition-colors">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="p-4 border-b border-black/10 dark:border-white/10 w-1/4">Features</th>
                {compareList.map(plan => (
                  <th key={plan.id} className="p-4 border-b border-black/10 dark:border-white/10 w-1/4 align-top">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-16 h-10">
                        <CompanyLogo company={plan.company} />
                      </div>
                      <button onClick={() => {
                        toggleCompare(plan);
                        if (compareList.length <= 2) setShowCompareModal(false);
                      }} className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">
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
                <td className="p-4 border-b border-black/5 dark:border-white/5 text-black/60 dark:text-white/60 font-medium">Category</td>
                {compareList.map(plan => (
                  <td key={plan.id} className="p-4 border-b border-black/5 dark:border-white/5 font-bold">{plan.categoryTag || plan.category}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b border-black/5 dark:border-white/5 text-black/60 dark:text-white/60 font-medium">Premium</td>
                {compareList.map(plan => {
                  const monthlyPrice = parseInt(plan.premiumMonthly || plan.premiumAmount) || 0;
                  const yearlyPrice = Math.floor(monthlyPrice * 12 * 0.8);
                  return (
                    <td key={plan.id} className="p-4 border-b border-black/5 dark:border-white/5">
                      <div className="font-bold">₹{monthlyPrice.toLocaleString('en-IN')} / mo</div>
                      <div className="text-xs text-black/40 dark:text-white/40">₹{yearlyPrice.toLocaleString('en-IN')} / yr</div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-4 border-b border-black/5 dark:border-white/5 text-black/60 dark:text-white/60 font-medium">Coverage</td>
                {compareList.map(plan => (
                  <td key={plan.id} className="p-4 border-b border-black/5 dark:border-white/5 font-bold">{plan.coverageAmount}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b border-black/5 dark:border-white/5 text-black/60 dark:text-white/60 font-medium align-top">Key Benefits</td>
                {compareList.map(plan => (
                  <td key={plan.id} className="p-4 border-b border-black/5 dark:border-white/5 align-top">
                    <ul className="space-y-2">
                      {(plan.features || []).map((f, i) => (
                        <li key={i} className="flex gap-2">
                          <FaCheck className="w-3 h-3 text-brand-accent shrink-0 mt-1" />
                          <span className="text-black/80 dark:text-white/80">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-black/5 dark:border-white/5 text-black/60 dark:text-white/60 font-medium align-top">Description</td>
                {compareList.map(plan => (
                  <td key={plan.id} className="p-4 border-black/5 dark:border-white/5 align-top">
                    <p className="text-black/60 dark:text-white/60 text-xs leading-relaxed">{plan.description}</p>
                    <button 
                      onClick={() => { setShowCompareModal(false); handleApply(plan); }}
                      className="mt-6 w-full py-2.5 rounded-lg bg-brand-accent text-black font-bold text-xs uppercase tracking-wider hover:bg-[#E6A100] transition-colors"
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
        size="xl"
      >
        {planDetailsModal && (
          <div className="flex flex-col md:flex-row gap-8 md:gap-10 text-black dark:text-white px-2 pb-2">
            
            {/* LEFT COLUMN: Plan Information */}
            <div className="flex-1 flex flex-col gap-6 md:gap-8">
              {/* Header: Logo & Tag */}
              <div className="flex justify-between items-center -mt-2">
                <div className="h-10 flex items-center justify-start">
                  <CompanyLogo company={planDetailsModal.company} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3 py-1.5 rounded-lg">
                  {planDetailsModal.categoryTag || planDetailsModal.category}
                </span>
              </div>
              
              {/* Title & Description */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight pr-4">
                  {planDetailsModal.name || planDetailsModal.title}
                </h2>
                <p className="text-[14px] sm:text-[15px] text-black/60 dark:text-white/60 leading-relaxed max-w-2xl font-medium">
                  {planDetailsModal.description}
                </p>
              </div>

              {/* Key Benefits */}
              <div className="mt-auto">
                <h4 className="text-xs font-bold uppercase tracking-widest text-black/80 dark:text-white/80 mb-4 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-accent" />
                  Key Benefits Included
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  {(planDetailsModal.features || []).map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                        <FaCheck className="w-2.5 h-2.5 text-brand-accent" />
                      </div>
                      <span className="text-[14px] font-medium text-black/80 dark:text-white/80 leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Pricing & Actions */}
            <div className="w-full md:w-[340px] flex flex-col gap-6 shrink-0">
              
              {/* Pricing Highlight Box */}
              <div className="flex flex-col gap-6 p-6 sm:p-8 bg-stone-50 dark:bg-white/[0.03] rounded-[24px] border border-black/5 dark:border-white/5 h-full justify-center">
                 <div>
                   <p className="text-[11px] font-bold uppercase tracking-wider text-black/50 dark:text-white/50 mb-2">Monthly Premium</p>
                   <p className="text-4xl font-black tracking-tight">
                     ₹{parseInt(planDetailsModal.premiumMonthly || planDetailsModal.premiumAmount || 0).toLocaleString('en-IN')}
                     <span className="text-base text-black/50 dark:text-white/50 font-bold ml-1">/mo</span>
                   </p>
                 </div>
                 
                 <div className="w-full h-px bg-black/10 dark:bg-white/10" />
                 
                 <div>
                   <p className="text-[11px] font-bold uppercase tracking-wider text-black/50 dark:text-white/50 mb-2">Standard Coverage</p>
                   <p className="text-3xl font-black tracking-tight">{planDetailsModal.coverageAmount}</p>
                 </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setPlanDetailsModal(null);
                    handleApply(planDetailsModal);
                  }}
                  className="w-full py-4 rounded-xl bg-brand-accent text-black font-extrabold uppercase tracking-wider text-[13px] hover:bg-[#E6A100] transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Apply Now <FaArrowRight className="h-3 w-3" />
                </button>
                <button 
                  onClick={() => setPlanDetailsModal(null)}
                  className="w-full py-3 rounded-xl border-2 border-black/10 dark:border-white/10 font-bold uppercase tracking-wider text-[12px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            
          </div>
        )}
      </Modal>

      {/* Apply Wizard Modal (Preserved as requested) */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={selectedPlan ? `Policy Application: ${selectedPlan.name || selectedPlan.title}` : ''}
        size="md"
      >
        <div className="bg-white dark:bg-[#0A0A0A] text-black dark:text-white rounded-2xl p-2 -m-6 sm:-m-8 transition-colors">
          {wizardStep === 1 ? (
            <form onSubmit={handleWizardSubmit} className="space-y-6 p-6 sm:p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-[900] uppercase tracking-tight text-black dark:text-white mb-2">Secure Your Plan</h3>
                <p className="text-sm text-black/60 dark:text-white/60 font-medium">Please provide details below to configure and request policy underwriting approval.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 dark:text-white/60 uppercase tracking-wider mb-2">Full Legal Name</label>
                  <input required type="text" className="w-full px-4 py-3 text-sm bg-black/[0.02] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-black dark:text-white focus:border-brand-accent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-black/60 dark:text-white/60 uppercase tracking-wider mb-2">Email Address</label>
                  <input required type="email" className="w-full px-4 py-3 text-sm bg-black/[0.02] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-black dark:text-white focus:border-brand-accent outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-black/60 dark:text-white/60 uppercase tracking-wider mb-2">Mobile Phone</label>
                  <input required type="tel" className="w-full px-4 py-3 text-sm bg-black/[0.02] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-black dark:text-white focus:border-brand-accent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-black/60 dark:text-white/60 uppercase tracking-wider mb-2">Date of Birth</label>
                  <input required type="date" className="w-full px-4 py-3 text-sm bg-black/[0.02] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-black dark:text-white focus:border-brand-accent outline-none transition-all dark:[&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-black/60 dark:text-white/60 uppercase tracking-wider mb-2">Upload ID Copy</label>
                <div className="p-8 border border-dashed border-black/20 dark:border-white/20 rounded-lg text-center cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/5 hover:border-black/40 dark:hover:border-white/40 transition-all group">
                  <span className="text-xs font-bold text-black/40 dark:text-white/40 uppercase tracking-widest group-hover:text-black dark:group-hover:text-white transition-colors">Click to upload document (PDF/JPEG)</span>
                </div>
              </div>

              <div className="p-6 bg-black/[0.02] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg">
                <p className="font-bold text-black/80 dark:text-white/80 text-sm mb-4">Premium Quote Outline</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-black/60 dark:text-white/60 font-medium text-xs uppercase tracking-wider">Monthly Premium:</span>
                  <span className="font-black text-xl">₹{parseInt(selectedPlan?.premiumMonthly || selectedPlan?.premiumAmount || 0).toLocaleString('en-IN')}/mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/60 dark:text-white/60 font-medium text-xs uppercase tracking-wider">Standard Sum Assured:</span>
                  <span className="font-black text-xl">{selectedPlan?.coverageAmount}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4">
                <button type="button" onClick={() => setShowApplyModal(false)} disabled={isSubmitting} className="px-6 py-3 rounded-lg border border-black/20 dark:border-white/20 text-black dark:text-white font-bold uppercase tracking-wider text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-lg bg-brand-accent text-black font-bold uppercase tracking-wider text-xs hover:bg-[#E6A100] transition-colors flex items-center justify-center gap-3">
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
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Application Received!</h3>
              <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed mb-10 max-w-sm mx-auto">
                Your application has been logged in our system. A verification case has been assigned to our team. We will contact you shortly.
              </p>
              <button onClick={() => setShowApplyModal(false)} className="px-8 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider text-xs hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
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
