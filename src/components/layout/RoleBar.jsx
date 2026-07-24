import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaExchangeAlt } from 'react-icons/fa';

export const RoleBar = () => {
  const { user, switchRole, isAuthenticated } = useAuth();

  const roles = [
    { key: 'customer', label: 'Customer', color: 'bg-blue-600' },
    { key: 'agent', label: 'Agent', color: 'bg-emerald-600' },
    { key: 'telecaller', label: 'Telecaller', color: 'bg-amber-600' },
    { key: 'employee', label: 'Employee', color: 'bg-indigo-600' },
    { key: 'manager', label: 'Manager', color: 'bg-purple-600' },
    { key: 'admin', label: 'Admin', color: 'bg-rose-600' }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-slate-900/90 text-white backdrop-blur-md rounded-2xl border border-gold-400/30 p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <FaUserCircle className="text-gold-400 text-xl" />
        <div className="text-left">
          <p className="text-xs text-slate-400 font-medium">Demo Simulator</p>
          <p className="text-xs font-semibold text-white">
            {isAuthenticated ? `${user.name} (${user.role.toUpperCase()})` : 'Guest / Public View'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] text-slate-400 font-semibold uppercase mr-1 hidden sm:inline flex items-center gap-1">
          <FaExchangeAlt /> Switch Dashboard:
        </span>
        {roles.map(role => (
          <button
            key={role.key}
            onClick={() => switchRole(role.key)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all duration-200 cursor-pointer ${
              user?.role === role.key
                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 font-bold scale-105 shadow-md shadow-gold-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );
};
export default RoleBar;
