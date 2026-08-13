import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';

// Animated Counter Component
const AnimatedCounter = ({ value, prefix = "", suffix = "" }) => {
  const ref = useRef(null);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) {
          ref.current.textContent = prefix + Math.round(v).toLocaleString('en-IN') + suffix;
        }
      }
    });
    return () => controls.stop();
  }, [value, prefix, suffix]);
  return <span ref={ref}>{prefix}{value.toLocaleString('en-IN')}{suffix}</span>;
};

import { useTranslation } from '../../context/LanguageContext';
import { saveCalculation } from '../../services/api';
import { FaCalculator, FaShieldAlt, FaCalendarAlt, FaUserCheck, FaCar, FaHome, FaHeartbeat, FaPlane, FaDollarSign } from 'react-icons/fa';

/* ─── Styled Range Slider ─── */
const PremiumSlider = ({ min, max, step, value, onChange, leftLabel, rightLabel, displayValue }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{leftLabel || ''}</span>
      <span className="text-xl font-bold text-black dark:text-white">
        {displayValue}
      </span>
    </div>
    <div className="relative group">
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-neutral-200 dark:bg-neutral-800
        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FFB300] dark:[&::-webkit-slider-thumb]:bg-[#FFB300]
        [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black
        [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
        [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#FFB300] dark:[&::-moz-range-thumb]:bg-[#FFB300]
        [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black
        [background:linear-gradient(to_right,#FFB300_0%,#FFB300_var(--fill),#E5E5E5_var(--fill),#E5E5E5_100%)]
        dark:[background:linear-gradient(to_right,#FFB300_0%,#FFB300_var(--fill),#262626_var(--fill),#262626_100%)]"
        style={{ "--fill": `${((value - min) / (max - min)) * 100}%` }}
      />
    </div>
    {(leftLabel !== undefined || rightLabel !== undefined) && (
      <div className="flex justify-between text-[10px] text-neutral-400 dark:text-neutral-500 font-medium tracking-wider">
        <span>{min.toLocaleString('en-IN')}</span>
        <span>{max.toLocaleString('en-IN')}</span>
      </div>
    )}
  </div>
);

/* ─── Glass Input Field ─── */
const GlassInput = ({ label, children }) => (
  <div>
    <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">{label}</label>
    {children}
  </div>
);

const inputClasses = "w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#FFB300] dark:focus:border-[#FFB300]/50 focus:ring-1 focus:ring-[#FFB300]/30 dark:focus:ring-[#FFB300]/20 text-sm font-semibold text-black dark:text-white transition-all duration-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 hover:border-black/20 dark:hover:border-white/20";
const selectClasses = inputClasses;

/* ─── Glass Toggle ─── */
const GlassToggle = ({ label, sublabel, checked, onChange }) => (
  <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
    checked 
      ? 'bg-[#FFB300]/10 dark:bg-[#FFB300]/5 border-[#FFB300]/40 dark:border-[#FFB300]/30' 
      : 'bg-white dark:bg-[#0A0A0A] border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.02] dark:hover:bg-[#111111]'
  }`}>
    <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${checked ? 'bg-[#FFB300] dark:bg-[#FFB300]' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
      <span className={`inline-block h-3 w-3 transform rounded-full bg-white dark:bg-black transition duration-200 ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </div>
    <div>
      <p className={`text-sm font-bold transition-colors ${checked ? 'text-black dark:text-white' : 'text-neutral-600 dark:text-neutral-300'}`}>{label}</p>
      {sublabel && <p className="text-xs text-neutral-500 mt-0.5 tracking-wide">{sublabel}</p>}
    </div>
  </label>
);

/* ─── Condition Chip ─── */
const ConditionChip = ({ label, checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all duration-200 ${
      checked
        ? 'bg-[#FFB300]/15 dark:bg-[#FFB300]/10 border-[#FFB300]/50 dark:border-[#FFB300]/40 text-[#FFB300] dark:text-[#FFB300]'
        : 'bg-white dark:bg-[#0A0A0A] border-black/10 dark:border-white/10 text-neutral-500 dark:text-neutral-400 hover:border-black/20 dark:hover:border-white/20 hover:text-neutral-800 dark:hover:text-neutral-200'
    }`}
  >
    {checked && <span className="mr-1.5">✓</span>}
    {label}
  </button>
);


export const Calculator = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState('health');
  const [premium, setPremium] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [successBuy, setSuccessBuy] = useState(false);
  const [buyName, setBuyName] = useState('');
  const [buyEmail, setBuyEmail] = useState('');

  // Common inputs
  const [coverage, setCoverage] = useState(500000);
  const [deductible, setDeductible] = useState(500);

  // Health inputs
  const [age, setAge] = useState(30);
  const [smoker, setSmoker] = useState(false);
  const [medicalConditions, setMedicalConditions] = useState({
    diabetes: false,
    highBp: false,
    asthma: false,
    heartDisease: false,
    kidneyDisease: false,
  });
  
  const [healthBreakdown, setHealthBreakdown] = useState({
    base: 0,
    ageAdj: 0,
    tobaccoLoad: 0,
    medicalLoad: 0,
    deductibleDiscount: 0,
    annualPremium: 0,
    monthlyPremium: 0,
    riskLevel: 'Low',
  });

  // Motor inputs
  const [vehicleValue, setVehicleValue] = useState(250000);
  const [vehicleAge, setVehicleAge] = useState(1);
  const [roadsideAssistance, setRoadsideAssistance] = useState(false);

  // Life inputs
  const [termYears, setTermYears] = useState(20);
  const [annualIncome, setAnnualIncome] = useState(800000);

  // Home inputs
  const [homeValue, setHomeValue] = useState(3000000);
  const [homeAge, setHomeAge] = useState(5);

  // Travel inputs
  const [duration, setDuration] = useState(10);
  const [destination, setDestination] = useState('worldwide');

  // SIP inputs
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipReturnRate, setSipReturnRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  const [sipResults, setSipResults] = useState({ invested: 0, gain: 0, total: 0 });

  // Perform premium calculations on change
  useEffect(() => {
    let base = 0;

    if (category === 'health') {
      const getBasePremium = (cov) => {
        if (cov <= 100000) return 2000;
        if (cov <= 200000) return 2000 + ((cov - 100000) / 100000) * (3200 - 2000);
        if (cov <= 500000) return 3200 + ((cov - 200000) / 300000) * (5500 - 3200);
        if (cov <= 1000000) return 5500 + ((cov - 500000) / 500000) * (8500 - 5500);
        if (cov <= 2000000) return 8500 + ((cov - 1000000) / 1000000) * (14000 - 8500);
        if (cov <= 5000000) return 14000 + ((cov - 2000000) / 3000000) * (25000 - 14000);
        return 25000;
      };

      const basePrem = getBasePremium(coverage);

      let ageMult = 1;
      if (age <= 25) ageMult = 0.85;
      else if (age <= 35) ageMult = 1.00;
      else if (age <= 45) ageMult = 1.25;
      else if (age <= 55) ageMult = 1.60;
      else if (age <= 65) ageMult = 2.20;
      else ageMult = 3.00;

      const tobMult = smoker ? 1.35 : 1.0;

      let dedMult = 1.0;
      if (deductible === 500) dedMult = 1.15;
      else if (deductible === 2500) dedMult = 1.05;
      else if (deductible === 5000) dedMult = 1.00;
      else if (deductible === 10000) dedMult = 0.90;
      else if (deductible === 25000) dedMult = 0.80;

      let condMult = 0;
      if (medicalConditions.diabetes) condMult += 0.15;
      if (medicalConditions.highBp) condMult += 0.10;
      if (medicalConditions.asthma) condMult += 0.10;
      if (medicalConditions.heartDisease) condMult += 0.30;
      if (medicalConditions.kidneyDisease) condMult += 0.25;
      
      condMult = Math.min(condMult, 0.65);
      const finalCondMult = 1 + condMult;

      const activeConds = Object.values(medicalConditions).filter(Boolean).length;
      let riskLevel = 'Low';
      if (age > 65 && activeConds > 1) riskLevel = 'Very High';
      else if (smoker || activeConds > 1) riskLevel = 'High';
      else if (age > 35 || activeConds === 1) riskLevel = 'Moderate';

      const ageAdj = (basePrem * ageMult) - basePrem;
      const tobLoad = (basePrem * ageMult * tobMult) - (basePrem * ageMult);
      const dedDiscount = (basePrem * ageMult * tobMult * dedMult) - (basePrem * ageMult * tobMult);
      const medLoad = (basePrem * ageMult * tobMult * dedMult * finalCondMult) - (basePrem * ageMult * tobMult * dedMult);

      const rBase = Math.round(basePrem);
      const rAgeAdj = Math.round(ageAdj);
      const rTobLoad = Math.round(tobLoad);
      const rDedDiscount = Math.round(dedDiscount);
      const rMedLoad = Math.round(medLoad);

      const annualPrem = rBase + rAgeAdj + rTobLoad + rDedDiscount + rMedLoad;
      const roundedAnnual = Math.round(annualPrem / 100) * 100;
      const monthlyPrem = Math.round(roundedAnnual / 12);

      setHealthBreakdown({
        base: rBase,
        ageAdj: rAgeAdj,
        tobaccoLoad: rTobLoad,
        deductibleDiscount: rDedDiscount,
        medicalLoad: rMedLoad,
        annualPremium: roundedAnnual,
        monthlyPremium: monthlyPrem,
        riskLevel
      });
      
      setPremium(monthlyPrem);
    }
    else if (category === 'life') {
      base = (coverage * 0.00005);
      base += (age * 0.5);
      base += (termYears * 0.3);
      if (smoker) base *= 1.5;
      if (annualIncome > 1000000) base *= 0.9;
      setPremium(Math.max(100, Math.round(base)));
    }
    else if (category === 'motor') {
      base = (vehicleValue * 0.015);
      if (vehicleAge > 5) base *= 0.7;
      else if (vehicleAge > 2) base *= 0.9;

      if (roadsideAssistance) base += 350;
      base -= (deductible * 0.05);
      base = base / 12;
      setPremium(Math.max(100, Math.round(base)));
    }
    else if (category === 'home') {
      base = (homeValue * 0.0008);
      if (homeAge > 20) base *= 1.3;
      base = base / 12;
      setPremium(Math.max(100, Math.round(base)));
    }
    else if (category === 'travel') {
      base = duration * 25;
      if (destination === 'worldwide') base += 200;
      if (deductible > 1000) base -= 50;
      setPremium(Math.max(100, Math.round(base)));
    }

  }, [category, coverage, deductible, age, smoker, medicalConditions, vehicleValue, vehicleAge, roadsideAssistance, termYears, annualIncome, homeValue, homeAge, duration, destination]);

  useEffect(() => {
    if (category === 'sip') {
      const P = sipMonthly;
      const r = sipReturnRate;
      const y = sipYears;
      const monthlyRate = r / (12 * 100);
      const totalMonths = y * 12;
      const fv = P * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      const invested = P * totalMonths;
      const total = Math.round(fv);
      const gain = Math.max(0, total - invested);
      setSipResults({ invested, gain, total });
    }
  }, [category, sipMonthly, sipReturnRate, sipYears]);

  const handlePurchaseMock = async (e) => {
    e.preventDefault();
    const record = {
      fullName: buyName,
      email: buyEmail,
      category,
      premiumMonthly: category === 'sip' ? sipMonthly : premium,
      deductible: category === 'sip' ? 0 : deductible,
      tenureYears: category === 'sip' ? sipYears : (category === 'life' ? termYears : 1),
      coverageAmount: category === 'sip' ? 'Market Linked' : coverage.toString(),
      timestamp: new Date().toISOString()
    };
    try {
      await saveCalculation(record);
    } catch (err) {
      console.error("Failed to save calculation history to Firestore", err);
    }
    setSuccessBuy(true);
    setTimeout(() => {
      setSuccessBuy(false);
      setShowBuyModal(false);
      setBuyName('');
      setBuyEmail('');
    }, 2500);
  };

  const categories = [
    { id: 'health', label: 'Health', icon: FaHeartbeat },
    { id: 'life', label: 'Life', icon: FaShieldAlt },
    { id: 'motor', label: 'Motor', icon: FaCar },
    { id: 'home', label: 'Home', icon: FaHome },
    { id: 'travel', label: 'Travel', icon: FaPlane },
    { id: 'sip', label: 'SIP Calc', icon: FaCalculator }
  ];

  /* ─── Helper to get dynamic output info per category ─── */
  const getOutputMeta = () => {
    switch (category) {
      case 'health':
        return { title: 'Annual Premium', value: healthBreakdown.annualPremium, sub: `₹${healthBreakdown.monthlyPremium.toLocaleString('en-IN')} / mo`, isSip: false };
      case 'life':
        return { title: 'Monthly Premium', value: premium, sub: `Coverage: ₹${coverage.toLocaleString('en-IN')}`, isSip: false };
      case 'motor':
        return { title: 'Monthly Premium', value: premium, sub: `IDV: ₹${vehicleValue.toLocaleString('en-IN')}`, isSip: false };
      case 'home':
        return { title: 'Monthly Premium', value: premium, sub: `Property: ₹${homeValue.toLocaleString('en-IN')}`, isSip: false };
      case 'travel':
        return { title: 'Trip Premium', value: premium, sub: `${duration} days · ${destination === 'worldwide' ? 'Worldwide' : 'Domestic'}`, isSip: false };
      case 'sip':
        return { title: 'Future Value', value: sipResults.total, sub: `After ${sipYears} Years`, isSip: true };
      default:
        return { title: 'Premium', value: premium, sub: '', isSip: false };
    }
  };

  const riskColors = {
    'Low': { bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/25' },
    'Moderate': { bg: 'bg-amber-500/10 dark:bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/25' },
    'High': { bg: 'bg-orange-500/10 dark:bg-orange-500/15', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/25' },
    'Very High': { bg: 'bg-red-500/10 dark:bg-red-500/15', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/25' },
  };

  const risk = riskColors[healthBreakdown.riskLevel] || riskColors['Low'];


  return (
    <div className="min-h-screen bg-[#F7F7F5] dark:bg-[#000000] text-black dark:text-white pt-24 pb-32 xl:pb-24 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Title ── */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl md:text-4xl uppercase font-bold tracking-tight mb-4 text-black dark:text-white">
              PREMIUM <span className="text-[#FFB300]">CALCULATOR</span>
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
              Estimate your insurance premiums and investment returns instantly.
            </p>
          </motion.div>
        </div>

        {/* ── Category Selection ── */}
        <div className="mb-10">
          {/* Mobile Dropdown */}
          <div className="block sm:hidden w-full max-w-sm mx-auto">
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none w-full bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 text-black dark:text-white text-sm font-bold rounded-xl px-4 py-3.5 pr-10 focus:outline-none focus:border-black/30 dark:focus:border-white/30 transition-colors shadow-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-4 h-4 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:flex justify-center overflow-x-auto pb-4">
            <div className="inline-flex gap-2 p-1.5 bg-white dark:bg-[#0A0A0A] rounded-xl border border-black/10 dark:border-white/10 shadow-sm dark:shadow-none">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`relative flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors duration-200 rounded-lg whitespace-nowrap ${
                      isActive ? 'text-black dark:text-black' : 'text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#FFB300] dark:bg-[#FFB300] rounded-lg"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    <Icon className={`text-sm relative z-10 ${isActive ? 'text-black dark:text-black' : ''}`} />
                    <span className="relative z-10">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* ── Left Panel: Inputs ── */}
          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm dark:shadow-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >

                  
                  {/* ═══ HEALTH ═══ */}
                  {category === 'health' && (
                    <>
                      <PremiumSlider
                        min={100000} max={5000000} step={100000}
                        value={coverage} onChange={setCoverage}
                        leftLabel="Coverage Limit"
                        displayValue={`₹${coverage.toLocaleString('en-IN')}`}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <GlassInput label="Age of Insured">
                          <input type="number" min="18" max="100" value={age} onChange={(e) => setAge(Number(e.target.value))} className={inputClasses} />
                        </GlassInput>
                        <GlassInput label="Deductible">
                          <select value={deductible} onChange={(e) => setDeductible(Number(e.target.value))} className={selectClasses}>
                            <option value="500">₹500</option>
                            <option value="2500">₹2,500</option>
                            <option value="5000">₹5,000</option>
                            <option value="10000">₹10,000</option>
                            <option value="25000">₹25,000</option>
                          </select>
                        </GlassInput>
                      </div>
                      
                      <GlassToggle
                        label="Tobacco User"
                        sublabel="Increases premium by ~35%"
                        checked={smoker}
                        onChange={(e) => setSmoker(e.target ? e.target.checked : e)}
                      />

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-3">Pre-Existing Conditions</label>
                        <div className="flex flex-wrap gap-2.5">
                          {[
                            { key: 'diabetes', label: 'Diabetes' },
                            { key: 'highBp', label: 'High BP' },
                            { key: 'asthma', label: 'Asthma' },
                            { key: 'heartDisease', label: 'Heart Disease' },
                            { key: 'kidneyDisease', label: 'Kidney Disease' },
                          ].map((cond) => (
                            <ConditionChip
                              key={cond.key}
                              label={cond.label}
                              checked={medicalConditions[cond.key]}
                              onChange={(val) => setMedicalConditions(prev => ({ ...prev, [cond.key]: val }))}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* ═══ LIFE ═══ */}
                  {category === 'life' && (
                    <>
                      <PremiumSlider
                        min={1000000} max={50000000} step={500000}
                        value={coverage} onChange={setCoverage}
                        leftLabel="Term Payout Target"
                        displayValue={`₹${coverage.toLocaleString('en-IN')}`}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <GlassInput label="Age">
                          <input type="number" min="18" max="75" value={age} onChange={(e) => setAge(Number(e.target.value))} className={inputClasses} />
                        </GlassInput>
                        <GlassInput label="Term (Years)">
                          <select value={termYears} onChange={(e) => setTermYears(Number(e.target.value))} className={selectClasses}>
                            <option value="10">10 Years</option>
                            <option value="20">20 Years</option>
                            <option value="30">30 Years</option>
                            <option value="40">40 Years</option>
                          </select>
                        </GlassInput>
                        <GlassInput label="Annual Income (₹)">
                          <input type="number" step="100000" value={annualIncome} onChange={(e) => setAnnualIncome(Number(e.target.value))} className={inputClasses} />
                        </GlassInput>
                      </div>
                      
                      <div className="w-full md:w-1/2">
                        <GlassToggle
                          label="Tobacco User"
                          sublabel="Impacts Life Cover Premiums"
                          checked={smoker}
                          onChange={(e) => setSmoker(e.target ? e.target.checked : e)}
                        />
                      </div>
                    </>
                  )}

                  {/* ═══ MOTOR ═══ */}
                  {category === 'motor' && (
                    <>
                      <PremiumSlider
                        min={50000} max={5000000} step={50000}
                        value={vehicleValue} onChange={setVehicleValue}
                        leftLabel="Vehicle IDV (Value)"
                        displayValue={`₹${vehicleValue.toLocaleString('en-IN')}`}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <GlassInput label="Vehicle Age">
                          <select value={vehicleAge} onChange={(e) => setVehicleAge(Number(e.target.value))} className={selectClasses}>
                            <option value="0">Brand New (&lt; 1 Year)</option>
                            <option value="1">1 - 2 Years</option>
                            <option value="3">2 - 5 Years</option>
                            <option value="6">5+ Years</option>
                          </select>
                        </GlassInput>
                        <GlassInput label="Deductible">
                          <select value={deductible} onChange={(e) => setDeductible(Number(e.target.value))} className={selectClasses}>
                            <option value="1000">₹1,000</option>
                            <option value="2500">₹2,500</option>
                            <option value="5000">₹5,000</option>
                          </select>
                        </GlassInput>
                      </div>

                      <div className="w-full md:w-1/2">
                        <GlassToggle
                          label="Roadside Assistance"
                          sublabel="Towing, battery jump, etc."
                          checked={roadsideAssistance}
                          onChange={(e) => setRoadsideAssistance(e.target ? e.target.checked : e)}
                        />
                      </div>
                    </>
                  )}

                  {/* ═══ HOME ═══ */}
                  {category === 'home' && (
                    <>
                      <PremiumSlider
                        min={500000} max={50000000} step={500000}
                        value={homeValue} onChange={setHomeValue}
                        leftLabel="Structure Insured Value"
                        displayValue={`₹${homeValue.toLocaleString('en-IN')}`}
                      />

                      <div className="w-full md:w-1/2">
                        <GlassInput label="Property Age (Years)">
                          <input type="number" min="0" max="100" value={homeAge} onChange={(e) => setHomeAge(Number(e.target.value))} className={inputClasses} />
                        </GlassInput>
                      </div>
                    </>
                  )}

                  {/* ═══ TRAVEL ═══ */}
                  {category === 'travel' && (
                    <>
                      <PremiumSlider
                        min={1} max={90} step={1}
                        value={duration} onChange={setDuration}
                        leftLabel="Trip Duration"
                        displayValue={`${duration} Days`}
                      />

                      <div className="w-full md:w-1/2">
                        <GlassInput label="Destination Tier">
                          <select value={destination} onChange={(e) => setDestination(e.target.value)} className={selectClasses}>
                            <option value="domestic">Domestic / Regional</option>
                            <option value="worldwide">Worldwide / Global</option>
                          </select>
                        </GlassInput>
                      </div>
                    </>
                  )}

                  {/* ═══ SIP ═══ */}
                  {category === 'sip' && (
                    <>
                      <PremiumSlider
                        min={500} max={100000} step={500}
                        value={sipMonthly} onChange={setSipMonthly}
                        leftLabel="Monthly SIP"
                        displayValue={`₹${sipMonthly.toLocaleString('en-IN')}`}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <PremiumSlider
                          min={5} max={30} step={0.5}
                          value={sipReturnRate} onChange={setSipReturnRate}
                          leftLabel="Expected ROI"
                          displayValue={`${sipReturnRate}%`}
                        />
                        <PremiumSlider
                          min={1} max={30} step={1}
                          value={sipYears} onChange={setSipYears}
                          leftLabel="Tenure"
                          displayValue={`${sipYears} Yrs`}
                        />
                      </div>
                    </>
                  )}


                  

                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right Panel: Output ── */}
          <div className="relative">
            <div className="sticky top-28 bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-2xl p-7 shadow-md dark:shadow-lg">
              
              {category === 'sip' ? (
                /* SIP Output */
                <div className="text-center">
                  <h3 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-6">Wealth Created</h3>
                  
                  <div className="mb-8 p-6 bg-black/[0.02] dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-xl">
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-bold mb-2">Future Value</p>
                    <div className="flex items-baseline justify-center text-black dark:text-white mb-2">
                      <span className="text-xl font-bold text-[#FFB300] dark:text-[#FFB300] mr-1">₹</span>
                      <span className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        {sipResults.total > 10000000 ? (sipResults.total/10000000).toFixed(2) + 'Cr' : (sipResults.total/100000).toFixed(2) + 'L'}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#FFB300] dark:text-[#FFB300] uppercase tracking-widest font-bold px-3 py-1 rounded bg-[#FFB300]/15 dark:bg-[#FFB300]/10 border border-[#FFB300]/30 dark:border-[#FFB300]/20 inline-block">
                      After {sipYears} Years
                    </p>
                  </div>

                  <div className="space-y-3 text-left mb-8">
                    <div className="flex justify-between items-center text-sm py-3 px-4 rounded-lg bg-black/[0.02] dark:bg-[#111111] border border-black/5 dark:border-white/5">
                      <span className="text-neutral-500 dark:text-neutral-400">Invested Amount</span>
                      <span className="font-bold text-black dark:text-white">₹{sipResults.invested.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-3 px-4 rounded-lg bg-black/[0.02] dark:bg-[#111111] border border-black/5 dark:border-white/5">
                      <span className="text-neutral-500 dark:text-neutral-400">Est. Returns</span>
                      <span className="font-bold text-[#FFB300] dark:text-[#FFB300]">₹{sipResults.gain.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowBuyModal(true)}
                    className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 text-sm uppercase tracking-widest rounded-xl hover:bg-[#FFB300] dark:hover:bg-[#FFB300] hover:text-black dark:hover:text-black transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCalculator /> Setup Auto-SIP
                  </button>
                </div>
              ) : category === 'health' ? (
                /* Health Output */
                <div className="text-center">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Estimated Premium</h3>
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${risk.bg} ${risk.border} border ${risk.text}`}>
                      {healthBreakdown.riskLevel} Risk
                    </span>
                  </div>
                  
                  <div className="mb-8 p-6 bg-black/[0.02] dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-xl">
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-bold mb-2">Annual Premium</p>
                    <div className="flex items-baseline justify-center text-black dark:text-white mb-3">
                      <span className="text-xl font-bold text-[#FFB300] dark:text-[#FFB300] mr-1">₹</span>
                      <span className="text-5xl font-extrabold tracking-tight">
                        <AnimatedCounter value={healthBreakdown.annualPremium} />
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      <AnimatedCounter value={healthBreakdown.monthlyPremium} prefix="₹" suffix=" / mo" />
                    </p>
                  </div>

                  <div className="space-y-2 text-left mb-8">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Premium Breakdown</p>
                    
                    <div className="flex justify-between items-center text-xs py-2 px-3 rounded bg-black/[0.02] dark:bg-[#111111]">
                      <span className="text-neutral-500 dark:text-neutral-400">Base Cover</span>
                      <span className="font-bold text-black dark:text-white">₹{healthBreakdown.base.toLocaleString('en-IN')}</span>
                    </div>
                    {healthBreakdown.ageAdj !== 0 && (
                      <div className="flex justify-between items-center text-xs py-2 px-3 rounded bg-black/[0.02] dark:bg-[#111111]">
                        <span className="text-neutral-500 dark:text-neutral-400">Age Adjustment</span>
                        <span className={`font-bold ${healthBreakdown.ageAdj > 0 ? 'text-black dark:text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {healthBreakdown.ageAdj > 0 ? '+' : ''}₹{healthBreakdown.ageAdj.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    {healthBreakdown.tobaccoLoad !== 0 && (
                      <div className="flex justify-between items-center text-xs py-2 px-3 rounded bg-black/[0.02] dark:bg-[#111111]">
                        <span className="text-neutral-500 dark:text-neutral-400">Tobacco Loading</span>
                        <span className="font-bold text-black dark:text-white">+₹{healthBreakdown.tobaccoLoad.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {healthBreakdown.medicalLoad !== 0 && (
                      <div className="flex justify-between items-center text-xs py-2 px-3 rounded bg-black/[0.02] dark:bg-[#111111]">
                        <span className="text-neutral-500 dark:text-neutral-400">Medical History</span>
                        <span className="font-bold text-black dark:text-white">+₹{healthBreakdown.medicalLoad.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {healthBreakdown.deductibleDiscount !== 0 && (
                      <div className="flex justify-between items-center text-xs py-2 px-3 rounded bg-black/[0.02] dark:bg-[#111111]">
                        <span className="text-neutral-500 dark:text-neutral-400">Deductible Adj.</span>
                        <span className={`font-bold ${healthBreakdown.deductibleDiscount > 0 ? 'text-black dark:text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {healthBreakdown.deductibleDiscount > 0 ? '+' : ''}₹{healthBreakdown.deductibleDiscount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => setShowBuyModal(true)}
                    className="w-full bg-[#FFB300] dark:bg-[#FFB300] text-black font-bold py-4 text-sm uppercase tracking-widest rounded-xl hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors flex items-center justify-center gap-2 mb-4"
                  >
                    <FaShieldAlt /> Secure Now
                  </button>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-600 font-medium px-2">
                    Estimated premium based on general underwriting.
                  </p>
                </div>
              ) : (
                /* Generic Output */
                <div className="text-center">
                  <h3 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-6">{getOutputMeta().title}</h3>
                  
                  <div className="mb-8 p-6 bg-black/[0.02] dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-xl">
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-bold mb-2">
                      {category === 'travel' ? 'Total Trip Premium' : 'INR / Month'}
                    </p>
                    <div className="flex items-baseline justify-center text-black dark:text-white">
                      <span className="text-xl font-bold text-[#FFB300] dark:text-[#FFB300] mr-1">₹</span>
                      <span className="text-5xl font-extrabold tracking-tight">
                        <AnimatedCounter value={premium} />
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-left mb-8">
                    <div className="flex justify-between items-center text-sm py-3 px-4 rounded-lg bg-black/[0.02] dark:bg-[#111111] border border-black/5 dark:border-white/5">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {category === 'motor' ? 'Vehicle IDV' : category === 'home' ? 'Property Value' : category === 'travel' ? 'Duration' : 'Coverage'}
                      </span>
                      <span className="font-bold text-black dark:text-white">
                        {category === 'motor' ? `₹${vehicleValue.toLocaleString('en-IN')}` :
                         category === 'home' ? `₹${homeValue.toLocaleString('en-IN')}` :
                         category === 'travel' ? `${duration} Days` :
                         `₹${coverage.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-3 px-4 rounded-lg bg-black/[0.02] dark:bg-[#111111] border border-black/5 dark:border-white/5">
                      <span className="text-neutral-500 dark:text-neutral-400">Risk Profile</span>
                      <span className="font-bold text-black dark:text-white">Standard</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowBuyModal(true)}
                    className="w-full bg-[#FFB300] dark:bg-[#FFB300] text-black font-bold py-4 text-sm uppercase tracking-widest rounded-xl hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors flex items-center justify-center gap-2"
                  >
                    <FaShieldAlt /> Secure Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Sticky Output Bar ── */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#0A0A0A] border-t border-black/10 dark:border-white/10 p-4 pr-[88px] xl:hidden z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] dark:shadow-none">
        <div className="flex justify-between items-center max-w-7xl mx-auto gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest mb-1 truncate">
              {category === 'sip' ? 'Total Value' : category === 'health' ? 'Annual Prem' : category === 'travel' ? 'Trip Prem' : 'Monthly Prem'}
            </p>
            <p className="text-lg sm:text-xl font-extrabold text-black dark:text-white truncate">
              ₹{category === 'sip' 
                  ? sipResults.total.toLocaleString('en-IN') 
                  : category === 'health' 
                    ? healthBreakdown.annualPremium.toLocaleString('en-IN') 
                    : premium.toLocaleString('en-IN')}
            </p>
          </div>
          <button 
            onClick={() => setShowBuyModal(true)} 
            className="flex-shrink-0 bg-[#FFB300] dark:bg-[#FFB300] text-black px-4 py-2.5 sm:px-6 sm:py-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-colors hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
          >
            {category === 'sip' ? 'Setup SIP' : 'Secure Now'}
          </button>
        </div>
      </div>

      {/* ── Buy Flow Modal ── */}
      <AnimatePresence>
        {showBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm" onClick={() => setShowBuyModal(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden"
            >
              
              <h2 className="text-xl font-bold text-black dark:text-white mb-6 relative z-10">
                {category === 'sip' ? "SIP Auto-Debit Setup" : "Premium Activation"}
              </h2>

              {successBuy ? (
                <div className="text-center py-8 relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFB300]/15 dark:bg-[#FFB300]/10 text-[#FFB300] dark:text-[#FFB300] rounded-2xl mb-4">
                    <FaUserCheck className="text-3xl" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-black dark:text-white mb-2">Activated!</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {category === 'sip' ? 'Your auto-debit SIP mandate is registered.' : 'Your policy has been successfully issued.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePurchaseMock} className="space-y-5 relative z-10">
                  <GlassInput label="Legal Name">
                    <input required type="text" value={buyName} onChange={(e) => setBuyName(e.target.value)} className={inputClasses} placeholder="John Doe" />
                  </GlassInput>
                  <GlassInput label="Email">
                    <input required type="email" value={buyEmail} onChange={(e) => setBuyEmail(e.target.value)} className={inputClasses} placeholder="john@example.com" />
                  </GlassInput>
                  
                  <div className="p-4 bg-black/[0.02] dark:bg-[#111111] border border-black/5 dark:border-white/5 rounded-xl">
                    <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 mb-3 uppercase tracking-widest">Summary</p>
                    <div className="flex justify-between text-sm text-black dark:text-white font-bold mb-1">
                      <span>{category === 'sip' ? 'Monthly SIP' : 'Monthly Premium'}</span>
                      <span className="text-[#FFB300] dark:text-[#FFB300]">₹{category === 'sip' ? sipMonthly.toLocaleString() : premium.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowBuyModal(false)} className="flex-1 py-3 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors rounded-xl hover:bg-black/[0.02] dark:hover:bg-[#111111]">Cancel</button>
                    <button type="submit" className="flex-1 py-3 bg-[#FFB300] dark:bg-[#FFB300] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors">
                      Confirm
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Calculator;
