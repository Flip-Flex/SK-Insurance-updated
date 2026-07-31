import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
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
  FaArrowLeft,
  FaCheckCircle
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
      setErrorMsg(t('invalid_credentials') || 'Invalid credentials');
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
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-neutral-200 relative overflow-hidden font-sans selection:bg-brand-accent selection:text-black">
      
      {/* Left Pane - Cinematic Storytelling */}
      <div className="w-full md:w-[50%] lg:w-[55%] relative hidden md:flex flex-col justify-between p-12 lg:p-16 text-white h-screen overflow-hidden shrink-0 border-r border-white/5">
        
        {/* Animated Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-brand-accent/15 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-0 right-0 w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay z-10" />
        </div>
        


        {/* Mid Quote Section */}
        <div className="relative z-20 max-w-lg space-y-6">
          <h1 className="text-5xl lg:text-6xl font-[900] tracking-tight leading-[1.1] text-white uppercase">
            Secure Wealth. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-white">Protect Generations.</span>
          </h1>
          <p className="text-neutral-400 text-lg font-light leading-relaxed">Access your premium portfolio and take control of your financial future with absolute transparency and unmatched expertise.</p>
        </div>

        {/* Bottom stats row */}
        <div className="relative z-20 grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
          <div className="bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6">
            <p className="text-3xl font-[900] text-white mb-2">98.7%</p>
            <p className="text-[10px] uppercase tracking-widest text-brand-accent font-bold">Claims Settled</p>
          </div>
          <div className="bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6">
            <p className="text-3xl font-[900] text-white mb-2">5k+</p>
            <p className="text-[10px] uppercase tracking-widest text-brand-accent font-bold">Families</p>
          </div>
          <div className="bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6">
            <p className="text-3xl font-[900] text-white mb-2">150Cr</p>
            <p className="text-[10px] uppercase tracking-widest text-brand-accent font-bold">AUM Managed</p>
          </div>
        </div>
      </div>

      {/* Right Pane - Polished Glassmorphic Form Container */}
      <div className="w-full md:w-[50%] lg:w-[45%] flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 h-screen overflow-y-auto bg-black relative">
        
        {/* Background decorative glow on mobile */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none md:hidden" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay z-0 md:hidden" />



        {/* Form panel card */}
        <div className="w-full max-w-md relative z-10">
          
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[32px] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {!isForgot && (
              <div className="text-center md:text-left space-y-2 mb-8 relative z-10">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <Link 
                    to="/" 
                    className="w-10 h-10 bg-white/5 hover:bg-brand-accent hover:text-black rounded-full text-white border border-white/10 transition-colors flex items-center justify-center cursor-pointer"
                    title="Back to Home"
                  >
                    <FaArrowLeft className="text-sm" />
                  </Link>
                  <h2 className="text-3xl font-[900] text-white uppercase tracking-tight">
                    {!isRegister ? 'Welcome' : 'Create Account'}
                  </h2>
                </div>
                <p className="text-sm text-neutral-400 font-light pl-[56px] hidden md:block">
                  {!isRegister 
                    ? 'Secure access to your portfolios.' 
                    : 'Sign up for tailored coverage.'}
                </p>
              </div>
            )}

            {/* Sign In / Register Tab Selector */}
            {!isForgot && (
              <div className="flex p-1.5 bg-black/50 rounded-2xl mb-8 border border-white/5 relative z-10">
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setErrorMsg(''); }}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm text-center transition-all duration-300 cursor-pointer ${
                    !isRegister
                      ? 'bg-neutral-800 text-white shadow-md border border-white/10'
                      : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setErrorMsg(''); }}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm text-center transition-all duration-300 cursor-pointer ${
                    isRegister
                      ? 'bg-neutral-800 text-white shadow-md border border-white/10'
                      : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            {/* Error Message Panel */}
            {errorMsg && (
              <div className="p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-sm relative z-10">
                <FaExclamationTriangle className="shrink-0 text-lg" />
                <p className="font-medium">{errorMsg}</p>
              </div>
            )}

            {/* Registration Success Overlay */}
            {registerSuccess && (
              <div className="p-4 mb-6 bg-brand-accent/10 border border-brand-accent/30 rounded-2xl flex items-center gap-3 text-brand-accent text-sm relative z-10">
                <FaInfoCircle className="shrink-0 text-lg" />
                <p className="font-medium">Registration successful! A verification link has been sent.</p>
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
                  className="relative z-10"
                >
                  <form onSubmit={handleForgotSubmit} className="space-y-5">
                    <div className="text-center md:text-left space-y-2 mb-8">
                      <h2 className="text-3xl font-[900] text-white uppercase tracking-tight">Reset Password</h2>
                      <p className="text-sm text-neutral-400 font-light">Enter your email and we'll send a recovery link.</p>
                    </div>

                    {forgotSuccess && (
                      <div className="p-4 mb-6 bg-brand-accent/10 border border-brand-accent/30 rounded-2xl flex items-center gap-3 text-brand-accent text-sm">
                        <FaInfoCircle className="shrink-0 text-lg" />
                        <p className="font-medium">Password reset link dispatched to your inbox!</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-500">
                          <FaEnvelope />
                        </span>
                        <input
                          required
                          type="email"
                          placeholder="Enter Email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-4 bg-black/50 border border-white/10 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:border-brand-accent transition-colors font-medium text-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col space-y-4">
                      <button type="submit" className="w-full py-4 bg-brand-accent text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(246,255,0,0.15)] cursor-pointer">
                        Send Reset Link
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsForgot(false); setErrorMsg(''); }}
                        className="py-4 text-neutral-400 hover:text-white font-bold text-sm uppercase tracking-widest transition-colors cursor-pointer"
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
                  className="relative z-10"
                >
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                        Client ID or Email
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-500">
                          <FaEnvelope />
                        </span>
                        <input
                          required
                          type="text"
                          placeholder="Enter your Client ID"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-4 bg-black/50 border border-white/10 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:border-brand-accent focus:bg-black transition-colors font-medium text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                        Secure Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-500">
                          <FaKey />
                        </span>
                        <input
                          required
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-11 pr-12 py-4 bg-black/50 border border-white/10 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:border-brand-accent focus:bg-black transition-colors font-medium text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-white cursor-pointer transition-colors"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-neutral-500 px-1 pt-2">
                      <label className="flex items-center space-x-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={rememberMe} 
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="peer appearance-none w-5 h-5 rounded border border-white/20 bg-black/50 checked:bg-brand-accent checked:border-brand-accent transition-colors cursor-pointer"
                          />
                          <FaCheckCircle className="absolute text-black text-[10px] opacity-0 peer-checked:opacity-100 pointer-events-none" />
                        </div>
                        <span className="group-hover:text-white transition-colors">Remember Me</span>
                      </label>
                      <button 
                        type="button" 
                        onClick={() => { setIsForgot(true); setErrorMsg(''); }}
                        className="text-neutral-400 hover:text-brand-accent transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <div className="pt-6">
                      <button type="submit" className="w-full py-4 bg-brand-accent text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(246,255,0,0.15)] cursor-pointer">
                        {t('sign_in')}
                      </button>
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
                  className="relative z-10"
                >
                  <form onSubmit={handleRegisterSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                        Full Legal Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Enter Name"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:border-brand-accent focus:bg-black transition-colors font-medium text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="Enter Email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:border-brand-accent focus:bg-black transition-colors font-medium text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                        Secure Password
                      </label>
                      <input
                        required
                        type="password"
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-5 py-4 bg-black/50 border border-white/10 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:border-brand-accent focus:bg-black transition-colors font-medium text-sm"
                      />
                    </div>

                    <div className="pt-6">
                      <button type="submit" className="w-full py-4 bg-brand-accent text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(246,255,0,0.15)] cursor-pointer">
                        Register Account
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Credentials Assist Desk & Social */}
          {!isForgot && (
            <div className="pt-8 w-full max-w-md mx-auto relative z-10">
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setShowHints(!showHints)}
                  className="inline-flex items-center text-xs font-bold text-brand-accent hover:text-white transition-colors cursor-pointer"
                >
                  <FaInfoCircle className="mr-2" />
                  {showHints ? 'Hide Access Codes' : 'Show Access Codes'}
                </button>
                
                <AnimatePresence>
                  {showHints && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-neutral-900/40 backdrop-blur-md rounded-2xl border border-white/10 grid grid-cols-3 gap-3 text-center overflow-hidden"
                    >
                      <button 
                        type="button"
                        onClick={() => autofill('customer@mail.com', 'customer@123')}
                        className="py-2.5 bg-black/50 rounded-xl border border-white/5 text-neutral-300 text-xs font-bold hover:border-brand-accent hover:text-brand-accent cursor-pointer transition-colors"
                      >
                        Customer
                      </button>
                      <button 
                        type="button"
                        onClick={() => autofill('manager1@mail.com', 'manager1@123')}
                        className="py-2.5 bg-black/50 rounded-xl border border-white/5 text-neutral-300 text-xs font-bold hover:border-brand-accent hover:text-brand-accent cursor-pointer transition-colors"
                      >
                        Manager
                      </button>
                      <button 
                        type="button"
                        onClick={() => autofill('admin@mail.com', 'admin@123')}
                        className="py-2.5 bg-black/50 rounded-xl border border-white/5 text-neutral-300 text-xs font-bold hover:border-brand-accent hover:text-brand-accent cursor-pointer transition-colors"
                      >
                        Admin
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Social Logins */}
              <div className="relative my-10 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative px-4 text-xs font-bold uppercase tracking-widest text-neutral-500 bg-black">
                  or continue with
                </span>
              </div>

              <div className="flex justify-center space-x-4">
                <button type="button" className="w-14 h-14 rounded-full border border-white/10 hover:border-brand-accent bg-neutral-900/40 hover:bg-brand-accent hover:text-black text-white transition-all cursor-pointer flex items-center justify-center">
                  <FaApple className="text-xl" />
                </button>
                <button type="button" className="w-14 h-14 rounded-full border border-white/10 hover:border-brand-accent bg-neutral-900/40 hover:bg-brand-accent hover:text-black text-white transition-all cursor-pointer flex items-center justify-center">
                  <FaGoogle className="text-xl" />
                </button>
                <button type="button" className="w-14 h-14 rounded-full border border-white/10 hover:border-brand-accent bg-neutral-900/40 hover:bg-brand-accent hover:text-black text-white transition-all cursor-pointer flex items-center justify-center">
                  <FaMicrosoft className="text-xl" />
                </button>
              </div>

              {/* Bottom Tagline */}
              <p className="text-[10px] text-neutral-600 font-bold tracking-widest text-center mt-10 uppercase">
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
