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
import { Button } from '../../components/ui/Button';
import { saveCalculation } from '../../services/api';
import { Modal } from '../../components/ui/Modal';
import { FaCalculator, FaShieldAlt, FaCalendarAlt, FaUserCheck, FaCar, FaHome, FaHeartbeat, FaPlane, FaDollarSign } from 'react-icons/fa';

/* ─── Mini SVG Donut ─── */
const DonutChart = ({ segments }) => {
  const total = segments.reduce((s, seg) => s + Math.abs(seg.value), 0);
  if (total === 0) return null;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32 mx-auto drop-shadow-[0_0_24px_rgba(246,255,0,0.15)]">
      {segments.map((seg, i) => {
        const pct = Math.abs(seg.value) / total;
        const dashLen = pct * circumference;
        const dashOff = -offset;
        offset += dashLen;
        return (
          <circle
            key={i}
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth="14"
            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
            strokeDashoffset={dashOff}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        );
      })}
      <circle cx="60" cy="60" r="38" fill="rgba(0,0,0,0.6)" />
    </svg>
  );
};

/* ─── Styled Range Slider ─── */
const PremiumSlider = ({ min, max, step, value, onChange, leftLabel, rightLabel, displayValue }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">{leftLabel || ''}</span>
      <span className="text-xl font-bold text-brand-accent drop-shadow-[0_0_12px_rgba(246,255,0,0.35)]">
        {displayValue}
      </span>
    </div>
    <div className="relative group">
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/[0.06] 
        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-accent 
        [&::-webkit-slider-thumb]:shadow-[0_0_14px_rgba(246,255,0,0.5)] [&::-webkit-slider-thumb]:border-2 
        [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:transition-transform 
        [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:hover:scale-125
        [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 
        [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-accent 
        [&::-moz-range-thumb]:shadow-[0_0_14px_rgba(246,255,0,0.5)] [&::-moz-range-thumb]:border-2 
        [&::-moz-range-thumb]:border-black"
        style={{
          background: `linear-gradient(to right, #F6FF00 0%, #F6FF00 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.06) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.06) 100%)`
        }}
      />
    </div>
    {(leftLabel !== undefined || rightLabel !== undefined) && (
      <div className="flex justify-between text-[10px] text-neutral-600 font-medium tracking-wider">
        <span>{min.toLocaleString('en-IN')}</span>
        <span>{max.toLocaleString('en-IN')}</span>
      </div>
    )}
  </div>
);

/* ─── Glass Input Field ─── */
const GlassInput = ({ label, children }) => (
  <div>
    <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-2.5">{label}</label>
    {children}
  </div>
);

const inputClasses = "w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl focus:outline-none focus:border-brand-accent/60 focus:ring-1 focus:ring-brand-accent/30 text-sm font-semibold text-white transition-all duration-200 placeholder:text-neutral-600 hover:border-white/15";

const selectClasses = inputClasses;

/* ─── Glass Toggle ─── */
const GlassToggle = ({ label, sublabel, checked, onChange }) => (
  <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 group ${
    checked 
      ? 'bg-brand-accent/[0.08] border-brand-accent/30 shadow-[0_0_20px_rgba(246,255,0,0.06)]' 
      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04]'
  }`}>
    <div className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 ${checked ? 'bg-brand-accent' : 'bg-white/10'}`}>
      <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
    <div>
      <p className={`text-sm font-semibold transition-colors ${checked ? 'text-brand-accent' : 'text-white group-hover:text-white'}`}>{label}</p>
      <p className="text-[10px] text-neutral-500 mt-0.5 tracking-wide">{sublabel}</p>
    </div>
  </label>
);

/* ─── Condition Chip ─── */
const ConditionChip = ({ label, checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${
      checked
        ? 'bg-brand-accent/15 border-brand-accent/40 text-brand-accent shadow-[0_0_12px_rgba(246,255,0,0.1)]'
        : 'bg-white/[0.03] border-white/[0.06] text-neutral-400 hover:border-white/15 hover:text-neutral-300'
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

  // AI Profiler states
  const [aiAge, setAiAge] = useState('18-35');
  const [aiDependents, setAiDependents] = useState(0);
  const [aiRisk, setAiRisk] = useState('balanced');
  const [aiMonthlyBudget, setAiMonthlyBudget] = useState(5000);

  const getAiRecommendation = () => {
    let healthPercent = 30;
    let lifePercent = 30;
    let motorPercent = 20;
    let investmentPercent = 20;

    // Adjust based on age
    if (aiAge === '18-35') {
      healthPercent = 25;
      lifePercent = 25;
      motorPercent = 20;
      investmentPercent = 30;
    } else if (aiAge === '50+') {
      healthPercent = 50;
      lifePercent = 20;
      motorPercent = 15;
      investmentPercent = 15;
    }

    // Adjust based on dependents
    if (aiDependents > 0) {
      lifePercent += Math.min(aiDependents * 10, 30);
      investmentPercent = Math.max(10, investmentPercent - Math.min(aiDependents * 5, 15));
      healthPercent = Math.max(15, healthPercent - Math.min(aiDependents * 5, 15));
    }

    // Adjust based on risk tolerance
    if (aiRisk === 'conservative') {
      investmentPercent = Math.max(10, investmentPercent - 10);
      healthPercent += 5;
      lifePercent += 5;
    } else if (aiRisk === 'aggressive') {
      investmentPercent = Math.min(50, investmentPercent + 15);
      healthPercent = Math.max(15, healthPercent - 10);
      lifePercent = Math.max(15, lifePercent - 5);
    }

    // Normalize to 100%
    const total = healthPercent + lifePercent + motorPercent + investmentPercent;
    const health = Math.round((healthPercent / total) * 100);
    const life = Math.round((lifePercent / total) * 100);
    const motor = Math.round((motorPercent / total) * 100);
    const investment = 100 - (health + life + motor);

    const healthVal = Math.round((health / 100) * aiMonthlyBudget);
    const lifeVal = Math.round((life / 100) * aiMonthlyBudget);
    const motorVal = Math.round((motor / 100) * aiMonthlyBudget);
    const investmentVal = Math.round((investment / 100) * aiMonthlyBudget);

    return { health, life, motor, investment, healthVal, lifeVal, motorVal, investmentVal };
  };

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
    'Low': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/25' },
    'Moderate': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/25' },
    'High': { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/25' },
    'Very High': { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/25' },
  };

  const risk = riskColors[healthBreakdown.riskLevel] || riskColors['Low'];

  return (
    <div className="min-h-screen bg-[#060810] text-white relative overflow-hidden pt-24 pb-32 xl:pb-24">
      {/* ── Ambient Background ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-accent/[0.04] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Title ── */}
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-brand-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">Smart Insurance Tools</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 text-white">
              Intelligent <span className="bg-gradient-to-r from-brand-accent to-lime-300 bg-clip-text text-transparent">Calculator</span>
            </h1>
            <p className="text-neutral-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
              Calculate premiums, map wealth, and build your portfolio with our cutting-edge engines.
            </p>
          </motion.div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex gap-1.5 p-1.5 bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-x-auto max-w-full">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 rounded-xl whitespace-nowrap ${
                    isActive ? 'text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-brand-accent rounded-xl shadow-[0_0_20px_rgba(246,255,0,0.25)]"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <Icon className={`text-sm relative z-10 ${isActive ? 'text-black' : ''}`} />
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* ── Left Panel: Inputs ── */}
          <div className="xl:col-span-2">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 sm:p-8 shadow-[0_16px_64px_rgba(0,0,0,0.3)] relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-accent/[0.04] rounded-full blur-[80px] pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-7 relative z-10"
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
                        <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-3">Pre-Existing Conditions</label>
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

                  {/* ═══ AI PROFILER ═══ */}
                  {category === 'ai' && (
                    <>
                      <PremiumSlider
                        min={2000} max={100000} step={1000}
                        value={aiMonthlyBudget} onChange={setAiMonthlyBudget}
                        leftLabel="Monthly Budget Target"
                        displayValue={`₹${aiMonthlyBudget.toLocaleString('en-IN')}`}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <GlassInput label="Age Group">
                          <select value={aiAge} onChange={(e) => setAiAge(e.target.value)} className={selectClasses}>
                            <option value="18-35">Young (18-35)</option>
                            <option value="36-50">Mid (36-50)</option>
                            <option value="50+">Senior (50+)</option>
                          </select>
                        </GlassInput>
                        <GlassInput label="Dependents">
                          <select value={aiDependents} onChange={(e) => setAiDependents(Number(e.target.value))} className={selectClasses}>
                            <option value="0">None</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3+</option>
                          </select>
                        </GlassInput>
                        <GlassInput label="Risk Tolerance">
                          <select value={aiRisk} onChange={(e) => setAiRisk(e.target.value)} className={selectClasses}>
                            <option value="conservative">Conservative</option>
                            <option value="balanced">Balanced</option>
                            <option value="aggressive">Aggressive</option>
                          </select>
                        </GlassInput>
                      </div>
                    </>
                  )}
                  
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right Panel: Output ── */}
          <div className="relative">
            <div className="sticky top-28 rounded-3xl overflow-hidden">
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-accent/20 via-transparent to-indigo-500/10 p-px pointer-events-none" />
              
              <div className="bg-[#0c0f1a]/90 backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/[0.04] via-transparent to-transparent rounded-3xl pointer-events-none" />
                
                {/* AI Profiler Output */}
                {category === 'ai' ? (() => {
                  const rec = getAiRecommendation();
                  return (
                    <div className="relative z-10 text-center">
                      <h3 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-6">AI Portfolio Allocation</h3>
                      
                      <DonutChart segments={[
                        { value: rec.health, color: '#F6FF00' },
                        { value: rec.life, color: '#818CF8' },
                        { value: rec.motor, color: '#34D399' },
                        { value: rec.investment, color: '#F472B6' },
                      ]} />

                      <div className="space-y-3 text-left mt-6">
                        {[
                          { icon: FaHeartbeat, label: 'Health', pct: rec.health, val: rec.healthVal, color: 'text-brand-accent' },
                          { icon: FaShieldAlt, label: 'Life', pct: rec.life, val: rec.lifeVal, color: 'text-indigo-400' },
                          { icon: FaCar, label: 'Motor/Gen', pct: rec.motor, val: rec.motorVal, color: 'text-emerald-400' },
                          { icon: FaCalculator, label: 'SIP/Inv', pct: rec.investment, val: rec.investmentVal, color: 'text-pink-400' },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.05] transition-colors">
                            <span className="text-sm font-medium text-white flex items-center gap-2.5">
                              <item.icon className={item.color} /> {item.label} <span className="text-neutral-500 text-xs">({item.pct}%)</span>
                            </span>
                            <span className="font-mono text-sm font-bold text-white">₹{item.val.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-5 border-t border-white/[0.06]">
                        <div className="flex justify-between items-center">
                          <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Total Allocation</span>
                          <span className="text-lg font-bold text-white">₹{aiMonthlyBudget.toLocaleString()}/mo</span>
                        </div>
                      </div>
                    </div>
                  );
                })() : category === 'sip' ? (
                  /* SIP Output */
                  <div className="relative z-10 text-center">
                    <h3 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-6">Wealth Created</h3>
                    
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-brand-accent/10 blur-3xl rounded-full" />
                      <div className="relative bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold mb-2">Future Value</p>
                        <div className="flex items-baseline justify-center text-white">
                          <span className="text-lg font-bold text-brand-accent mr-1">₹</span>
                          <span className="text-4xl font-extrabold tracking-tight drop-shadow-[0_0_12px_rgba(246,255,0,0.4)]">
                            {sipResults.total > 10000000 ? (sipResults.total/10000000).toFixed(2) + 'Cr' : (sipResults.total/100000).toFixed(2) + 'L'}
                          </span>
                        </div>
                        <p className="text-[10px] text-brand-accent uppercase tracking-widest font-semibold mt-3 bg-brand-accent/10 px-3 py-1 rounded-full border border-brand-accent/15 inline-block">
                          After {sipYears} Years
                        </p>
                      </div>
                    </div>

                    {/* SIP Donut */}
                    <DonutChart segments={[
                      { value: sipResults.invested, color: '#818CF8' },
                      { value: sipResults.gain, color: '#F6FF00' },
                    ]} />

                    <div className="space-y-3 text-left mt-5 mb-6">
                      <div className="flex justify-between items-center text-sm py-2.5 px-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                        <span className="text-neutral-400 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" /> Invested</span>
                        <span className="font-bold text-white">₹{sipResults.invested.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm py-2.5 px-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                        <span className="text-neutral-400 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-brand-accent inline-block" /> Wealth Gain</span>
                        <span className="font-bold text-brand-accent">₹{sipResults.gain.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowBuyModal(true)}
                      className="w-full relative group overflow-hidden bg-white text-black font-bold py-4 text-sm uppercase tracking-widest rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(246,255,0,0.2)] hover:scale-[1.02]"
                    >
                      <div className="absolute inset-0 bg-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <FaCalculator /> Setup Auto-SIP
                      </span>
                    </button>
                  </div>
                ) : category === 'health' ? (
                  /* Health Output */
                  <div className="relative z-10 text-center">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">Estimated Premium</h3>
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${risk.bg} ${risk.text} ${risk.border}`}>
                        {healthBreakdown.riskLevel} Risk
                      </span>
                    </div>
                    
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-brand-accent/10 blur-3xl rounded-full" />
                      <div className="relative bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold mb-2">Annual Premium</p>
                        <div className="flex items-baseline justify-center text-white">
                          <span className="text-lg font-bold text-brand-accent mr-1">₹</span>
                          <span className="text-5xl font-extrabold tracking-tight drop-shadow-[0_0_12px_rgba(246,255,0,0.4)]">
                            <AnimatedCounter value={healthBreakdown.annualPremium} />
                          </span>
                        </div>
                        <p className="text-[11px] text-brand-accent uppercase tracking-widest font-semibold mt-3 bg-brand-accent/[0.06] px-4 py-1.5 rounded-full border border-brand-accent/15 inline-block">
                          <AnimatedCounter value={healthBreakdown.monthlyPremium} prefix="₹" suffix=" / mo" />
                        </p>
                      </div>
                    </div>

                    {/* Health Donut */}
                    <DonutChart segments={[
                      { value: healthBreakdown.base, color: '#F6FF00' },
                      ...(healthBreakdown.ageAdj !== 0 ? [{ value: Math.abs(healthBreakdown.ageAdj), color: '#F97316' }] : []),
                      ...(healthBreakdown.tobaccoLoad !== 0 ? [{ value: healthBreakdown.tobaccoLoad, color: '#EF4444' }] : []),
                      ...(healthBreakdown.medicalLoad !== 0 ? [{ value: healthBreakdown.medicalLoad, color: '#EC4899' }] : []),
                      ...(healthBreakdown.deductibleDiscount !== 0 ? [{ value: Math.abs(healthBreakdown.deductibleDiscount), color: '#818CF8' }] : []),
                    ]} />

                    {/* Breakdown */}
                    <div className="space-y-2 text-left mt-5 mb-6">
                      <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-3 px-1">Premium Breakdown</p>
                      
                      <div className="flex justify-between items-center text-xs py-2 px-3 rounded-lg bg-white/[0.02]">
                        <span className="text-neutral-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-accent inline-block" /> Base (Cov: {coverage/100000}L)</span>
                        <span className="font-bold text-white">₹{healthBreakdown.base.toLocaleString('en-IN')}</span>
                      </div>
                      {healthBreakdown.ageAdj !== 0 && (
                        <div className="flex justify-between items-center text-xs py-2 px-3 rounded-lg bg-white/[0.02]">
                          <span className="text-neutral-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Age Adjustment</span>
                          <span className={`font-bold ${healthBreakdown.ageAdj > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {healthBreakdown.ageAdj > 0 ? '+' : ''}₹{healthBreakdown.ageAdj.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                      {healthBreakdown.tobaccoLoad !== 0 && (
                        <div className="flex justify-between items-center text-xs py-2 px-3 rounded-lg bg-white/[0.02]">
                          <span className="text-neutral-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Tobacco Loading</span>
                          <span className="font-bold text-red-400">+₹{healthBreakdown.tobaccoLoad.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {healthBreakdown.medicalLoad !== 0 && (
                        <div className="flex justify-between items-center text-xs py-2 px-3 rounded-lg bg-white/[0.02]">
                          <span className="text-neutral-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-pink-500 inline-block" /> Medical Conditions</span>
                          <span className="font-bold text-red-400">+₹{healthBreakdown.medicalLoad.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {healthBreakdown.deductibleDiscount !== 0 && (
                        <div className="flex justify-between items-center text-xs py-2 px-3 rounded-lg bg-white/[0.02]">
                          <span className="text-neutral-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" /> Deductible Adj.</span>
                          <span className={`font-bold ${healthBreakdown.deductibleDiscount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {healthBreakdown.deductibleDiscount > 0 ? '+' : ''}₹{healthBreakdown.deductibleDiscount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => setShowBuyModal(true)}
                      className="w-full relative group overflow-hidden bg-brand-accent text-black font-bold py-4 text-sm uppercase tracking-widest rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(246,255,0,0.25)] hover:scale-[1.02] mb-5"
                    >
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <FaShieldAlt /> Secure Now
                      </span>
                    </button>

                    <p className="text-[9px] leading-relaxed text-neutral-600 font-medium px-1 text-center">
                      This calculator provides an estimated premium based on general underwriting assumptions. Actual premiums may vary depending on the insurance provider, medical history, policy terms, and underwriting guidelines. Please contact SK Smart Investments for an accurate quotation.
                    </p>
                  </div>
                ) : (
                  /* Generic Output (Life / Motor / Home / Travel) */
                  <div className="relative z-10 text-center">
                    <h3 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-6">{getOutputMeta().title}</h3>
                    
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-brand-accent/15 blur-3xl rounded-full" />
                      <div className="relative bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] rounded-2xl p-8 flex flex-col items-center justify-center">
                        <div className="flex items-baseline text-white">
                          <span className="text-xl font-bold text-brand-accent mr-1">₹</span>
                          <span className="text-6xl font-extrabold tracking-tight drop-shadow-[0_0_12px_rgba(246,255,0,0.4)]">
                            <AnimatedCounter value={premium} />
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold mt-3">
                          {category === 'travel' ? 'Total Trip Premium' : 'INR / Month'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-left mb-6">
                      <div className="flex justify-between items-center text-sm py-2.5 px-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                        <span className="text-neutral-400">
                          {category === 'motor' ? 'Vehicle IDV' : category === 'home' ? 'Property Value' : category === 'travel' ? 'Duration' : 'Coverage'}
                        </span>
                        <span className="font-bold text-white">
                          {category === 'motor' ? `₹${vehicleValue.toLocaleString('en-IN')}` :
                           category === 'home' ? `₹${homeValue.toLocaleString('en-IN')}` :
                           category === 'travel' ? `${duration} Days` :
                           `₹${coverage.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm py-2.5 px-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                        <span className="text-neutral-400">Risk Profile</span>
                        <span className="font-bold text-brand-accent">Standard</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setShowBuyModal(true)}
                      className="w-full relative group overflow-hidden bg-white text-black font-bold py-4 text-sm uppercase tracking-widest rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(246,255,0,0.2)] hover:scale-[1.02]"
                    >
                      <div className="absolute inset-0 bg-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <FaShieldAlt /> Secure Now
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Sticky Output Bar ── */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0c0f1a]/95 backdrop-blur-2xl border-t border-white/[0.06] p-4 pr-24 xl:hidden z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-widest mb-1">
              {category === 'sip' ? 'Est. Total Value' : category === 'health' ? 'Annual Premium' : category === 'travel' ? 'Trip Premium' : 'Est. Monthly Premium'}
            </p>
            <p className="text-xl font-extrabold text-brand-accent drop-shadow-[0_0_8px_rgba(246,255,0,0.3)]">
              ₹{category === 'sip' 
                  ? sipResults.total.toLocaleString('en-IN') 
                  : category === 'health' 
                    ? healthBreakdown.annualPremium.toLocaleString('en-IN') 
                    : premium.toLocaleString('en-IN')}
            </p>
          </div>
          <button 
            onClick={() => setShowBuyModal(true)} 
            className="bg-brand-accent text-black px-5 py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(246,255,0,0.15)]"
          >
            {category === 'sip' ? 'Setup SIP' : 'Secure Now'}
          </button>
        </div>
      </div>

      {/* ── Buy Flow Modal ── */}
      <AnimatePresence>
        {showBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowBuyModal(false)} />
            <motion.div 
              initial={{ scale: 0.92, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-md bg-[#0c0f1a] border border-white/[0.08] rounded-3xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-accent/10 rounded-full blur-[60px] pointer-events-none" />
              
              <h2 className="text-xl font-bold text-white mb-6 relative z-10">
                {category === 'sip' ? "SIP Auto-Debit Setup" : "Premium Activation"}
              </h2>

              {successBuy ? (
                <div className="text-center py-8 relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-accent/20 text-brand-accent rounded-2xl mb-4 animate-bounce">
                    <FaUserCheck className="text-3xl" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-2">Activated!</h3>
                  <p className="text-sm text-neutral-400">
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
                  
                  <div className="p-4 bg-brand-accent/[0.05] border border-brand-accent/15 rounded-xl">
                    <p className="text-xs font-bold text-brand-accent mb-3 uppercase tracking-widest">Summary</p>
                    <div className="flex justify-between text-sm text-white font-medium mb-1">
                      <span>{category === 'sip' ? 'Monthly SIP' : 'Monthly Premium'}</span>
                      <span>₹{category === 'sip' ? sipMonthly.toLocaleString() : premium.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowBuyModal(false)} className="flex-1 py-3 text-sm font-semibold text-neutral-400 hover:text-white transition-colors rounded-xl hover:bg-white/[0.04]">Cancel</button>
                    <button type="submit" className="flex-1 py-3 bg-brand-accent text-black font-bold uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(246,255,0,0.2)] transition-all hover:scale-[1.02]">
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
