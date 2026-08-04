import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sidebar } from '../../components/layout/Sidebar';
import { ManagerDashboard } from '../../dashboards/ManagerDashboard';
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
    if (user.role === 'manager') {
      return <ManagerDashboard tab={tab} />;
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-center mt-32">
        <h3 className="text-2xl font-bold text-navy-950 dark:text-white mb-2 uppercase tracking-wide">Welcome to SK Insurance</h3>
        <p className="text-sm text-slate-500 font-medium">Your personalized workspace is currently being provisioned.</p>
      </div>
    );
  };

  const getDashboardTitle = () => {
    const roleLabels = {
      customer: 'Policyholder Workspace',
      agent: 'Underwriting Representative Dashboard',
      telecaller: 'Outbound Leads Dashboard',
      employee: 'Claims Verification Queue',
      manager: 'Manager Portal',
      admin: ''
    };
    return roleLabels[user.role] || 'Insurance Dashboard';
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-neutral-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Dynamic Collapsible Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200/40 dark:border-white/5 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-sm font-bold text-neutral-950 dark:text-white uppercase tracking-wider font-sans">
              {getDashboardTitle()}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
             {/* Removed per user request */}
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
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold rounded-xl transition-all cursor-pointer shadow-sm text-[10px] uppercase tracking-wider shrink-0 disabled:opacity-50"
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
