import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Filters } from '../../components/common/Filters';
import { Modal } from '../../components/ui/Modal';
import { Loader } from '../../components/ui/Loader';
import { subscribeToCollection } from '../../services/firebaseService';
import { FaCheckCircle, FaShieldAlt, FaBriefcase, FaFileSignature, FaHeartbeat, FaUserShield, FaCar, FaSearch } from 'react-icons/fa';

const CompanyLogo = ({ company }) => {
  const comp = (company || '').toLowerCase();

  let logoUrl = '/logos/lic.png';

  if (comp.includes('sbi')) {
    logoUrl = '/logos/sbi_life.png';
  } else if (comp.includes('postal')) {
    logoUrl = '/logos/Postal Office.png';
  } else if (comp.includes('hdfc')) {
    logoUrl = '/logos/hdfc_life.png';
  } else if (comp.includes('icici')) {
    logoUrl = '/logos/icici_prudential.png';
  } else if (comp.includes('tata')) {
    logoUrl = '/logos/tata_aia.png';
  } else if (comp.includes('star')) {
    logoUrl = '/logos/star_health.png';
  } else if (comp.includes('niva') || comp.includes('bupa')) {
    logoUrl = '/logos/niva_bupa.png';
  } else if (comp.includes('bajaj')) {
    logoUrl = '/logos/bajaj_allianz.png';
  } else if (comp.includes('future') || comp.includes('generali')) {
    logoUrl = '/logos/Future Generali.jpg';
  } else if (comp.includes('birla') || comp.includes('aditya')) {
    logoUrl = '/logos/Aditya Birla Sun Life.jpg';
  } else if (comp.includes('oriental')) {
    logoUrl = '/logos/oriental_insurance.png';
  } else if (comp.includes('allianz')) {
    logoUrl = '/logos/bajaj_allianz.png';
  } else if (comp.includes('kotak')) {
    logoUrl = '/logos/Kotak Mahindra Life.jpg';
  } else if (comp.includes('pnb')) {
    logoUrl = '/logos/PNB MetLife.png';
  } else if (comp.includes('manipal') || comp.includes('cigna')) {
    logoUrl = '/logos/ManipalCigna Health.png';
  } else if (comp.includes('max') || comp.includes('axis')) {
    logoUrl = '/logos/axis_max.png';
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-white rounded-lg p-0.5">
      <img
        src={logoUrl}
        alt={company}
        className="max-w-full max-h-full object-contain"
        onError={(e) => {
          e.target.style.display = 'none';
          if (e.target.nextSibling) {
            e.target.nextSibling.style.display = 'flex';
          }
        }}
      />
      <div className="hidden w-full h-full bg-slate-100 dark:bg-navy-800 rounded-lg flex items-center justify-center text-xs font-bold">
        🏛️
      </div>
    </div>
  );
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setActiveFilter(category);
    } else {
      setActiveFilter('ALL');
    }
  }, [location.search]);
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCollection('plans', (data) => {
      // Sort plans by displayOrder ascending
      const sorted = [...data].sort((a, b) => {
        const orderA = a.displayOrder !== undefined ? parseInt(a.displayOrder) : 999;
        const orderB = b.displayOrder !== undefined ? parseInt(b.displayOrder) : 999;
        return orderA - orderB;
      });
      setPlans(sorted);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filterOptions = [
    { label: 'All Plans', value: 'ALL', icon: FaShieldAlt },
    { label: 'Term Insurance', value: 'Term Insurance', icon: FaUserShield },
    { label: 'ULIP', value: 'ULIP', icon: FaBriefcase },
    { label: 'Savings Plan', value: 'Savings Plan', icon: FaFileSignature },
    { label: 'Pension Plan', value: 'Pension Plan', icon: FaUserShield },
    { label: 'Child Plan', value: 'Child Plan', icon: FaShieldAlt },
    { label: 'Health Care', value: 'Health', icon: FaHeartbeat },
    { label: 'Motor & Home', value: 'Motor', icon: FaCar }
  ];

  // All 16 Insurance Companies list
  const ALL_SIXTEEN_COMPANIES = [
    { label: 'All Insurers (16)', value: 'ALL', emblem: '🏢' },
    { label: 'Postal Office', value: 'Postal Office', emblem: '📮' },
    { label: 'Future Generali', value: 'Future Generali', emblem: '🏢' },
    { label: 'Bajaj', value: 'Bajaj', emblem: '⚡' },
    { label: 'Aditya Birla', value: 'Aditya Birla', emblem: '🛡️' },
    { label: 'Oriental Insurance', value: 'Oriental Insurance', emblem: '🏛️' },
    { label: 'Tata AIA', value: 'Tata AIA', emblem: '💎' },
    { label: 'ICICI', value: 'ICICI', emblem: '🔷' },
    { label: 'HDFC', value: 'HDFC', emblem: '🟥' },
    { label: 'SBI', value: 'SBI', emblem: '🏛️' },
    { label: 'Niva Bupa', value: 'Niva Bupa', emblem: '🩺' },
    { label: 'Allianz', value: 'Allianz', emblem: '🌐' },
    { label: 'Kotak', value: 'Kotak', emblem: '🔴' },
    { label: 'PNB', value: 'PNB', emblem: '🏦' },
    { label: 'Manipal Cigna', value: 'Manipal Cigna', emblem: '🏥' },
    { label: 'Star Health', value: 'Star Health', emblem: '⭐' },
    { label: 'Axis Max', value: 'Axis Max', emblem: '❇️' }
  ];

  // Filter plans by category, company, search query, and visibility
  const finalFilteredPlans = plans.filter(plan => {
    // Visibility customization filter
    if (plan.isVisible === false) return false;

    // Category filter
    let categoryMatch = true;
    if (activeFilter !== 'ALL') {
      if (activeFilter === 'Motor') {
        categoryMatch = plan.category === 'Motor' || plan.category === 'Home' || plan.category === 'Travel';
      } else {
        categoryMatch = plan.category === activeFilter || plan.categoryTag === activeFilter;
      }
    }

    // Company filter
    let companyMatch = true;
    if (activeCompanyFilter !== 'ALL') {
      const compLower = (plan.company || '').toLowerCase();
      const targetLower = activeCompanyFilter.toLowerCase();

      if (targetLower === 'postal office') companyMatch = compLower.includes('postal');
      else if (targetLower === 'future generali') companyMatch = compLower.includes('future') || compLower.includes('generali');
      else if (targetLower === 'bajaj') companyMatch = compLower.includes('bajaj');
      else if (targetLower === 'aditya birla') companyMatch = compLower.includes('aditya') || compLower.includes('birla');
      else if (targetLower === 'oriental insurance') companyMatch = compLower.includes('oriental');
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

    // Text search query filter
    let searchMatch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (plan.name || '').toLowerCase();
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
      setWizardStep(2); // success view
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title Header */}
      <div className="text-center mb-8">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#f97316] bg-[#f97316]/10 rounded-full border border-[#f97316]/20">
          {t('tailored_offerings')}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 dark:text-white mt-3 tracking-tight">
          Corporate & Personal Insurance Packages
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2.5 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Browse our premium catalog of standard and comprehensive plans. Filter policies and start your digital application instantly.
        </p>
      </div>

      {/* Instant Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search plan name or company e.g. SBI, Postal, HDFC, Health..."
            className="w-full px-5 py-3.5 pl-11 pr-10 text-sm font-medium rounded-2xl bg-white dark:bg-navy-900 border border-slate-300/80 dark:border-white/10 text-navy-950 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f97316] shadow-sm transition-all"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 1. Category Filters strip */}
      <div className="flex justify-center mb-6">
        <Filters
          options={filterOptions}
          activeFilter={activeFilter}
          onChange={setActiveFilter}
        />
      </div>

      {/* 2. List of All 16 Insurance Companies strip */}
      <div className="mb-10 text-center space-y-2.5">
        <div className="flex items-center justify-center space-x-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
          <FaBriefcase className="text-[#f97316] text-xs" />
          <span>Select Partner Insurer (All 16 Leading Companies Available Below)</span>
        </div>

        <div className="p-2.5 bg-slate-200/70 dark:bg-navy-900/80 backdrop-blur-xl rounded-2xl border border-slate-300/60 dark:border-white/10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-6xl mx-auto shadow-inner">
          {ALL_SIXTEEN_COMPANIES.map((comp) => {
            const isActive = activeCompanyFilter === comp.value;
            return (
              <button
                key={comp.value}
                onClick={() => setActiveCompanyFilter(comp.value)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 via-[#f97316] to-amber-500 text-white shadow-md font-extrabold scale-[1.03] border border-amber-300/50'
                    : 'bg-white/60 dark:bg-navy-950/40 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-navy-800/80 border border-transparent hover:border-slate-300/60 dark:hover:border-white/10'
                }`}
              >
                <span className="text-xs">{comp.emblem}</span>
                <span>{comp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Plans Cards Grid */}
      {finalFilteredPlans.length === 0 ? (
        <div className="text-center py-12 p-8 bg-white dark:bg-navy-900 rounded-3xl border border-slate-200/50 dark:border-white/5 space-y-3">
          <FaShieldAlt className="text-4xl text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-950 dark:text-white">No Matching Insurance Policies Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No active policies match your query. Try clearing the search or clicking "All Insurers (16)" to view all available offerings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {finalFilteredPlans.map((plan) => {
            return (
              <div
                key={plan.id}
                className="bg-white dark:bg-navy-950 rounded-[32px] p-6 sm:p-7 flex flex-col justify-between border border-slate-200/50 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 text-left relative overflow-hidden group"
              >
                <div>
                  {/* Logo alignment centered - wide horizontal box to make logo big and completely visible */}
                  <div className="flex justify-center w-full pb-4">
                    <div className="w-48 h-20 sm:w-56 sm:h-24 flex items-center justify-center bg-white p-1 rounded-2xl">
                      <CompanyLogo company={plan.company} />
                    </div>
                  </div>

                  {/* Badges centered below logo */}
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#ea580c] bg-orange-50 dark:bg-navy-900/50 border border-orange-200/50 dark:border-white/10 px-3 py-1 rounded-full">
                      {plan.categoryTag || plan.category}
                    </span>
                    {plan.badge && (
                      <span className="bg-[#f97316] text-white font-extrabold text-[9px] uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  {/* Centered Plan Name */}
                  <h3 className="text-xl sm:text-2xl font-black text-center text-navy-950 dark:text-white mt-4 tracking-tight leading-tight group-hover:text-[#f97316] transition-colors duration-300">
                    {plan.name}
                  </h3>

                  {/* Plan Description with left border accent */}
                  <div className="pl-4 border-l-2 border-slate-200 dark:border-white/10 mt-4 text-left">
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {plan.description}
                    </p>
                  </div>

                  {/* coverage amount and starting premium stacked left-aligned */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-extrabold tracking-wider leading-none">
                        {plan.coverageLabel || 'GLOBAL COVER'}
                      </p>
                      <p className="text-navy-950 dark:text-white font-black text-2xl mt-1.5 font-sans">
                        {plan.coverageAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-extrabold tracking-wider leading-none">
                        STARTING PREMIUM
                      </p>
                      <p className="text-[#f97316] dark:text-amber-400 font-black text-3xl mt-1.5 font-sans">
                        {plan.premiumStartsFrom || `₹${plan.premiumMonthly}/month*`}
                      </p>
                    </div>
                  </div>

                  {/* Divider line */}
                  <hr className="border-slate-200/50 dark:border-white/5 my-5" />

                  {/* Included Features */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-navy-950 dark:text-white">Included Features:</p>
                    <ul className="space-y-3">
                      {plan.features && plan.features.map((f, idx) => {
                        let iconBadge = "🛡️";
                        const lowerF = f.toLowerCase();
                        if (lowerF.includes('medical') || lowerF.includes('hospital') || lowerF.includes('health') || lowerF.includes('cashless')) iconBadge = "🩺";
                        else if (lowerF.includes('tax') || lowerF.includes('save') || lowerF.includes('savings')) iconBadge = "💳";
                        else if (lowerF.includes('payout') || lowerF.includes('premium') || lowerF.includes('flexible')) iconBadge = "⚙️";
                        else if (lowerF.includes('evacuation') || lowerF.includes('travel') || lowerF.includes('flight')) iconBadge = "🚁";
                        else if (lowerF.includes('rider') || lowerF.includes('protection') || lowerF.includes('accident')) iconBadge = "🔒";
                        else if (lowerF.includes('billing') || lowerF.includes('clinics')) iconBadge = "🏥";
                        else if (lowerF.includes('delay') || lowerF.includes('refund')) iconBadge = "⏱️";
                        else if (lowerF.includes('passport') || lowerF.includes('legal')) iconBadge = "💼";

                        return (
                          <li key={idx} className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                            <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-navy-900 flex items-center justify-center shrink-0 text-sm shadow-sm border border-slate-200/40 dark:border-white/5">
                              {iconBadge}
                            </span>
                            <span>{f}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Divider line before button */}
                <hr className="border-slate-200/50 dark:border-white/5 my-5" />

                {/* Apply Now Button */}
                <div>
                  <button
                    className="w-full bg-gradient-to-r from-orange-500 via-[#f97316] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                    onClick={() => handleApply(plan)}
                  >
                    <span>Apply Now</span>
                    <span className="text-white/80 tracking-tighter">»</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Indicative Disclaimer */}
      <div className="mt-12 p-4 bg-slate-100 dark:bg-navy-900/60 rounded-2xl border border-slate-200/60 dark:border-white/5 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          * <strong>Disclaimer:</strong> Premiums shown are indicative only and may vary based on age, health, occupation, policy term, underwriting, and other eligibility criteria.
        </p>
      </div>

      {/* Apply Wizard Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={selectedPlan ? `Policy Application: ${selectedPlan.name}` : ''}
        size="md"
      >
        {wizardStep === 1 ? (
          <form onSubmit={handleWizardSubmit} className="space-y-4 pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please provide details below to configure and request policy underwriting approval.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Legal Name</label>
                <input required type="text" placeholder="Your Name" className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                <input required type="email" placeholder="Enter Email" className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mobile Phone</label>
                <input required type="tel" placeholder="Phone Number" className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Date of Birth</label>
                <input required type="date" className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Upload ID Copy (Passport/Driver License)</label>
              <div className="p-4 border border-dashed border-slate-300 dark:border-white/10 rounded-lg text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-900">
                <span className="text-[10px] text-slate-400">Click to upload document file (PDF/JPEG)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-navy-900 border border-slate-200/50 dark:border-white/5 rounded-xl text-xs space-y-1">
              <p className="font-bold text-navy-950 dark:text-white">Premium Quote Outline</p>
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Premium:</span>
                <span className="font-bold text-gold-500">₹{selectedPlan?.premiumMonthly}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Standard Sum Assured:</span>
                <span className="font-bold text-navy-950 dark:text-white">₹{selectedPlan?.coverageAmount}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowApplyModal(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" variant="gold" loading={isSubmitting}>Submit Application</Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 text-3xl mb-2 animate-pulse">
              <FaCheckCircle />
            </div>
            <h3 className="text-lg font-bold text-navy-950 dark:text-white">Application Received!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your application has been logged in our system. A verification case has been assigned to the **Employee Dashboard** queue. You can track progress instantly.
            </p>
            <Button variant="primary" onClick={() => setShowApplyModal(false)}>Close Wizard</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default Plans;
