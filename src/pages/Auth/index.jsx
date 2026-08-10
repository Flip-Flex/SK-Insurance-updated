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

  const [email, setEmail] = useState('manager@mail.com');
  const [password, setPassword] = useState('manager@123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [rememberMe, setRememberMe] = useState(true);

  // Password reset states
  const [isForgot, setIsForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password, rememberMe);
    if (result === true) {
      setErrorMsg('');
      navigate('/dashboard');
    } else {
      setErrorMsg(typeof result === 'string' ? result : (t('invalid_credentials') || 'Invalid credentials'));
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


  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans selection:bg-brand-accent selection:text-black bg-black">
      
      {/* Background Image & Blur */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
          alt="Premium Architecture" 
          className="w-full h-full object-cover opacity-[0.35] blur-[2px] scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black/95 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />
      </div>

      <div className="w-full max-w-[460px] relative z-10 px-4 py-8 max-h-screen overflow-y-auto scrollbar-hide">
        <div className="bg-neutral-950/70 backdrop-blur-3xl border border-white/10 p-8 sm:p-10 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-50" />

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
                    Welcome
                  </h2>
                </div>
                <p className="text-sm text-neutral-400 font-light pl-[56px] hidden md:block">
                  Secure access to your account.
                </p>
              </div>
            )}

            {/* Error Message Panel */}
            {errorMsg && (
              <div className="p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-sm relative z-10">
                <FaExclamationTriangle className="shrink-0 text-lg" />
                <p className="font-medium">{errorMsg}</p>
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
              ) : (
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
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-500">
                          <FaEnvelope />
                        </span>
                        <input
                          required
                          type="text"
                          placeholder="Enter your email"
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
              )}
            </AnimatePresence>
          </div>


        {/* Bottom Tagline */}
        <p className="text-[10px] text-neutral-600 font-bold tracking-widest text-center mt-10 uppercase">
          Personalised. Secure. Invest in you.
        </p>
      </div>
    </div>
  );
};

export default Auth;
