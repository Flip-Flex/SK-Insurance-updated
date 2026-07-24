import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CLAIMS, SUPPORT_TICKETS } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { FaTasks, FaFolderOpen, FaCheckCircle, FaTimesCircle, FaEnvelopeOpenText } from 'react-icons/fa';

export const EmployeeDashboard = ({ tab }) => {
  const { user } = useAuth();
  const [claimsQueue, setClaimsQueue] = useState(CLAIMS.filter(c => c.status === 'In Progress'));
  const [ticketList, setTicketList] = useState(SUPPORT_TICKETS);
  const [selectedClaim, setSelectedClaim] = useState(null);

  const handleClaimVerdict = (claimId, isApprove) => {
    // Remove from active queue or change status
    setClaimsQueue(prev => prev.filter(c => c.id !== claimId));
    setSelectedClaim(null);
  };

  const handleResolveTicket = (ticketId) => {
    setTicketList(prev =>
      prev.map(t => t.id === ticketId ? { ...t, status: 'Resolved' } : t)
    );
  };

  // 1. OVERVIEW VIEW
  if (!tab || tab === 'overview') {
    return (
      <div className="space-y-6 text-left">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <FaTasks className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Claims Action Queue</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">{claimsQueue.length} Cases</h3>
            </div>
          </div>

          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <FaEnvelopeOpenText className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Helpdesk Tickets</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">
                {ticketList.filter(t => t.status === 'Open').length} Tickets
              </h3>
            </div>
          </div>
        </div>

        {/* Task lists summaries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Claims Queue list */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 space-y-4">
            <h3 className="text-base font-bold text-navy-950 dark:text-white">Claims Validation Tasks</h3>
            {claimsQueue.length === 0 ? (
              <EmptyState title="All Claims Checked" description="The claims queue is clean." icon={FaCheckCircle} />
            ) : (
              <div className="space-y-3">
                {claimsQueue.map(c => (
                  <div key={c.id} className="p-3 bg-slate-50 dark:bg-navy-900/40 border border-slate-200/50 dark:border-white/5 rounded-xl flex justify-between items-center gap-4 text-xs">
                    <div>
                      <p className="font-bold text-navy-950 dark:text-white">{c.id} - {c.planName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Amount requested: <strong className="text-gold-500">{c.amount}</strong> | Date: {c.dateFiled}</p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setSelectedClaim(c)}>Evaluate</Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tickets review */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 space-y-4">
            <h3 className="text-base font-bold text-navy-950 dark:text-white">Customer Helpdesk Portal</h3>
            <div className="space-y-3">
              {ticketList.slice(0, 3).map(t => (
                <div key={t.id} className="p-3 bg-slate-50 dark:bg-navy-900/40 border border-slate-200/50 dark:border-white/5 rounded-xl flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-navy-950 dark:text-white">{t.subject}</p>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        t.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-slate-400/10 text-slate-400'
                      }`}>{t.priority}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Logged: {t.dateCreated} | Created by: {t.creator}</p>
                  </div>
                  {t.status === 'Resolved' ? (
                    <span className="text-[10px] text-emerald-500 font-bold uppercase mr-1">Resolved</span>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => handleResolveTicket(t.id)}>Resolve</Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Claim Evaluate Details overlay */}
        {selectedClaim && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 dark:bg-navy-950/70 backdrop-blur-sm">
            <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-4 relative border border-white/10">
              <h3 className="text-lg font-bold text-navy-950 dark:text-white">Evaluate Claims Cover: {selectedClaim.id}</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                  <span className="text-slate-400">Policy Reference:</span>
                  <span className="font-semibold">{selectedClaim.policyNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                  <span className="text-slate-400">Sum Amount:</span>
                  <span className="font-bold text-gold-500">{selectedClaim.amount}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                  <span className="text-slate-400">Plan Type:</span>
                  <span>{selectedClaim.planName} ({selectedClaim.type})</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-slate-400">Incident Claims Proof Details:</span>
                  <p className="p-3 bg-slate-50 dark:bg-navy-900 rounded-xl leading-relaxed text-slate-600 dark:text-slate-300">
                    {selectedClaim.description}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="secondary" onClick={() => setSelectedClaim(null)}>Close</Button>
                <Button variant="danger" icon={FaTimesCircle} onClick={() => handleClaimVerdict(selectedClaim.id, false)}>Reject</Button>
                <Button variant="gold" icon={FaCheckCircle} onClick={() => handleClaimVerdict(selectedClaim.id, true)}>Approve & Settle</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. CLAIMS REVIEW QUEUE TAB
  if (tab === 'claims') {
    return (
      <div className="space-y-6 text-left">
        <h2 className="text-xl font-bold text-navy-950 dark:text-white">Validation Queue: Claims</h2>
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          <p className="text-xs text-slate-500 leading-normal">
            Inspect incident details, medical files, or police motor accident records below. Authorize settlement payout drafts.
          </p>
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {claimsQueue.map(c => (
              <div key={c.id} className="py-4 flex justify-between items-center gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-navy-950 dark:text-white">{c.id} | Policy: {c.policyNumber}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Sum: <strong className="text-gold-500">{c.amount}</strong> | Desc: {c.description}</p>
                </div>
                <Button variant="gold" size="sm" onClick={() => setSelectedClaim(c)}>Validate Case</Button>
              </div>
            ))}
            {claimsQueue.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No claims awaiting validation.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. HELPDESK TICKETS TAB
  if (tab === 'support') {
    return (
      <div className="space-y-6 text-left">
        <h2 className="text-xl font-bold text-navy-950 dark:text-white">Helpdesk Queue Dashboard</h2>
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {ticketList.map(t => (
              <div key={t.id} className="py-4 flex justify-between items-center gap-4 text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-navy-950 dark:text-white">{t.subject}</h4>
                    <span className="px-2 py-0.5 rounded text-[8px] font-extrabold bg-slate-100 dark:bg-navy-900">{t.id}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Category: {t.category} | Created by {t.creator}</p>
                </div>
                {t.status === 'Resolved' ? (
                  <span className="text-emerald-500 font-bold">Resolved</span>
                ) : (
                  <Button variant="gold" size="sm" onClick={() => handleResolveTicket(t.id)}>Mark Resolved</Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. DOCUMENT VAULT
  if (tab === 'documents') {
    return (
      <div className="space-y-6 text-left">
        <h2 className="text-xl font-bold text-navy-950 dark:text-white">Document Validation Audit</h2>
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          <p className="text-xs text-slate-500 leading-normal">
            Vault containing medical bills, proof files, ID copies, and vehicle checks submitted by customers.
          </p>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-navy-900/40 border border-slate-200/50 dark:border-white/5 rounded-xl flex justify-between items-center gap-4">
              <div>
                <p className="font-bold text-navy-950 dark:text-white">Discharge_Summary_StMary.pdf</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Assigned to: Claim CLM-9028 | Size: 1.4 MB</p>
              </div>
              <span className="text-[10px] text-emerald-500 font-bold uppercase mr-1">Verified</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-navy-900/40 border border-slate-200/50 dark:border-white/5 rounded-xl flex justify-between items-center gap-4">
              <div>
                <p className="font-bold text-navy-950 dark:text-white">Bumper_Dent_Photo.jpg</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Assigned to: Claim CLM-4431 | Size: 2.1 MB</p>
              </div>
              <span className="text-[10px] text-amber-500 font-bold uppercase mr-1">Under Review</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <EmptyState title="No Dashboard Section" description="The requested section could not be found." />;
};
export default EmployeeDashboard;
