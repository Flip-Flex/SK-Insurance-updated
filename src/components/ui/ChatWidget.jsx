import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

export const ChatWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I am your SK Smart Assistant. How can I help you today?', time: 'Just now' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQueries = [
    { text: 'About SK Smart / MD', reply: 'SK Smart Investments is a premier insurance and financial planning firm managed by MD Prakash Gajendiran at Kanchipuram. We distribute Tata AIA, LIC, HDFC Life, and more. Redirecting you to our About Us page...' },
    { text: 'Check Claim Status', reply: 'To check your claims, please sign in and visit your Customer Dashboard. Active validation statuses are visible on the Claims tab.' },
    { text: 'Calculate Policy Premium', reply: 'You can estimate policy premiums by visiting our Premium Calculator page, which also features our new Mutual Fund SIP calculator!' },
    { text: 'Contact Corporate Office', reply: 'Our headquarters is at # 104, MD Plaza, 1st Floor, West Raja Street, Kanchipuram - 631502. Email: skinvestments2025@gmail.com.' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Trigger typing state
    setIsTyping(true);

    // Determine reply
    let replyText = "Thank you for reaching out! An underwriting representative has been notified and will contact you via email shortly.";
    let shouldRedirectAbout = false;

    const queryText = text.toLowerCase();
    const matchingQuery = quickQueries.find(q => q.text.toLowerCase() === queryText);

    if (matchingQuery) {
      replyText = matchingQuery.reply;
      if (matchingQuery.text === 'About SK Smart / MD') {
        shouldRedirectAbout = true;
      }
    } else if (
      queryText.includes('sk') || 
      queryText.includes('company') || 
      queryText.includes('about') || 
      queryText.includes('details') || 
      queryText.includes('director') || 
      queryText.includes('prakash')
    ) {
      replyText = "SK Smart Investments is a premier insurance and financial planning firm managed by MD Prakash Gajendiran at Kanchipuram. We distribute Tata AIA, LIC, HDFC Life, and more. Redirecting you to our About Us page...";
      shouldRedirectAbout = true;
    }

    setTimeout(() => {
      setIsTyping(false);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);

      if (shouldRedirectAbout) {
        setTimeout(() => {
          navigate('/about');
          setIsOpen(false);
        }, 2200);
      }
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-80 sm:w-96 h-[480px] bg-white dark:bg-navy-950 border border-slate-200/60 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-navy-900 to-navy-950 dark:from-navy-950 dark:to-navy-900 p-4 border-b border-slate-200/40 dark:border-white/5 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/30 text-gold-500">
                    <FaRobot className="text-xl" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-navy-950 rounded-full" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-bold leading-tight">SK Smart Assistant</h3>
                  <p className="text-[9px] text-slate-400">Agent Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>
            {/* WhatsApp Direct Banner */}
            <a 
              href="https://wa.me/919840723956?text=Hi%20SK%20Smart%20Investments%2C%20I%20have%20a%20query%20about%20your%20services."
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-emerald-500/10 hover:bg-emerald-500/20 border-b border-emerald-500/25 px-4 py-2.5 flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-bold transition-all group shrink-0"
            >
              <div className="flex items-center space-x-2">
                <FaWhatsapp className="text-sm text-emerald-500 animate-pulse" />
                <span>Prefer human support? Chat on WhatsApp</span>
              </div>
              <span className="group-hover:translate-x-0.5 transition-transform">➔</span>
            </a>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-navy-900/10 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                    msg.sender === 'user' ? 'bg-gold-500 text-white' : 'bg-slate-200 dark:bg-navy-800 text-navy-950 dark:text-white border border-slate-300/40 dark:border-white/5'
                  }`}>
                    {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
                  </div>
                  <div className="max-w-[70%] text-left space-y-1">
                    <div className={`p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-gold-500 text-white rounded-tr-none'
                        : 'bg-white dark:bg-navy-900 border border-slate-200/40 dark:border-white/5 rounded-tl-none text-navy-950 dark:text-slate-200'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <p className="text-[9px] text-slate-400 px-1">{msg.time}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-navy-800 flex items-center justify-center text-[10px] text-navy-950 dark:text-white">
                    <FaRobot />
                  </div>
                  <div className="p-3 bg-white dark:bg-navy-900 border border-slate-200/40 dark:border-white/5 rounded-2xl rounded-tl-none flex items-center space-x-1.5 py-4">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Queries list */}
            {messages.length === 1 && !isTyping && (
              <div className="px-4 py-2 bg-slate-50/50 dark:bg-navy-900/20 border-t border-slate-200/20 dark:border-white/5 text-left">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Common Questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickQueries.map((q) => (
                    <button
                      key={q.text}
                      onClick={() => handleSendMessage(q.text)}
                      className="px-2 py-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-[9px] text-navy-950 dark:text-slate-300 font-semibold hover:border-gold-500 dark:hover:border-gold-500 cursor-pointer hover:bg-gold-500/5 transition-all"
                    >
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form Footer */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
              className="p-3 bg-white dark:bg-navy-950 border-t border-slate-200/50 dark:border-white/5 flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Ask your query here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-navy-900 border border-slate-200/60 dark:border-white/10 rounded-xl text-xs text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-xl transition-all cursor-pointer transform active:scale-95"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gold-500 hover:bg-gold-600 text-white flex items-center justify-center shadow-xl hover:shadow-gold-500/20 hover:shadow-2xl transition-all cursor-pointer transform hover:scale-[1.05] active:scale-95 duration-200 border border-gold-400/20 relative"
      >
        {isOpen ? <FaTimes className="text-lg" /> : <FaComments className="text-xl animate-pulse" />}
      </button>
    </div>
  );
};
export default ChatWidget;
