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

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden pt-24 pb-32 xl:pb-24">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white">
              Intelligent <span className="text-brand-accent">Calculator</span>
            </h1>
            <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Dynamically calculate your premiums, map out your wealth generation, and build your bespoke portfolio with our cutting-edge calculation engines.
            </p>
          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* Left Panel: Inputs */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Category Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[1px] p-[1px] bg-neutral-900/40 backdrop-blur-md border border-white/10 shadow-2xl">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center justify-center gap-2 py-3 px-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      isActive 
                        ? 'bg-brand-accent text-black shadow-[0_0_20px_rgba(246,255,0,0.3)]' 
                        : 'bg-neutral-950/60 text-neutral-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className={`text-lg sm:text-xl ${isActive ? "text-black" : "text-neutral-500"}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Config Panel */}
            <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[80px] pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8 relative z-10"
                >
                  
                  {/* HEALTH */}
                  {category === 'health' && (
                    <>
                      <div>
                        <div className="flex justify-between items-end mb-4">
                          <label className="text-xs font-[900] uppercase tracking-widest text-neutral-400">Coverage Limit</label>
                          <span className="text-2xl font-bold text-brand-accent drop-shadow-[0_0_8px_rgba(246,255,0,0.4)]">₹{coverage.toLocaleString('en-IN')}</span>
                        </div>
                        <input type="range" min="100000" max="5000000" step="100000" value={coverage} onChange={(e) => setCoverage(Number(e.target.value))} className="w-full h-1.5 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-brand-accent" />
                        <div className="flex justify-between text-[10px] text-neutral-500 mt-2 font-medium tracking-wider"><span>₹1 Lakh</span><span>₹50 Lakh</span></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-3">Age of Insured</label>
                          <input type="number" min="18" max="100" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-[2px] focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-sm font-bold text-white transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-3">Deductible</label>
                          <select value={deductible} onChange={(e) => setDeductible(Number(e.target.value))} className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-[2px] focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-sm font-bold text-white transition-all shadow-inner">
                            <option value="500">₹500</option>
                            <option value="2500">₹2,500</option>
                            <option value="5000">₹5,000</option>
                            <option value="10000">₹10,000</option>
                            <option value="25000">₹25,000</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-white/5">
                        <label className="flex items-center gap-4 p-4 bg-neutral-950/30 border border-white/5 cursor-pointer hover:border-brand-accent/50 transition-colors group">
                          <input type="checkbox" checked={smoker} onChange={(e) => setSmoker(e.target.checked)} className="w-5 h-5 rounded border-white/20 bg-neutral-900 accent-brand-accent text-brand-accent focus:ring-brand-accent focus:ring-offset-neutral-900" />
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">Tobacco User</p>
                            <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">Increases premium by ~35%</p>
                          </div>
                        </label>
                      </div>

                      <div>
                        <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-3">Pre-Existing Conditions</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { key: 'diabetes', label: 'Diabetes' },
                            { key: 'highBp', label: 'High BP' },
                            { key: 'asthma', label: 'Asthma' },
                            { key: 'heartDisease', label: 'Heart Disease' },
                            { key: 'kidneyDisease', label: 'Kidney Disease' },
                          ].map((cond) => (
                            <label key={cond.key} className={`flex items-center gap-2 p-3 border cursor-pointer transition-all ${medicalConditions[cond.key] ? 'bg-brand-accent/10 border-brand-accent text-brand-accent' : 'bg-neutral-950/30 border-white/5 text-neutral-400 hover:border-white/20'}`}>
                              <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={medicalConditions[cond.key]} 
                                onChange={(e) => setMedicalConditions(prev => ({ ...prev, [cond.key]: e.target.checked }))} 
                              />
                              <span className="text-xs font-bold">{cond.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* LIFE */}
                  {category === 'life' && (
                    <>
                      <div>
                        <div className="flex justify-between items-end mb-4">
                          <label className="text-xs font-[900] uppercase tracking-widest text-neutral-400">Term Payout Target</label>
                          <span className="text-2xl font-bold text-brand-accent drop-shadow-[0_0_8px_rgba(246,255,0,0.4)]">₹{coverage.toLocaleString()}</span>
                        </div>
                        <input type="range" min="1000000" max="50000000" step="500000" value={coverage} onChange={(e) => setCoverage(Number(e.target.value))} className="w-full h-1.5 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-brand-accent" />
                        <div className="flex justify-between text-[10px] text-neutral-500 mt-2 font-medium tracking-wider"><span>₹10L</span><span>₹5Cr</span></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-3">Age</label>
                          <input type="number" min="18" max="75" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-[2px] focus:outline-none focus:border-brand-accent text-sm font-bold text-white transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-3">Term (Years)</label>
                          <select value={termYears} onChange={(e) => setTermYears(Number(e.target.value))} className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-[2px] focus:outline-none focus:border-brand-accent text-sm font-bold text-white transition-all shadow-inner">
                            <option value="10">10 Years</option>
                            <option value="20">20 Years</option>
                            <option value="30">30 Years</option>
                            <option value="40">40 Years</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-3">Annual Income (₹)</label>
                          <input type="number" step="100000" value={annualIncome} onChange={(e) => setAnnualIncome(Number(e.target.value))} className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-[2px] focus:outline-none focus:border-brand-accent text-sm font-bold text-white transition-all shadow-inner" />
                        </div>
                      </div>
                      
                      <label className="flex items-center gap-4 p-4 bg-neutral-950/30 border border-white/5 cursor-pointer hover:border-brand-accent/50 transition-colors group w-full md:w-1/2">
                        <input type="checkbox" checked={smoker} onChange={(e) => setSmoker(e.target.checked)} className="w-5 h-5 rounded border-white/20 bg-neutral-900 accent-brand-accent text-brand-accent focus:ring-brand-accent" />
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">Tobacco User</p>
                          <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">Impacts Life Cover Premiums</p>
                        </div>
                      </label>
                    </>
                  )}

                  {/* MOTOR */}
                  {category === 'motor' && (
                    <>
                      <div>
                        <div className="flex justify-between items-end mb-4">
                          <label className="text-xs font-[900] uppercase tracking-widest text-neutral-400">Vehicle IDV (Value)</label>
                          <span className="text-2xl font-bold text-brand-accent drop-shadow-[0_0_8px_rgba(246,255,0,0.4)]">₹{vehicleValue.toLocaleString()}</span>
                        </div>
                        <input type="range" min="50000" max="5000000" step="50000" value={vehicleValue} onChange={(e) => setVehicleValue(Number(e.target.value))} className="w-full h-1.5 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-brand-accent" />
                        <div className="flex justify-between text-[10px] text-neutral-500 mt-2 font-medium tracking-wider"><span>₹50K</span><span>₹50L</span></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-3">Vehicle Age</label>
                          <select value={vehicleAge} onChange={(e) => setVehicleAge(Number(e.target.value))} className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-[2px] focus:outline-none focus:border-brand-accent text-sm font-bold text-white transition-all shadow-inner">
                            <option value="0">Brand New (&lt; 1 Year)</option>
                            <option value="1">1 - 2 Years</option>
                            <option value="3">2 - 5 Years</option>
                            <option value="6">5+ Years</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-3">Deductible</label>
                          <select value={deductible} onChange={(e) => setDeductible(Number(e.target.value))} className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-[2px] focus:outline-none focus:border-brand-accent text-sm font-bold text-white transition-all shadow-inner">
                            <option value="1000">₹1,000</option>
                            <option value="2500">₹2,500</option>
                            <option value="5000">₹5,000</option>
                          </select>
                        </div>
                      </div>

                      <label className="flex items-center gap-4 p-4 bg-neutral-950/30 border border-white/5 cursor-pointer hover:border-brand-accent/50 transition-colors group w-full md:w-1/2">
                        <input type="checkbox" checked={roadsideAssistance} onChange={(e) => setRoadsideAssistance(e.target.checked)} className="w-5 h-5 rounded border-white/20 bg-neutral-900 accent-brand-accent text-brand-accent focus:ring-brand-accent" />
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">Roadside Assistance</p>
                          <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">Towing, battery jump, etc.</p>
                        </div>
                      </label>
                    </>
                  )}

                  {/* HOME */}
                  {category === 'home' && (
                    <>
                      <div>
                        <div className="flex justify-between items-end mb-4">
                          <label className="text-xs font-[900] uppercase tracking-widest text-neutral-400">Structure Insured Value</label>
                          <span className="text-2xl font-bold text-brand-accent drop-shadow-[0_0_8px_rgba(246,255,0,0.4)]">₹{homeValue.toLocaleString()}</span>
                        </div>
                        <input type="range" min="500000" max="50000000" step="500000" value={homeValue} onChange={(e) => setHomeValue(Number(e.target.value))} className="w-full h-1.5 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-brand-accent" />
                        <div className="flex justify-between text-[10px] text-neutral-500 mt-2 font-medium tracking-wider"><span>₹5L</span><span>₹5Cr</span></div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-3">Property Age (Years)</label>
                        <input type="number" min="0" max="100" value={homeAge} onChange={(e) => setHomeAge(Number(e.target.value))} className="w-full md:w-1/2 px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-[2px] focus:outline-none focus:border-brand-accent text-sm font-bold text-white transition-all shadow-inner" />
                      </div>
                    </>
                  )}

                  {/* TRAVEL */}
                  {category === 'travel' && (
                    <>
                      <div>
                        <div className="flex justify-between items-end mb-4">
                          <label className="text-xs font-[900] uppercase tracking-widest text-neutral-400">Trip Duration</label>
                          <span className="text-2xl font-bold text-brand-accent drop-shadow-[0_0_8px_rgba(246,255,0,0.4)]">{duration} Days</span>
                        </div>
                        <input type="range" min="1" max="90" step="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full h-1.5 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-brand-accent" />
                        <div className="flex justify-between text-[10px] text-neutral-500 mt-2 font-medium tracking-wider"><span>1 Day</span><span>90 Days</span></div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-3">Destination Tier</label>
                        <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full md:w-1/2 px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-[2px] focus:outline-none focus:border-brand-accent text-sm font-bold text-white transition-all shadow-inner">
                          <option value="domestic">Domestic / Regional</option>
                          <option value="worldwide">Worldwide / Global</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* SIP */}
                  {category === 'sip' && (
                    <>
                      <div>
                        <div className="flex justify-between items-end mb-4">
                          <label className="text-xs font-[900] uppercase tracking-widest text-neutral-400">Monthly SIP</label>
                          <span className="text-2xl font-bold text-brand-accent drop-shadow-[0_0_8px_rgba(246,255,0,0.4)]">₹{sipMonthly.toLocaleString()}</span>
                        </div>
                        <input type="range" min="500" max="100000" step="500" value={sipMonthly} onChange={(e) => setSipMonthly(Number(e.target.value))} className="w-full h-1.5 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-brand-accent" />
                        <div className="flex justify-between text-[10px] text-neutral-500 mt-2 font-medium tracking-wider"><span>₹500</span><span>₹1,00,000</span></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex justify-between items-end mb-4">
                            <label className="text-xs font-[900] uppercase tracking-widest text-neutral-400">Expected ROI</label>
                            <span className="text-lg font-bold text-brand-accent">{sipReturnRate}%</span>
                          </div>
                          <input type="range" min="5" max="30" step="0.5" value={sipReturnRate} onChange={(e) => setSipReturnRate(Number(e.target.value))} className="w-full h-1.5 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-brand-accent" />
                          <div className="flex justify-between text-[10px] text-neutral-500 mt-2 font-medium tracking-wider"><span>5%</span><span>30%</span></div>
                        </div>

                        <div>
                          <div className="flex justify-between items-end mb-4">
                            <label className="text-xs font-[900] uppercase tracking-widest text-neutral-400">Tenure (Years)</label>
                            <span className="text-lg font-bold text-brand-accent">{sipYears} Yrs</span>
                          </div>
                          <input type="range" min="1" max="30" step="1" value={sipYears} onChange={(e) => setSipYears(Number(e.target.value))} className="w-full h-1.5 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-brand-accent" />
                          <div className="flex justify-between text-[10px] text-neutral-500 mt-2 font-medium tracking-wider"><span>1 Yr</span><span>30 Yrs</span></div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* AI Profiler */}
                  {category === 'ai' && (
                    <>
                      <div>
                        <div className="flex justify-between items-end mb-4">
                          <label className="text-xs font-[900] uppercase tracking-widest text-neutral-400">Monthly Budget Target</label>
                          <span className="text-2xl font-bold text-brand-accent drop-shadow-[0_0_8px_rgba(246,255,0,0.4)]">₹{aiMonthlyBudget.toLocaleString()}</span>
                        </div>
                        <input type="range" min="2000" max="100000" step="1000" value={aiMonthlyBudget} onChange={(e) => setAiMonthlyBudget(Number(e.target.value))} className="w-full h-1.5 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-brand-accent" />
                        <div className="flex justify-between text-[10px] text-neutral-500 mt-2 font-medium tracking-wider"><span>₹2,000</span><span>₹1,00,000</span></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-3">Age Group</label>
                          <select value={aiAge} onChange={(e) => setAiAge(e.target.value)} className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-[2px] focus:outline-none focus:border-brand-accent text-sm font-bold text-white transition-all shadow-inner">
                            <option value="18-35">Young (18-35)</option>
                            <option value="36-50">Mid (36-50)</option>
                            <option value="50+">Senior (50+)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-3">Dependents</label>
                          <select value={aiDependents} onChange={(e) => setAiDependents(Number(e.target.value))} className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-[2px] focus:outline-none focus:border-brand-accent text-sm font-bold text-white transition-all shadow-inner">
                            <option value="0">None</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3+</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-3">Risk Tolerance</label>
                          <select value={aiRisk} onChange={(e) => setAiRisk(e.target.value)} className="w-full px-4 py-3 bg-neutral-950/50 border border-white/10 rounded-[2px] focus:outline-none focus:border-brand-accent text-sm font-bold text-white transition-all shadow-inner">
                            <option value="conservative">Conservative</option>
                            <option value="balanced">Balanced</option>
                            <option value="aggressive">Aggressive</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                  
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Panel: Output */}
          <div className="relative">
            <div className="sticky top-28 bg-neutral-900/60 backdrop-blur-2xl border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent pointer-events-none" />
              
              {category === 'ai' ? (() => {
                const rec = getAiRecommendation();
                return (
                  <div className="relative z-10 text-center">
                    <h3 className="text-[10px] font-[900] text-neutral-400 uppercase tracking-[0.2em] mb-8">AI Portfolio Allocation</h3>
                    <div className="space-y-4 text-left">
                      <div className="flex justify-between items-center py-3 border-b border-white/5 group">
                        <span className="text-sm font-bold text-white flex items-center gap-2"><FaHeartbeat className="text-brand-accent" /> Health ({rec.health}%)</span>
                        <span className="font-mono text-brand-accent font-bold">₹{rec.healthVal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/5 group">
                        <span className="text-sm font-bold text-white flex items-center gap-2"><FaShieldAlt className="text-brand-accent" /> Life ({rec.life}%)</span>
                        <span className="font-mono text-brand-accent font-bold">₹{rec.lifeVal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/5 group">
                        <span className="text-sm font-bold text-white flex items-center gap-2"><FaCar className="text-brand-accent" /> Motor/Gen ({rec.motor}%)</span>
                        <span className="font-mono text-brand-accent font-bold">₹{rec.motorVal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/5 group">
                        <span className="text-sm font-bold text-white flex items-center gap-2"><FaCalculator className="text-brand-accent" /> SIP/Inv ({rec.investment}%)</span>
                        <span className="font-mono text-brand-accent font-bold">₹{rec.investmentVal.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Total Allocation</span>
                        <span className="text-xl font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">₹{aiMonthlyBudget.toLocaleString()}/mo</span>
                      </div>
                    </div>
                  </div>
                )
              })() : category === 'sip' ? (
                <div className="relative z-10 text-center">
                  <h3 className="text-[10px] font-[900] text-neutral-400 uppercase tracking-[0.2em] mb-8">Wealth Created</h3>
                  
                  <div className="relative inline-flex items-center justify-center mb-8">
                    <div className="absolute inset-0 bg-brand-accent/20 blur-2xl rounded-full" />
                    <div className="w-48 h-48 border border-white/10 bg-neutral-950/80 shadow-2xl flex flex-col items-center justify-center relative z-10">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Future Value</p>
                      <div className="flex items-start text-white">
                        <span className="text-xl font-bold text-brand-accent mt-1">₹</span>
                        <span className="text-4xl font-[900] tracking-tighter drop-shadow-[0_0_10px_rgba(246,255,0,0.5)]">{sipResults.total > 10000000 ? (sipResults.total/10000000).toFixed(2) + 'Cr' : (sipResults.total/100000).toFixed(2) + 'L'}</span>
                      </div>
                      <p className="text-[9px] text-brand-accent uppercase tracking-widest font-bold mt-2 bg-brand-accent/10 px-3 py-1 border border-brand-accent/20">After {sipYears} Years</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-left mb-8">
                    <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                      <span className="text-neutral-400">Total Invested</span>
                      <span className="font-bold text-white">₹{sipResults.invested.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                      <span className="text-neutral-400">Est. Wealth Gain</span>
                      <span className="font-bold text-brand-accent">₹{sipResults.gain.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowBuyModal(true)}
                    className="w-full relative group overflow-hidden bg-white text-black font-[900] py-4 text-sm uppercase tracking-widest transition-transform hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <FaCalculator /> Setup Auto-SIP
                    </span>
                  </button>
                </div>
              ) : category === 'health' ? (
                <div className="relative z-10 text-center">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-[900] text-neutral-400 uppercase tracking-[0.2em]">Estimated Premium</h3>
                    <div className={`px-3 py-1 text-[9px] font-[900] uppercase tracking-widest border ${
                      healthBreakdown.riskLevel === 'Low' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      healthBreakdown.riskLevel === 'Moderate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      healthBreakdown.riskLevel === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {healthBreakdown.riskLevel} Risk
                    </div>
                  </div>
                  
                  <div className="relative inline-flex flex-col items-center justify-center mb-8 w-full">
                    <div className="absolute inset-0 bg-brand-accent/10 blur-2xl rounded-full" />
                    <div className="w-full border border-white/10 bg-neutral-950/80 shadow-2xl p-6 relative z-10">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2">Annual Premium</p>
                      <div className="flex items-start justify-center text-white mb-4">
                        <span className="text-xl font-bold text-brand-accent mt-2 mr-1">₹</span>
                        <span className="text-5xl font-[900] tracking-tighter drop-shadow-[0_0_10px_rgba(246,255,0,0.5)]">
                          <AnimatedCounter value={healthBreakdown.annualPremium} />
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-accent uppercase tracking-widest font-bold mt-2 bg-brand-accent/5 px-3 py-1.5 border border-brand-accent/10 inline-block">
                        <AnimatedCounter value={healthBreakdown.monthlyPremium} prefix="₹" suffix=" / mo" />
                      </p>
                    </div>
                  </div>

                  {/* Transparent Breakdown */}
                  <div className="space-y-3 text-left mb-8 bg-black/40 p-5 border border-white/5">
                    <p className="text-[9px] font-[900] text-neutral-500 uppercase tracking-widest mb-4">Premium Breakdown</p>
                    
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                      <span className="text-neutral-400 font-medium">Base Premium (Cov: {coverage/100000}L)</span>
                      <span className="font-bold text-white">₹{healthBreakdown.base.toLocaleString('en-IN')}</span>
                    </div>
                    {healthBreakdown.ageAdj !== 0 && (
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                        <span className="text-neutral-400 font-medium">Age Adjustment</span>
                        <span className={`font-bold ${healthBreakdown.ageAdj > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {healthBreakdown.ageAdj > 0 ? '+' : ''}₹{healthBreakdown.ageAdj.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    {healthBreakdown.tobaccoLoad !== 0 && (
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                        <span className="text-neutral-400 font-medium">Tobacco Loading</span>
                        <span className="font-bold text-red-400">+₹{healthBreakdown.tobaccoLoad.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {healthBreakdown.medicalLoad !== 0 && (
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                        <span className="text-neutral-400 font-medium">Medical Conditions</span>
                        <span className="font-bold text-red-400">+₹{healthBreakdown.medicalLoad.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {healthBreakdown.deductibleDiscount !== 0 && (
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                        <span className="text-neutral-400 font-medium">Deductible Adjustment</span>
                        <span className={`font-bold ${healthBreakdown.deductibleDiscount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {healthBreakdown.deductibleDiscount > 0 ? '+' : ''}₹{healthBreakdown.deductibleDiscount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => setShowBuyModal(true)}
                    className="w-full relative group overflow-hidden bg-brand-accent text-black font-[900] py-4 text-sm uppercase tracking-widest transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(246,255,0,0.2)] mb-6"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <FaShieldAlt /> Secure Now
                    </span>
                  </button>

                  <p className="text-[9px] leading-relaxed text-neutral-500 font-medium px-2 text-justify">
                    This calculator provides an estimated premium based on general underwriting assumptions. Actual premiums may vary depending on the insurance provider, medical history, policy terms, and underwriting guidelines. Please contact SK Smart Investments for an accurate quotation.
                  </p>
                </div>
              ) : (
                <div className="relative z-10 text-center">
                  <h3 className="text-[10px] font-[900] text-neutral-400 uppercase tracking-[0.2em] mb-8">Est. Monthly Premium</h3>
                  
                  <div className="relative inline-flex items-center justify-center mb-8">
                    <div className="absolute inset-0 bg-brand-accent/20 blur-2xl rounded-full" />
                    <div className="w-48 h-48 border border-white/10 bg-neutral-950/80 shadow-2xl flex flex-col items-center justify-center relative z-10">
                      <div className="flex items-start text-white">
                        <span className="text-xl font-bold text-brand-accent mt-2">₹</span>
                        <span className="text-6xl font-[900] tracking-tighter drop-shadow-[0_0_10px_rgba(246,255,0,0.5)]">
                          <AnimatedCounter value={premium} />
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mt-2">INR / Month</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-left mb-8">
                    <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                      <span className="text-neutral-400">Coverage</span>
                      <span className="font-bold text-white">₹{coverage.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                      <span className="text-neutral-400">Risk Profile</span>
                      <span className="font-bold text-brand-accent">Standard</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowBuyModal(true)}
                    className="w-full relative group overflow-hidden bg-white text-black font-[900] py-4 text-sm uppercase tracking-widest transition-transform hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

      {/* Mobile Sticky Output Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-neutral-950/95 backdrop-blur-xl border-t border-white/10 p-4 pr-24 xl:hidden z-40 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">
              {category === 'sip' ? 'Est. Total Value' : category === 'health' ? 'Annual Premium' : 'Est. Monthly Premium'}
            </p>
            <p className="text-xl font-black text-brand-accent drop-shadow-[0_0_8px_rgba(246,255,0,0.3)]">
              ₹{category === 'sip' 
                  ? sipResults.total.toLocaleString('en-IN') 
                  : category === 'health' 
                    ? healthBreakdown.annualPremium.toLocaleString('en-IN') 
                    : premium.toLocaleString('en-IN')}
            </p>
          </div>
          <button 
            onClick={() => setShowBuyModal(true)} 
            className="bg-brand-accent text-black px-4 py-2 text-[10px] sm:text-xs font-[900] uppercase tracking-wider hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(246,255,0,0.2)]"
          >
            {category === 'sip' ? 'Setup SIP' : 'Secure Now'}
          </button>
        </div>
      </div>

      {/* Buy Flow Modal */}
      <AnimatePresence>
        {showBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowBuyModal(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-neutral-950 border border-white/10 p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
              
              <h2 className="text-xl font-bold text-white mb-6">
                {category === 'sip' ? "SIP Auto-Debit Setup" : "Premium Activation"}
              </h2>

              {successBuy ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-accent/20 text-brand-accent mb-4 animate-bounce">
                    <FaUserCheck className="text-3xl" />
                  </div>
                  <h3 className="text-2xl font-[900] text-white mb-2">Activated!</h3>
                  <p className="text-sm text-neutral-400">
                    {category === 'sip' ? 'Your auto-debit SIP mandate is registered.' : 'Your policy has been successfully issued.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePurchaseMock} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-2">Legal Name</label>
                    <input required type="text" value={buyName} onChange={(e) => setBuyName(e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-[2px] focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-sm text-white" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-[900] text-neutral-400 uppercase tracking-widest mb-2">Email</label>
                    <input required type="email" value={buyEmail} onChange={(e) => setBuyEmail(e.target.value)} className="w-full px-4 py-3 bg-neutral-900 border border-white/10 rounded-[2px] focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-sm text-white" placeholder="john@example.com" />
                  </div>
                  
                  <div className="p-4 bg-brand-accent/5 border border-brand-accent/20">
                    <p className="text-xs font-bold text-brand-accent mb-3 uppercase tracking-widest">Summary</p>
                    <div className="flex justify-between text-sm text-white font-medium mb-1">
                      <span>{category === 'sip' ? 'Monthly SIP' : 'Monthly Premium'}</span>
                      <span>₹{category === 'sip' ? sipMonthly.toLocaleString() : premium.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowBuyModal(false)} className="flex-1 py-3 text-sm font-bold text-neutral-400 hover:text-white transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 py-3 bg-brand-accent text-black font-[900] uppercase tracking-widest hover:bg-white transition-colors shadow-[0_0_15px_rgba(246,255,0,0.2)]">
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
