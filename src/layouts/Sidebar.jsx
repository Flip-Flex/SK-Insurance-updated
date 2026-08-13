import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/contexts/AuthContext';
import { Logo } from '../components/ui/Logo';
import * as FaIcons from 'react-icons/fa';


export const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const items = [
    { name: 'Plans Manager', icon: FaIcons.FaFolderOpen, path: '/dashboard' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <aside
      className={`h-screen sticky top-0 shrink-0 bg-neutral-950 text-slate-300 transition-all duration-300 shadow-xl border-r border-white/5 flex flex-col justify-between z-30 ${
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
            className="p-1 text-xs hover:text-white hover:bg-neutral-900 rounded-md transition-colors cursor-pointer"
          >
            {collapsed ? <FaIcons.FaChevronRight /> : <FaIcons.FaChevronLeft />}
          </button>
        </div>



        {/* Menu Items */}
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {items.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <li key={item.name} className="list-none">
                <button
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-neutral-900 text-gold-400 font-bold shadow-sm border border-white/5'
                      : 'hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <Icon className={`text-base shrink-0 ${active ? 'text-gold-400' : 'text-slate-400'}`} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </button>
              </li>
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
          className={`flex items-center text-sm font-bold text-red-400 hover:text-red-300 hover:bg-neutral-900 p-3 rounded-xl transition-colors cursor-pointer ${collapsed ? 'justify-center w-12 mx-auto' : 'w-full px-4'}`}
        >
          <FaIcons.FaSignOutAlt className="text-base shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
