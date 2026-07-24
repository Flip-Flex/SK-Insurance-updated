import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { 
  FaKey, 
  FaEnvelope, 
  FaEye, 
  FaEyeSlash, 
  FaApple, 
  FaGoogle, 
  FaMicrosoft, 
  FaPlus, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaArrowLeft 
} from 'react-icons/fa';

export const Auth = () => {
  const { login, register, sendPasswordReset } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration states
  const [isRegister, setIsRegister] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Password reset states
  const [isForgot, setIsForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) return;
    try {
      setErrorMsg('');
      const success = await register(regEmail, regPassword, regName);
      if (success) {
        setRegisterSuccess(true);
        setTimeout(() => {
          setRegisterSuccess(false);
          setIsRegister(false);
          setEmail(regEmail);
          setRegName('');
          setRegEmail('');
          setRegPassword('');
        }, 2000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password, rememberMe);
    if (success) {
      setErrorMsg('');
      navigate('/dashboard');
    } else {
      setErrorMsg(t('invalid_credentials'));
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    try {
      setErrorMsg('');
      const success = await sendPasswordReset(forgotEmail);
      if (success) {
        setForgotSuccess(true);
        setForgotEmail('');
        setTimeout(() => {
          setForgotSuccess(false);
          setIsForgot(false);
        }, 4000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send recovery email');
    }
  };

  const autofill = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-navy-955 text-slate-800 dark:text-slate-100 relative overflow-hidden">
      

      
      {/* Left Pane - Immersive Full-Screen Video Panel */}
      <div className="w-full md:w-[50%] lg:w-[55%] relative hidden md:flex flex-col justify-between p-12 text-white h-screen overflow-hidden shrink-0 border-r border-slate-200/50 dark:border-white/5">
        
        {/* Background Loop Video */}
        <video 
          className="absolute inset-0 w-full h-full object-cover z-0" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/this_looks_soo_basic.mp4" type="video/mp4" />
        </video>

        {/* Dark Glassy Overlay to preserve logo contrast */}
        <div className="absolute inset-0 bg-navy-950/45 dark:bg-navy-950/60 z-10 backdrop-blur-[1px]" />
        
        {/* Top Branding Section */}
        <div className="relative z-20 flex items-center space-x-5 p-4 bg-white/5 dark:bg-navy-900/15 backdrop-blur-lg rounded-3xl border border-white/15 w-fit shadow-xl">
          <div className="w-24 h-24 rounded-full bg-white p-2.5 border border-white/20 shadow-lg">
            <img 
              src="/logo.png" 
              alt="SK Smart Investments Logo" 
              className="w-full h-full object-contain rounded-full animate-fadeIn"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-wider uppercase text-white drop-shadow-md">SK Smart</h2>
            <p className="text-xs uppercase tracking-widest font-black text-gold-400">Investments</p>
          </div>
        </div>

        {/* Mid Quote Section */}
        <div className="relative z-20 max-w-md space-y-4">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Secure wealth.<br />
            Protect generations.
          </h1>
        </div>

        {/* Bottom stats row */}
        <div className="relative z-20 grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
          <div>
            <p className="text-lg font-black text-gold-400">98.7%</p>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Claims Settled</p>
          </div>
          <div>
            <p className="text-lg font-black text-gold-400">5k+</p>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Families Covered</p>
          </div>
          <div>
            <p className="text-lg font-black text-gold-400">₹150Cr+</p>
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">AUM Managed</p>
          </div>
        </div>
      </div>

      {/* Right Pane - Polished Form Container */}
      <div className="w-full md:w-[50%] lg:w-[45%] flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 h-screen overflow-y-auto bg-white dark:bg-navy-950 relative">
        
        {/* Background decorative glow on mobile */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none md:hidden" />
        
        {/* Mobile Header */}
        <div className="flex items-center space-x-4 mb-6 md:hidden">
          <div className="w-16 h-16 rounded-full bg-white p-1.5 border border-slate-200 dark:border-white/10 shadow-md">
            <img 
              src="/logo.png" 
              alt="SK Smart Investments Logo" 
              className="w-full h-full object-contain rounded-full animate-fadeIn"
            />
          </div>
          <div className="text-left space-y-0.5">
            <h2 className="text-lg font-black tracking-wider uppercase text-navy-955 dark:text-white">SK Smart</h2>
            <p className="text-[10px] uppercase tracking-widest font-black text-gold-500">Investments</p>
          </div>
        </div>

        {/* Form panel card */}
        <div className="w-full max-w-md space-y-6">
          {!isForgot && (
            <div className="text-center md:text-left space-y-1">
              <div className="flex items-center justify-center md:justify-start space-x-3.5">
                <Link 
                  to="/" 
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-navy-900 dark:hover:bg-navy-800/80 rounded-full text-slate-600 dark:text-slate-300 hover:text-gold-500 dark:hover:text-gold-400 border border-slate-200/60 dark:border-white/5 transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
                  title="Back to Home"
                >
                  <FaArrowLeft className="text-xs" />
                </Link>
                <h2 className="text-xl sm:text-2xl font-black text-navy-950 dark:text-white">
                  {!isRegister ? 'Welcome' : 'Create Account'}
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-medium pl-1">
                {!isRegister 
                  ? 'Enter credentials to manage your policies and investment portfolios.' 
                  : 'Sign up to secure tailored coverage plans.'}
              </p>
            </div>
          )}

          {/* Sign In / Register Tab Selector */}
          {!isForgot && (
            <div className="flex p-1 bg-slate-100 dark:bg-navy-900/60 rounded-2xl text-xs sm:text-sm border border-slate-200/40 dark:border-white/5">
              <button
                type="button"
                onClick={() => { setIsRegister(false); setErrorMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-center transition-all duration-300 transform cursor-pointer active:scale-95 ${
                  !isRegister
                    ? 'bg-white dark:bg-navy-950 text-navy-950 dark:text-white shadow-md'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setErrorMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-center transition-all duration-300 transform cursor-pointer active:scale-95 ${
                  isRegister
                    ? 'bg-white dark:bg-navy-950 text-navy-950 dark:text-white shadow-md'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* Error Message Panel */}
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900/30 rounded-xl flex items-center space-x-2 text-red-600 dark:text-red-400 text-xs animate-shake">
              <FaExclamationTriangle className="shrink-0 text-base" />
              <p className="font-medium text-left">{errorMsg}</p>
            </div>
          )}

          {/* Registration Success Overlay */}
          {registerSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200/50 dark:border-emerald-900/30 rounded-xl flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs animate-fadeIn">
              <FaInfoCircle className="shrink-0 text-base" />
              <p className="font-medium text-left">Registration successful! A verification link has been sent to your email.</p>
            </div>
          )}

          {/* Forms */}
          <AnimatePresence mode="wait">
            {isForgot ? (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                  <div className="text-left space-y-1">
                    <h2 className="text-xl font-black text-navy-950 dark:text-white">Reset Password</h2>
                    <p className="text-xs text-slate-400 font-medium">Enter your email and we'll send a password recovery link.</p>
                  </div>

                  {forgotSuccess && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900/30 rounded-xl flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs animate-fadeIn">
                      <FaInfoCircle className="shrink-0 text-base" />
                      <p className="font-medium text-left">Password reset link has been dispatched to your inbox!</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <FaEnvelope />
                      </span>
                      <input
                        required
                        type="email"
                        placeholder="Enter Email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col space-y-2">
                    <Button type="submit" variant="gold" className="w-full py-3 rounded-2xl font-bold tracking-wider hover:shadow-lg hover:shadow-gold-500/10 transition-shadow">
                      Send Reset Link
                    </Button>
                    <button
                      type="button"
                      onClick={() => { setIsForgot(false); setErrorMsg(''); }}
                      className="py-2.5 rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-900 transition-colors cursor-pointer text-xs"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : !isRegister ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                      Client ID or Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <FaEnvelope />
                      </span>
                      <input
                        required
                        type="text"
                        placeholder="Enter your Client ID"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                      Secure Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                        <FaKey />
                      </span>
                      <input
                        required
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500 text-xs font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-gold-500 rounded border-slate-300 dark:border-white/10"
                      />
                      <span>Remember Me</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => { setIsForgot(true); setErrorMsg(''); }}
                      className="text-gold-500 hover:underline cursor-pointer font-bold"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" variant="gold" className="w-full py-3 rounded-2xl font-bold tracking-wider hover:shadow-lg hover:shadow-gold-500/10 transition-shadow">
                      {t('sign_in')}
                    </Button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                      Full Legal Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Enter Name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="Enter Email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                      Secure Password
                    </label>
                    <input
                      required
                      type="password"
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-white/5 rounded-2xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500 text-xs font-semibold"
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" variant="gold" className="w-full py-3 rounded-2xl font-bold tracking-wider hover:shadow-lg hover:shadow-gold-500/10 transition-shadow">
                      Register Account
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Credentials Assist Desk */}
          {!isForgot && (
            <div className="pt-2">
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setShowHints(!showHints)}
                  className="inline-flex items-center text-[10px] font-bold text-gold-500 hover:underline cursor-pointer"
                >
                  <FaInfoCircle className="mr-1 text-xs" />
                  {showHints ? 'Hide Credentials Assist' : 'Show Credentials Assist'}
                </button>
                
                {showHints && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-navy-900 rounded-2xl border border-slate-200/50 dark:border-white/5 grid grid-cols-3 gap-2 text-center text-[9px] animate-fadeIn">
                    <button 
                      type="button"
                      onClick={() => autofill('customer@mail.com', 'customer@123')}
                      className="py-1.5 bg-white dark:bg-navy-955 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold hover:border-gold-500 cursor-pointer shadow-sm"
                    >
                      Customer
                    </button>
                    <button 
                      type="button"
                      onClick={() => autofill('manager1@mail.com', 'manager1@123')}
                      className="py-1.5 bg-white dark:bg-navy-955 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold hover:border-gold-500 cursor-pointer shadow-sm"
                    >
                      Manager
                    </button>
                    <button 
                      type="button"
                      onClick={() => autofill('admin@mail.com', 'admin@123')}
                      className="py-1.5 bg-white dark:bg-navy-955 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold hover:border-gold-500 cursor-pointer shadow-sm"
                    >
                      Admin
                    </button>
                  </div>
                )}
              </div>

              {/* Social Logins */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100 dark:border-white/5" />
                </div>
                <span className="relative px-3 text-[9px] uppercase text-slate-400 bg-white dark:bg-navy-950 font-bold">
                  Social Sign In
                </span>
              </div>

              <div className="flex justify-center space-x-3">
                <button type="button" className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-navy-900 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shadow-sm">
                  <FaApple className="text-sm" />
                </button>
                <button type="button" className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-navy-900 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shadow-sm">
                  <FaGoogle className="text-sm" />
                </button>
                <button type="button" className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-navy-900 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shadow-sm">
                  <FaMicrosoft className="text-sm" />
                </button>
                <button type="button" className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-navy-900 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shadow-sm">
                  <FaPlus className="text-sm" />
                </button>
              </div>

              {/* Bottom Tagline */}
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider text-center mt-6 uppercase">
                Personalised. Secure. Invest in you.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
