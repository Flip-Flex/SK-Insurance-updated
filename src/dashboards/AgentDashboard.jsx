import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CLIENTS } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { SearchBar } from '../components/common/SearchBar';
import { EmptyState } from '../components/ui/EmptyState';
import { FaUserPlus, FaCoins, FaUsers, FaArrowUp, FaEnvelope, FaPhone } from 'react-icons/fa';

export const AgentDashboard = ({ tab }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState(CLIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  const handleAddClient = (e) => {
    e.preventDefault();
    const newClient = {
      id: `CLT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newClientName,
      email: newClientEmail,
      phone: '+1 555-901-2234',
      activePolicies: 1,
      lastContact: new Date().toISOString().split('T')[0],
      totalPremium: '₹12,000/yr',
      riskLevel: 'Low'
    };
    setClients([...clients, newClient]);
    setNewClientName('');
    setNewClientEmail('');
    setShowAddClientModal(false);
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 1. OVERVIEW VIEW
  if (!tab || tab === 'overview') {
    return (
      <div className="space-y-6 text-left">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <FaCoins className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Commissions</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">{user.commission}</h3>
              <p className="text-[9px] text-emerald-500 font-bold flex items-center mt-0.5"><FaArrowUp className="mr-0.5" /> +12.4% vs last month</p>
            </div>
          </div>

          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <FaUsers className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Policy Clients</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">{clients.length} Clients</h3>
            </div>
          </div>

          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <FaUserPlus className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pipeline Leads</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">8 Warm Leads</h3>
            </div>
          </div>
        </div>

        {/* Client overview list */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-navy-950 dark:text-white">Active Portfolios Assigned</h3>
            <Button variant="outline" size="sm" onClick={() => setShowAddClientModal(true)}>Add Direct Client</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-200/50 dark:border-white/5 pb-2 text-left font-bold">
                  <th className="py-2.5">Client Name</th>
                  <th>Email ID</th>
                  <th>Active policies</th>
                  <th>Total Annual Premium</th>
                  <th>Last Contacts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {clients.slice(0, 3).map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-900/10">
                    <td className="py-3 font-semibold text-navy-950 dark:text-white">{c.name}</td>
                    <td>{c.email}</td>
                    <td className="font-semibold">{c.activePolicies} Policies</td>
                    <td className="text-gold-500 font-bold">{c.totalPremium}</td>
                    <td>{c.lastContact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 2. CLIENTS DIRECTORY VIEW
  if (tab === 'clients') {
    return (
      <div className="space-y-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-navy-950 dark:text-white">Clients Directory Register</h2>
          <div className="flex items-center space-x-2">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search clients..." />
            <Button variant="gold" size="sm" onClick={() => setShowAddClientModal(true)}>Register Client</Button>
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <EmptyState title="No Clients Found" description="Try refining search keywords." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="glass-panel dark:glass-panel-gold rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-navy-950 dark:text-white">{client.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{client.id} | Risk: {client.riskLevel}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-navy-500/10 text-navy-500">
                    {client.activePolicies} Policies
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-slate-400 text-sm" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaPhone className="text-slate-400 text-sm" />
                    <span>{client.phone}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-100 dark:border-white/5">
                  <span className="text-slate-400">Total Premium: <strong className="text-gold-500">{client.totalPremium}</strong></span>
                  <span className="text-slate-400">Last Contact: <strong>{client.lastContact}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add client modal dialog */}
        <Modal isOpen={showAddClientModal} onClose={() => setShowAddClientModal(false)} title="Register Client" size="md">
          <form onSubmit={handleAddClient} className="space-y-4 pt-2 text-xs">
             <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Legal Name</label>
              <input required type="text" placeholder="Your Name" value={newClientName} onChange={e => setNewClientName(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
              <input required type="email" placeholder="Enter Email" value={newClientEmail} onChange={e => setNewClientEmail(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowAddClientModal(false)}>Cancel</Button>
              <Button type="submit" variant="gold">Register Client</Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // 3. COMMISSIONS ANALYSIS
  if (tab === 'commissions') {
    return (
      <div className="space-y-6 text-left">
        <h2 className="text-xl font-bold text-navy-950 dark:text-white">Commission Reports Ledger</h2>

        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          <h3 className="font-bold text-navy-950 dark:text-white text-sm">Monthly Settlement Ledger</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-200/50 dark:border-white/5 pb-2 text-left font-bold">
                  <th className="py-2.5">Settlement Period</th>
                  <th>Total Sales Volume</th>
                  <th>Commission Rate</th>
                  <th>Payout Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-navy-900/10">
                  <td className="py-3 font-semibold">July 2026</td>
                  <td>₹54,200</td>
                  <td>12.5%</td>
                  <td className="font-bold text-gold-500">₹6,775</td>
                  <td><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">Paid</span></td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-navy-900/10">
                  <td className="py-3 font-semibold">June 2026</td>
                  <td>₹45,400</td>
                  <td>12.5%</td>
                  <td className="font-bold text-gold-500">₹5,675</td>
                  <td><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">Paid</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 4. SUPPORT LOGS
  if (tab === 'support') {
    return (
      <div className="space-y-6 text-left">
        <h2 className="text-xl font-bold text-navy-950 dark:text-white">Support Cases Inbox</h2>
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          <p className="text-xs text-slate-500 leading-normal">
            Verify outstanding tickets log raised by your portfolio clients. Engage operations for dispatch details.
          </p>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-navy-900/40 border border-slate-200/50 dark:border-white/5 rounded-xl flex justify-between items-center gap-4">
              <div>
                <p className="font-bold text-navy-950 dark:text-white">Bill Gates: Auto debit billing query</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Ticket ID: TCK-8809 | Opened 3 days ago</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold">Under Review</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <EmptyState title="No Dashboard Section" description="The requested section could not be found." />;
};
export default AgentDashboard;
