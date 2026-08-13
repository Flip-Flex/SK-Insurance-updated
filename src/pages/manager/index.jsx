import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/contexts/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sidebar } from '../../layouts/Sidebar';
import { ManagerDashboard } from '../../features/manager/components/ManagerDashboard';
import { getNotifications } from '../../services/api';
import { FaBell, FaChevronDown, FaUserCircle, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { isFirebaseConfigured } from '../../firebase/config';

export const Dashboard = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { tab } = useParams();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);


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
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    getNotifications().then(data => {
      if(data && data.length > 0) setNotifications(data);
    });
  }, []);
  const [showNtfDropdown, setShowNtfDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Redirect to Auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
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





  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-neutral-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Dynamic Collapsible Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200/40 dark:border-white/5 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
              Manager Portal
          </div>

          <div className="flex items-center space-x-4">
             {/* Removed per user request */}
          </div>
        </header>

        {/* Dashboard Main Workspace View */}
        <main className="flex-1 overflow-y-auto p-6 pb-28">

          <ManagerDashboard tab={tab} />
        </main>
      </div>
    </div>
  );
};
export default Dashboard;
