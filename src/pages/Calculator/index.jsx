import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [preExisting, setPreExisting] = useState(false);

  // Motor inputs
  const [vehicleValue, setVehicleValue] = useState(25000);
  const [vehicleAge, setVehicleAge] = useState(1);
  const [roadsideAssistance, setRoadsideAssistance] = useState(false);

  // Life inputs
  const [termYears, setTermYears] = useState(20);
  const [annualIncome, setAnnualIncome] = useState(80000);

  // Home inputs
  const [homeValue, setHomeValue] = useState(300000);
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
      base = (coverage * 0.0001); // 0.01%
      // Age modifier
      if (age < 25) base *= 0.8;
      else if (age > 50) base *= 1.8;
      else if (age > 40) base *= 1.4;

      if (smoker) base += 45;
      if (preExisting) base += 75;

      // Deductible discount
      base -= (deductible * 0.03);
    }
    else if (category === 'life') {
      base = (coverage * 0.00005); // 0.005%
      // Term and age
      base += (age * 0.5);
      base += (termYears * 0.3);
      if (smoker) base *= 1.5;
      if (annualIncome > 100000) base *= 0.9; // income tier discount
    }
    else if (category === 'motor') {
      base = (vehicleValue * 0.015); // 1.5% annual
      if (vehicleAge > 5) base *= 0.7; // older car lower premium value
      else if (vehicleAge > 2) base *= 0.9;

      if (roadsideAssistance) base += 35;
      base -= (deductible * 0.05);
      base = base / 12; // monthly
    }
    else if (category === 'home') {
      base = (homeValue * 0.0008); // 0.08% annual
      if (homeAge > 20) base *= 1.3;
      base = base / 12; // monthly
    }
    else if (category === 'travel') {
      base = duration * 2.5;
      if (destination === 'worldwide') base += 20;
      if (deductible > 100) base -= 5;
    }

    setPremium(Math.max(10, Math.round(base)));
  }, [category, coverage, deductible, age, smoker, preExisting, vehicleValue, vehicleAge, roadsideAssistance, termYears, annualIncome, homeValue, homeAge, duration, destination]);

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
    { id: 'health', label: 'Health', icon: FaHeartbeat, color: 'text-rose-500' },
    { id: 'life', label: 'Life', icon: FaHeartbeat, color: 'text-indigo-500' },
    { id: 'motor', label: 'Motor', icon: FaCar, color: 'text-blue-500' },
    { id: 'home', label: 'Home', icon: FaHome, color: 'text-emerald-500' },
    { id: 'travel', label: 'Travel', icon: FaPlane, color: 'text-amber-500' },
    { id: 'sip', label: 'SIP Calculator', icon: FaCalculator, color: 'text-gold-500' },
    { id: 'ai', label: 'AI Risk Profiler', icon: FaUserCheck, color: 'text-purple-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="text-center mb-12">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-500 bg-gold-500/10 rounded-full">
          {t('calc_badge')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-950 dark:text-white mt-2">
          {t('calc_title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto text-sm">
          {t('calc_subtitle')}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/50 dark:bg-navy-950/40 rounded-2xl border border-slate-200/50 dark:border-white/5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${category === cat.id
                      ? 'bg-navy-950 text-white dark:bg-gold-400 dark:text-navy-950 shadow-md font-bold'
                      : 'hover:bg-slate-300/40 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400'
                    }`}
                >
                  <Icon className="text-base" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Sliders & Configs */}
          <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 sm:p-8 space-y-6">
            {/* Dynamic Content based on Category */}
            {category === 'health' && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <label className="text-navy-950 dark:text-white">Coverage Limit</label>
                    <span className="text-gold-500">₹{coverage.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="2000000"
                    step="50000"
                    value={coverage}
                    onChange={(e) => setCoverage(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-navy-900 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>₹100,000</span>
                    <span>₹2,000,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Age of Primary Insured</label>
                    <input
                      type="number"
                      min="18"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-gold-400 text-sm font-medium text-navy-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Deductible (₹)</label>
                    <select
                      value={deductible}
                      onChange={(e) => setDeductible(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-gold-400 text-sm font-medium text-navy-950 dark:text-white"
                    >
                      <option value="250">₹250 deductible</option>
                      <option value="500">₹500 deductible</option>
                      <option value="1000">₹1,000 deductible</option>
                      <option value="2500">₹2,500 deductible</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <label className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-navy-900/50 rounded-xl border border-slate-200/50 dark:border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smoker}
                      onChange={(e) => setSmoker(e.target.checked)}
                      className="rounded text-gold-500 focus:ring-gold-400 h-4 w-4 bg-slate-100 dark:bg-navy-900"
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-navy-950 dark:text-white">Tobacco User</p>
                      <p className="text-[10px] text-slate-400 leading-none">Uses cigars, cigarettes, or vaping products</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-navy-900/50 rounded-xl border border-slate-200/50 dark:border-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preExisting}
                      onChange={(e) => setPreExisting(e.target.checked)}
                      className="rounded text-gold-500 focus:ring-gold-400 h-4 w-4 bg-slate-100 dark:bg-navy-900"
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-navy-950 dark:text-white">Pre-Existing Conditions</p>
                      <p className="text-[10px] text-slate-400 leading-none">Diabetes, high blood pressure, etc.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {category === 'life' && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <label className="text-navy-950 dark:text-white">Term Payout Target</label>
                    <span className="text-gold-500">₹{coverage.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="5000000"
                    step="100000"
                    value={coverage}
                    onChange={(e) => setCoverage(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-navy-900 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>₹100,000</span>
                    <span>₹5,000,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Age</label>
                    <input
                      type="number"
                      min="18"
                      max="75"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-gold-400 text-sm font-medium text-navy-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Term Period (Years)</label>
                    <select
                      value={termYears}
                      onChange={(e) => setTermYears(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-gold-400 text-sm font-medium text-navy-950 dark:text-white"
                    >
                      <option value="10">10 Years</option>
                      <option value="15">15 Years</option>
                      <option value="20">20 Years</option>
                      <option value="30">30 Years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Annual Income (₹)</label>
                    <input
                      type="number"
                      step="5000"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-gold-400 text-sm font-medium text-navy-950 dark:text-white"
                    />
                  </div>
                </div>

                <label className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-navy-900/50 rounded-xl border border-slate-200/50 dark:border-white/5 cursor-pointer max-w-md">
                  <input
                    type="checkbox"
                    checked={smoker}
                    onChange={(e) => setSmoker(e.target.checked)}
                    className="rounded text-gold-500 focus:ring-gold-400 h-4 w-4 bg-slate-100 dark:bg-navy-900"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-navy-950 dark:text-white">Tobacco / Nicotine Use</p>
                    <p className="text-[10px] text-slate-400 leading-none">Increases risk factor for life cover premiums</p>
                  </div>
                </label>
              </div>
            )}

            {category === 'motor' && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <label className="text-navy-950 dark:text-white">Vehicle Est. Value (IDV)</label>
                    <span className="text-gold-500">₹{vehicleValue.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="150000"
                    step="2500"
                    value={vehicleValue}
                    onChange={(e) => setVehicleValue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-navy-900 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>₹5,000</span>
                    <span>₹150,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Vehicle Age (Years)</label>
                    <select
                      value={vehicleAge}
                      onChange={(e) => setVehicleAge(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-gold-400 text-sm font-medium text-navy-950 dark:text-white"
                    >
                      <option value="0">Brand New (&lt; 1 Year)</option>
                      <option value="1">1 - 2 Years</option>
                      <option value="3">2 - 5 Years</option>
                      <option value="6">5+ Years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Deductible Selection</label>
                    <select
                      value={deductible}
                      onChange={(e) => setDeductible(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-gold-400 text-sm font-medium text-navy-950 dark:text-white"
                    >
                      <option value="100">₹100 deductible</option>
                      <option value="250">₹250 deductible</option>
                      <option value="500">₹500 deductible</option>
                      <option value="1000">₹1,00,000 deductible</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-navy-900/50 rounded-xl border border-slate-200/50 dark:border-white/5 cursor-pointer max-w-md">
                  <input
                    type="checkbox"
                    checked={roadsideAssistance}
                    onChange={(e) => setRoadsideAssistance(e.target.checked)}
                    className="rounded text-gold-500 focus:ring-gold-400 h-4 w-4 bg-slate-100 dark:bg-navy-900"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-navy-950 dark:text-white">Roadside Assistance Rider</p>
                    <p className="text-[10px] text-slate-400 leading-none">24/7 towing, emergency jumpstarts, locks, etc.</p>
                  </div>
                </label>
              </div>
            )}

            {category === 'home' && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <label className="text-navy-950 dark:text-white">Structure Insured Value</label>
                    <span className="text-gold-500">₹{homeValue.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="1000000"
                    step="100000"
                    value={homeValue}
                    onChange={(e) => setHomeValue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-navy-900 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>₹50,000</span>
                    <span>₹1,000,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Property Structural Age (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="80"
                    value={homeAge}
                    onChange={(e) => setHomeAge(Number(e.target.value))}
                    className="w-full max-w-xs px-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-gold-400 text-sm font-medium text-navy-950 dark:text-white"
                  />
                </div>
              </div>
            )}

            {category === 'travel' && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <label className="text-navy-950 dark:text-white">Trip Duration (Days)</label>
                    <span className="text-gold-500">{duration} Days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="90"
                    step="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-navy-900 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>1 Day</span>
                    <span>90 Days</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Travel Destination Tier</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full max-w-xs px-4 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-gold-400 text-sm font-medium text-navy-950 dark:text-white"
                  >
                    <option value="domestic">Domestic Travel / Regionally</option>
                    <option value="worldwide">Worldwide (Including USA/Canada)</option>
                  </select>
                </div>
              </div>
            )}

            {category === 'sip' && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <label className="text-navy-950 dark:text-white">Monthly Investment</label>
                    <span className="text-gold-500">₹{sipMonthly.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={sipMonthly}
                    onChange={(e) => setSipMonthly(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-navy-900 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>₹500</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-2">
                      <label className="text-navy-950 dark:text-white">Expected Return Rate (p.a.)</label>
                      <span className="text-gold-500">{sipReturnRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="0.5"
                      value={sipReturnRate}
                      onChange={(e) => setSipReturnRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-navy-900 rounded-lg appearance-none cursor-pointer accent-gold-500"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>5%</span>
                      <span>30%</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-2">
                      <label className="text-navy-950 dark:text-white">Time Period</label>
                      <span className="text-gold-500">{sipYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={sipYears}
                      onChange={(e) => setSipYears(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-navy-900 rounded-lg appearance-none cursor-pointer accent-gold-500"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>1 Year</span>
                      <span>30 Years</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {category === 'ai' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <label className="text-navy-950 dark:text-white">Target Monthly Budget</label>
                    <span className="text-gold-500">₹{aiMonthlyBudget.toLocaleString()}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="50000"
                    step="500"
                    value={aiMonthlyBudget}
                    onChange={(e) => setAiMonthlyBudget(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-navy-900 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>₹2,000</span>
                    <span>₹50,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Age Bracket</label>
                    <select
                      value={aiAge}
                      onChange={(e) => setAiAge(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white"
                    >
                      <option value="18-35">Young Adult (18-35)</option>
                      <option value="36-50">Mid-Career (36-50)</option>
                      <option value="50+">Senior Care (50+)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Dependents</label>
                    <select
                      value={aiDependents}
                      onChange={(e) => setAiDependents(Number(e.target.value))}
                      className="w-full px-3 py-2.5 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white"
                    >
                      <option value="0">No Dependents</option>
                      <option value="1">1 Dependent</option>
                      <option value="2">2 Dependents</option>
                      <option value="3">3+ Dependents</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Risk Strategy</label>
                    <select
                      value={aiRisk}
                      onChange={(e) => setAiRisk(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white"
                    >
                      <option value="conservative">Conservative</option>
                      <option value="balanced">Balanced Focus</option>
                      <option value="aggressive">Aggressive/Dynamic</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Output Panel */}
        <div>
          {category === 'sip' ? (
            <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 border border-gold-400/20 sticky top-24 text-center overflow-hidden">
              {/* Glossy Overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Total Wealth Created</h3>

              <div className="my-6 relative inline-block">
                {/* Gold glowing circle */}
                <div className="w-42 h-42 rounded-full border-4 border-slate-100 dark:border-navy-900 flex flex-col items-center justify-center shadow-lg relative bg-navy-950/20 dark:bg-navy-900/35">
                  <div className="text-center p-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Est. Future Value</p>
                    <p className="text-xl font-extrabold text-gold-500 tracking-tight mt-1">₹{sipResults.total.toLocaleString()}</p>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">At End of {sipYears} Yrs</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-left">
                <div className="flex justify-between items-center text-xs py-2 border-b border-slate-200/50 dark:border-white/5">
                  <span className="text-slate-400">Total Invested Amount</span>
                  <span className="font-semibold text-navy-950 dark:text-white">₹{sipResults.invested.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-2 border-b border-slate-200/50 dark:border-white/5">
                  <span className="text-slate-400">Estimated Wealth Gain</span>
                  <span className="font-semibold text-emerald-500">₹{sipResults.gain.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-2 border-b border-slate-200/50 dark:border-white/5">
                  <span className="text-slate-400">Expected ROI (p.a.)</span>
                  <span className="font-semibold text-gold-500">{sipReturnRate}%</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal text-center">
                  *Compound interest estimates calculated monthly assuming constant rate parameters. Actual mutual fund returns may vary.
                </p>
              </div>

              <Button
                variant="gold"
                className="w-full py-3"
                icon={FaShieldAlt}
                onClick={() => setShowBuyModal(true)}
              >
                Invest in Mutual Funds Now
              </Button>
            </div>
          ) : (
            <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 border border-gold-400/20 sticky top-24 text-center overflow-hidden">
              {/* Glossy Overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('estimated_monthly_premium')}</h3>

              <div className="my-8 relative inline-block">
                {/* Gold glowing circle */}
                <div className="w-40 h-40 rounded-full border-4 border-slate-100 dark:border-navy-900 flex flex-col items-center justify-center shadow-lg relative">
                  {/* SVG circular track indicator */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="76"
                      className="stroke-gold-400 fill-none"
                      strokeWidth="4"
                      strokeDasharray="478"
                      strokeDashoffset={478 - (478 * Math.min(premium, 400)) / 400}
                      style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                    />
                  </svg>
                  <div className="flex items-start text-navy-950 dark:text-white font-bold leading-none">
                    <span className="text-xl mt-1">₹</span>
                    <span className="text-5xl font-extrabold tracking-tight">{premium}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">INR / Month</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-xs py-2 border-b border-slate-200/50 dark:border-white/5">
                  <span className="text-slate-400">Coverage Selection</span>
                  <span className="font-semibold text-navy-950 dark:text-white">₹{coverage.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-2 border-b border-slate-200/50 dark:border-white/5">
                  <span className="text-slate-400">Risk Assessment Factor</span>
                  <span className="font-semibold text-gold-500">Optimal Standard</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  *This is an approximate illustration. Actual underwriting metrics may apply final rates upon application checks.
                </p>
              </div>

              <Button
                variant="gold"
                className="w-full py-3"
                icon={FaShieldAlt}
                onClick={() => setShowBuyModal(true)}
              >
                Get Fully Covered Now
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Buy Flow Modal */}
      <Modal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} title={category === 'sip' ? "SK Mutual Fund SIP Setup Wizard" : "SK Smart Policy Application Wizard"} size="md">
        {successBuy ? (
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 text-4xl mb-2 animate-bounce">
              <FaUserCheck />
            </div>
            <h3 className="text-xl font-bold text-navy-950 dark:text-white">
              {category === 'sip' ? 'SIP Setup Authorized!' : 'Application Approved!'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {category === 'sip'
                ? 'Your SIP auto-debit registration has been registered. View portfolio statuses inside dashboard.'
                : 'Your mock policy has been issued. Check the Customer Dashboard to view documents or submit claims.'
              }
            </p>
          </div>
        ) : (
          <form onSubmit={handlePurchaseMock} className="space-y-4 pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {category === 'sip'
                ? `Please finalize details below to register your monthly SIP contribution of ₹${sipMonthly.toLocaleString()}.`
                : `Please finalize details below to secure your ${category.toUpperCase()} insurance package.`
              }
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Legal Name</label>
                <input required type="text" placeholder="Your Name" value={buyName} onChange={(e) => setBuyName(e.target.value)} className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                <input required type="email" placeholder="Enter Email" value={buyEmail} onChange={(e) => setBuyEmail(e.target.value)} className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
              </div>
            </div>

            {category !== 'sip' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Upload Identification (ID Copy)</label>
                <div className="p-4 border border-dashed border-slate-200 dark:border-white/10 rounded-lg text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-900 transition-colors">
                  <p className="text-[10px] text-slate-400">Click to upload driver license, passport, or medical records</p>
                </div>
              </div>
            )}

            <div className="p-3 bg-slate-100 dark:bg-navy-900 rounded-xl border border-slate-200/50 dark:border-white/5 space-y-2">
              <p className="text-xs font-bold text-navy-950 dark:text-white">
                {category === 'sip' ? 'SIP Investment Summary' : 'Premium Details Summary'}
              </p>
              {category === 'sip' ? (
                <>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Monthly Contribution:</span>
                    <span className="font-bold text-gold-500">₹{sipMonthly.toLocaleString()}/mo</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Investment Tenure:</span>
                    <span className="text-navy-950 dark:text-white">{sipYears} Years</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Recurring Monthly Payment:</span>
                    <span className="font-bold text-gold-500">₹{premium}/mo</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Selected Deductible:</span>
                    <span className="text-navy-950 dark:text-white">₹{deductible}</span>
                  </div>
                </>
              )}
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowBuyModal(false)}>Cancel</Button>
              <Button type="submit" variant="gold">
                {category === 'sip' ? 'Authorize SIP Auto-Debit' : 'Process Payout & Activate'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
export default Calculator;
