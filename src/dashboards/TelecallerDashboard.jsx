import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LEADS } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { Filters } from '../components/common/Filters';
import { EmptyState } from '../components/ui/EmptyState';
import { FaPhoneAlt, FaChevronRight, FaRegCommentDots, FaRegCheckCircle } from 'react-icons/fa';

export const TelecallerDashboard = ({ tab }) => {
  const { user } = useAuth();
  const [leads, setLeads] = useState(LEADS);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);
  const [callNotes, setCallNotes] = useState('');
  const [logSuccess, setLogSuccess] = useState(false);

  const filterOptions = [
    { label: 'All Leads', value: 'ALL' },
    { label: 'New', value: 'New' },
    { label: 'Contacted', value: 'Contacted' },
    { label: 'Follow Up', value: 'Follow Up' },
    { label: 'Interested', value: 'Interested' }
  ];

  const handleUpdateStatus = (leadId, nextStatus) => {
    setLeads(prev =>
      prev.map(l => l.id === leadId ? { ...l, status: nextStatus } : l)
    );
  };

  const handleLogCall = (e) => {
    e.preventDefault();
    if (!selectedLead) return;
    setLeads(prev =>
      prev.map(l =>
        l.id === selectedLead.id
          ? { ...l, notes: callNotes, status: 'Contacted' }
          : l
      )
    );
    setLogSuccess(true);
    setTimeout(() => {
      setLogSuccess(false);
      setSelectedLead(null);
      setCallNotes('');
    }, 2000);
  };

  const filteredLeads = activeFilter === 'ALL'
    ? leads
    : leads.filter(l => l.status === activeFilter);

  // 1. OVERVIEW VIEW (LEADS CONSOLE)
  if (!tab || tab === 'overview') {
    return (
      <div className="space-y-6 text-left">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <FaPhoneAlt className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outbound Calls Logged</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">{user.callsMade} Calls</h3>
            </div>
          </div>

          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <FaRegCheckCircle className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Lead Conversions</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">18 Converted</h3>
            </div>
          </div>

          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <FaRegCommentDots className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Outbound Queue</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">{leads.filter(l => l.status === 'New').length} Leads</h3>
            </div>
          </div>
        </div>

        {/* Lead Register & Calling Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Leads List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-base font-bold text-navy-950 dark:text-white">Leads Pipeline Catalog</h3>
              <Filters options={filterOptions} activeFilter={activeFilter} onChange={setActiveFilter} />
            </div>

            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-navy-950 dark:text-white text-sm">{lead.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        lead.status === 'New' ? 'bg-blue-500/10 text-blue-500' :
                        lead.status === 'Contacted' ? 'bg-amber-500/10 text-amber-500' :
                        lead.status === 'Follow Up' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>{lead.status}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Phone: {lead.phone} | Interest: <strong className="text-navy-900 dark:text-gold-400">{lead.planInterest}</strong></p>
                    <p className="text-[11px] text-slate-400 italic">Notes: "{lead.notes}"</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => setSelectedLead(lead)} icon={FaPhoneAlt}>Call</Button>
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-gold-400 text-navy-950 dark:text-white"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Follow Up">Follow Up</option>
                      <option value="Interested">Interested</option>
                      <option value="Not Interested">Not Interested</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call Logger Panel */}
          <div>
            <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 border border-gold-400/20 sticky top-24 space-y-4">
              <h3 className="text-sm font-bold text-navy-950 dark:text-white">Call Result Logger</h3>
              {selectedLead ? (
                <form onSubmit={handleLogCall} className="space-y-3 text-xs text-left">
                  {logSuccess && (
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                      Call notes logged successfully. Lead updated.
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Active Contact Target</label>
                    <p className="font-bold text-navy-950 dark:text-white">{selectedLead.name} ({selectedLead.phone})</p>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Conversation Notes</label>
                    <textarea
                      required
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      placeholder="Add key takeaways, callback time, or product questions..."
                      rows="3"
                      className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white focus:outline-none focus:border-gold-400"
                    ></textarea>
                  </div>
                  <div className="flex space-x-2 pt-1">
                    <Button variant="secondary" className="flex-1" onClick={() => setSelectedLead(null)}>Cancel</Button>
                    <Button type="submit" variant="gold" className="flex-1">Log Call</Button>
                  </div>
                </form>
              ) : (
                <p className="text-xs text-slate-500 leading-relaxed text-center py-8">
                  Select a lead from the pipeline registry list and trigger "Call" to activate call logging dashboard tools.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. QUEUE TAB
  if (tab === 'queue') {
    return (
      <div className="space-y-6 text-left">
        <h2 className="text-xl font-bold text-navy-950 dark:text-white">Outbound Dial Queue</h2>
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          <p className="text-xs text-slate-500 leading-normal">
            Below is the list of fresh leads requiring outbound contact calls. Double-click the contact details or click "Call" to open dial tools.
          </p>
          <div className="space-y-3">
            {leads.filter(l => l.status === 'New').map(lead => (
              <div key={lead.id} className="p-3 bg-slate-50 dark:bg-navy-900/40 border border-slate-200/50 dark:border-white/5 rounded-xl flex items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-bold text-navy-950 dark:text-white">{lead.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Phone: {lead.phone} | Target Interest: {lead.planInterest}</p>
                </div>
                <Button variant="gold" size="sm" onClick={() => setSelectedLead(lead)}>Call Lead</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <EmptyState title="No Dashboard Section" description="The requested section could not be found." />;
};
export default TelecallerDashboard;
