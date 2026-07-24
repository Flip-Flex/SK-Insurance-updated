import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../ui/Logo';
import * as FaIcons from 'react-icons/fa';


export const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  // Define sidebar menu options for each role (aligned with Image 1: Home, Assets, Investments, Reviews, Settings)
  const menuItemsByRole = {
    customer: [
      { name: 'Home', icon: FaIcons.FaHome, path: '/dashboard' },
      { name: 'Assets', icon: FaIcons.FaShieldAlt, path: '/dashboard/policies' },
      { name: 'Investments', icon: FaIcons.FaFileMedical, path: '/dashboard/claims' },
      { name: 'Reviews', icon: FaIcons.FaFolderOpen, path: '/dashboard/documents' },
      { name: 'Settings', icon: FaIcons.FaCog, path: '/dashboard/settings' }
    ],
    agent: [
      { name: 'Home', icon: FaIcons.FaHome, path: '/dashboard' },
      { name: 'Assets', icon: FaIcons.FaUsers, path: '/dashboard/clients' },
      { name: 'Investments', icon: FaIcons.FaCoins, path: '/dashboard/commissions' },
      { name: 'Reviews', icon: FaIcons.FaHeadset, path: '/dashboard/support' },
      { name: 'Settings', icon: FaIcons.FaCog, path: '/dashboard/settings' }
    ],
    telecaller: [
      { name: 'Home', icon: FaIcons.FaHome, path: '/dashboard' },
      { name: 'Assets', icon: FaIcons.FaThList, path: '/dashboard/queue' },
      { name: 'Investments', icon: FaIcons.FaPhoneAlt, path: '/dashboard/support' },
      { name: 'Reviews', icon: FaIcons.FaComments, path: '/dashboard/support' },
      { name: 'Settings', icon: FaIcons.FaCog, path: '/dashboard/settings' }
    ],
    employee: [
      { name: 'Home', icon: FaIcons.FaHome, path: '/dashboard' },
      { name: 'Assets', icon: FaIcons.FaTasks, path: '/dashboard/claims' },
      { name: 'Investments', icon: FaIcons.FaFileMedical, path: '/dashboard/support' },
      { name: 'Reviews', icon: FaIcons.FaFolderOpen, path: '/dashboard/documents' },
      { name: 'Settings', icon: FaIcons.FaCog, path: '/dashboard/settings' }
    ],
    manager: [
      { name: 'Home', icon: FaIcons.FaHome, path: '/dashboard' },
      { name: 'Assets', icon: FaIcons.FaChartBar, path: '/dashboard/staff' },
      { name: 'Investments', icon: FaIcons.FaCheckDouble, path: '/dashboard/approvals' },
      { name: 'Reviews', icon: FaIcons.FaFileInvoiceDollar, path: '/dashboard/reports' },
      { name: 'Settings', icon: FaIcons.FaCog, path: '/dashboard/settings' }
    ],
    admin: [
      { name: 'Home', icon: FaIcons.FaHome, path: '/dashboard' },
      { name: 'Analytics', icon: FaIcons.FaTachometerAlt, path: '/dashboard/overview' },
      { name: 'Plans Manager', icon: FaIcons.FaFolderOpen, path: '/dashboard/plans-manager' },
      { name: 'Users & Roles', icon: FaIcons.FaUsers, path: '/dashboard/users' },
      { name: 'Careers & Jobs', icon: FaIcons.FaBriefcase, path: '/dashboard/careers' },
      { name: 'Audit Logs', icon: FaIcons.FaShieldAlt, path: '/dashboard/logs' },
      { name: 'Claims Queue', icon: FaIcons.FaCheckDouble, path: '/dashboard/claims' },
      { name: 'Gallery & Settings', icon: FaIcons.FaSlidersH, path: '/dashboard/settings' }
    ]
  };

  const items = menuItemsByRole[user.role] || menuItemsByRole.customer;

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <aside
      className={`h-screen sticky top-0 shrink-0 bg-navy-950 text-slate-300 transition-all duration-300 shadow-xl border-r border-white/5 flex flex-col justify-between z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center space-x-2 overflow-hidden">
            {collapsed ? (
              <div className="h-8 w-12 flex items-center justify-center shrink-0 overflow-hidden">
                <Logo showTagline={false} variant="horizontal" className="scale-[0.8]" />
              </div>
            ) : (
              <Logo showTagline={false} />
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-xs hover:text-white hover:bg-navy-900 rounded-md transition-colors cursor-pointer"
          >
            {collapsed ? <FaIcons.FaChevronRight /> : <FaIcons.FaChevronLeft />}
          </button>
        </div>

        {/* User Quick Info */}
        <div className="p-4 border-b border-white/5 bg-navy-900/35 overflow-hidden">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-gold-500 to-gold-400 text-navy-950 flex items-center justify-center font-bold text-base shrink-0 shadow-md">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">{user.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {items.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-gold-500/20 to-gold-500/5 text-white border-l-2 border-gold-400'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`text-base shrink-0 ${active ? 'text-gold-400' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-gold-400 hover:bg-gold-500/10 cursor-pointer transition-colors"
        >
          <FaIcons.FaGlobe className="text-base shrink-0 text-gold-400" />
          {!collapsed && <span>Return to Main Site</span>}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer transition-colors"
        >
          <FaIcons.FaSignOutAlt className="text-base shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
