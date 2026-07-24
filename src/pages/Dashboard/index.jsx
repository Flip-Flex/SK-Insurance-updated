import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sidebar } from '../../components/layout/Sidebar';
import { CustomerDashboard } from '../../dashboards/CustomerDashboard';
import { AgentDashboard } from '../../dashboards/AgentDashboard';
import { TelecallerDashboard } from '../../dashboards/TelecallerDashboard';
import { EmployeeDashboard } from '../../dashboards/EmployeeDashboard';
import { ManagerDashboard } from '../../dashboards/ManagerDashboard';
import { AdminDashboard } from '../../dashboards/AdminDashboard';
import { NOTIFICATIONS } from '../../services/mockData';
import { FaBell, FaChevronDown, FaUserCircle, FaCheckCircle, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { isFirebaseConfigured } from '../../config/firebase';

export const Dashboard = () => {
  const { user, switchRole, sendVerificationEmail } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { tab } = useParams();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [showNtfDropdown, setShowNtfDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Redirect to Auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleNtfClick = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      await sendVerificationEmail();
      setResendSent(true);
      setTimeout(() => setResendSent(false), 5000);
    } catch (error) {
      console.error("Failed to resend verification email:", error);
    } finally {
      setResendLoading(false);
    }
  };

  const renderRoleDashboard = () => {
    switch (user.role) {
      case 'customer':
        return <CustomerDashboard tab={tab} />;
      case 'agent':
        return <AgentDashboard tab={tab} />;
      case 'telecaller':
        return <TelecallerDashboard tab={tab} />;
      case 'employee':
        return <EmployeeDashboard tab={tab} />;
      case 'manager':
        return <ManagerDashboard tab={tab} />;
      case 'admin':
        return <AdminDashboard tab={tab} />;
      default:
        return <CustomerDashboard tab={tab} />;
    }
  };

  const getDashboardTitle = () => {
    const roleLabels = {
      customer: 'Policyholder Workspace',
      agent: 'Underwriting Representative Dashboard',
      telecaller: 'Outbound Leads Dashboard',
      employee: 'Claims Verification Queue',
      manager: 'Operations Leadership Console',
      admin: ''
    };
    return roleLabels[user.role] || 'Insurance Dashboard';
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Dynamic Collapsible Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200/40 dark:border-white/5 bg-white/70 dark:bg-navy-950/70 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-sm font-bold text-navy-950 dark:text-white uppercase tracking-wider font-sans">
              {getDashboardTitle()}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNtfDropdown(!showNtfDropdown);
                  setShowProfileDropdown(false);
                }}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-900 text-slate-500 dark:text-slate-300 relative transition-all cursor-pointer"
              >
                <FaBell className="text-base" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1.5 h-4 w-4 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-[8px] animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNtfDropdown && (
                <div className="absolute right-0 mt-2 w-80 glass-panel dark:glass-panel-gold border border-slate-200/50 dark:border-gold-400/20 rounded-2xl shadow-xl z-50 p-4 text-left overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2 mb-2 text-xs">
                    <span className="font-bold text-navy-950 dark:text-white">Notifications Panel</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[10px] text-gold-500 hover:underline font-semibold cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {notifications.map((ntf) => (
                      <div
                        key={ntf.id}
                        onClick={() => handleNtfClick(ntf.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          ntf.unread
                            ? 'bg-gold-500/5 border-gold-300/30'
                            : 'bg-slate-50/50 dark:bg-navy-900/30 border-transparent hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-navy-950 dark:text-white text-[11px] leading-tight">
                            {ntf.title}
                          </p>
                          <span className="text-[9px] text-slate-400 font-semibold">{ntf.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                          {ntf.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNtfDropdown(false);
                }}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-900 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-navy-800 text-gold-400 flex items-center justify-center font-bold text-xs shrink-0 border border-gold-400/20">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-xs font-semibold hidden md:inline truncate max-w-[80px]">{user.name}</span>
                <FaChevronDown className="text-[10px] text-slate-400" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 glass-panel border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-xl z-50 p-2 text-left">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 text-xs">
                    <p className="font-bold text-navy-950 dark:text-white truncate">{user.name}</p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate('/dashboard/settings');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-200 mt-1 cursor-pointer font-medium"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate('/dashboard/support');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-200 cursor-pointer font-medium"
                  >
                    Help Center
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Main Workspace View */}
        <main className="flex-1 overflow-y-auto p-6 pb-28">
          {isFirebaseConfigured && user.emailVerified === false && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-955 border border-amber-200 dark:border-amber-900/30 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-amber-800 dark:text-amber-300 text-xs animate-fadeIn shadow-sm">
              <div className="flex items-start space-x-3">
                <FaExclamationTriangle className="text-lg shrink-0 mt-0.5 text-amber-500" />
                <div className="text-left">
                  <p className="font-bold">Email Address Not Verified</p>
                  <p className="text-amber-600/85 dark:text-amber-400 mt-0.5 leading-relaxed font-medium">
                    Please verify your email address to unlock all portfolio management and premium payout services.
                  </p>
                </div>
              </div>
              <button
                onClick={handleResendVerification}
                disabled={resendLoading || resendSent}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-navy-950 font-extrabold rounded-xl transition-all cursor-pointer shadow-sm text-[10px] uppercase tracking-wider shrink-0 disabled:opacity-50"
              >
                {resendSent ? 'Link Sent' : resendLoading ? 'Sending...' : 'Resend Link'}
              </button>
            </div>
          )}
          {renderRoleDashboard()}
        </main>
      </div>
    </div>
  );
};
export default Dashboard;
