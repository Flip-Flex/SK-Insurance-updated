import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CLAIMS } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { FaShieldAlt, FaArrowUp, FaUsers, FaCoins, FaCheckCircle, FaFileDownload } from 'react-icons/fa';
import { subscribeToCollection, updateDocWithAudit } from '../services/firebaseService';

export const ManagerDashboard = ({ tab }) => {
  const { user } = useAuth();
  
  // High value claims escalated to manager (amount > $2000)
  const [approvalsQueue, setApprovalsQueue] = useState([]);
  
  const [successMsg, setSuccessMsg] = useState(null);

  const [customerDues, setCustomerDues] = useState([
    { id: 'CUST-101', name: 'John Doe', email: 'customer@mail.com', policy: 'AP-HLTH-88390', plan: 'SK Platinum Care', premium: '₹120/mo', dueDate: '2026-08-15', status: 'Active' },
    { id: 'CUST-102', name: 'Karthik Raja', email: 'karthik@mail.com', policy: 'AP-MTR-10293', plan: 'SK Auto Max Cover', premium: '₹420/yr', dueDate: '2026-07-20', status: 'Renewal Due' },
    { id: 'CUST-103', name: 'Vijay Kumar', email: 'vijay@mail.com', policy: 'AP-LIFE-47291', plan: 'SK Term Elite', premium: '₹45/mo', dueDate: '2026-06-10', status: 'Overdue' },
    { id: 'CUST-104', name: 'Arun Mozhi', email: 'arun@mail.com', policy: 'AP-HLTH-55928', plan: 'SK Health Shield', premium: '₹65/mo', dueDate: '2026-05-01', status: 'Overdue' }
  ]);

  const [reminderSent, setReminderSent] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToCollection('claims', (data) => {
      // Escalated/Pending claims for manager review
      const queue = data.filter(c => c.status === 'Pending' || c.status === 'In Progress' || c.status === 'Escalated');
      setApprovalsQueue(queue);
    });
    return () => unsubscribe();
  }, []);

  const handleSendReminder = (name, email) => {
    setReminderSent(`Premium warning reminder successfully dispatched to ${name} (${email}).`);
    setTimeout(() => setReminderSent(null), 3000);
  };

  const handleApprove = async (claimId) => {
    try {
      await updateDocWithAudit('claims', claimId, { status: 'Approved' }, user);
      setSuccessMsg(`Claim ${claimId} successfully authorized and dispatched to bank treasury.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // 1. OVERVIEW VIEW (KPI OPERATIONS)
  if (!tab || tab === 'overview') {
    return (
      <div className="space-y-6 text-left">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <FaCoins className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gross Department Sales</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">₹1,89,42,000</h3>
              <p className="text-[9px] text-emerald-500 font-bold flex items-center mt-0.5"><FaArrowUp className="mr-0.5" /> +8.2% monthly target</p>
            </div>
          </div>

          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-gold-500/10 text-gold-500 rounded-xl">
              <FaShieldAlt className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Claims Settled (Department)</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">340 Claims</h3>
            </div>
          </div>

          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
              <FaUsers className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Agency Force</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">58 Field Agents</h3>
            </div>
          </div>
        </div>

        {/* SVG Line Chart: Targets vs Achievements */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-navy-950 dark:text-white">Monthly Premium Inflow Targets</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Actuarial target achievements compared against actual gross inflow (Lakhs).</p>
          </div>

          <div className="h-44 w-full relative">
            <svg className="w-full h-full text-slate-300 dark:text-navy-800" viewBox="0 0 500 150">
              <defs>
                <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="3" className="opacity-20" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="currentColor" strokeWidth="1" strokeDasharray="3" className="opacity-20" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="3" className="opacity-20" />
              
              {/* Target Line (Dotted Gray) */}
              <path d="M 40 100 L 150 90 L 260 70 L 370 50 L 480 30" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" className="opacity-60" />
              
              {/* Actual Line Area Underneath */}
              <path d="M 40 110 L 150 95 L 260 60 L 370 40 L 480 20 L 480 120 L 40 120 Z" fill="url(#goldArea)" />
              
              {/* Actual Line (Solid Gold) */}
              <path d="M 40 110 L 150 95 L 260 60 L 370 40 L 480 20" fill="none" stroke="#eab308" strokeWidth="3" />
              
              {/* Dots and Labels */}
              <circle cx="40" cy="110" r="4" className="fill-gold-500" />
              <circle cx="150" cy="95" r="4" className="fill-gold-500" />
              <circle cx="260" cy="60" r="4" className="fill-gold-500" />
              <circle cx="370" cy="40" r="4" className="fill-gold-500" />
              <circle cx="480" cy="20" r="4" className="fill-gold-500" />

              {/* Tooltip Hover labels */}
              <text x="40" y="135" fontSize="8" className="fill-slate-400 font-bold text-center" textAnchor="middle">Mar</text>
              <text x="150" y="135" fontSize="8" className="fill-slate-400 font-bold text-center" textAnchor="middle">Apr</text>
              <text x="260" y="135" fontSize="8" className="fill-slate-400 font-bold text-center" textAnchor="middle">May</text>
              <text x="370" y="135" fontSize="8" className="fill-slate-400 font-bold text-center" textAnchor="middle">Jun</text>
              <text x="480" y="135" fontSize="8" className="fill-slate-400 font-bold text-center" textAnchor="middle">Jul</text>

              {/* Y labels */}
              <text x="15" y="23" fontSize="8" className="fill-slate-400 font-bold">₹40L</text>
              <text x="15" y="63" fontSize="8" className="fill-slate-400 font-bold">₹25L</text>
              <text x="15" y="103" fontSize="8" className="fill-slate-400 font-bold">₹10L</text>
            </svg>
          </div>

          <div className="flex items-center justify-center space-x-6 text-[10px] font-bold">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-slate-400 border-t-2 border-dashed border-slate-400 inline-block" />
              <span className="text-slate-400">Target Premium Goal</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-gold-500 inline-block" />
              <span className="text-gold-500">Actual Gross Inflow (₹)</span>
            </div>
          </div>
        </div>

        {/* Manager Tasks / Approvals summary */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-navy-950 dark:text-white">Escalated High-Value Claims Approvals</h3>
            <span className="text-xs text-slate-400">Total escalated: {approvalsQueue.length}</span>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
              <FaCheckCircle />
              <span>{successMsg}</span>
            </div>
          )}

          {approvalsQueue.length === 0 ? (
            <EmptyState title="Approvals Queue Clean" description="No claims escalated at this time." icon={FaCheckCircle} />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
              {approvalsQueue.map(c => (
                <div key={c.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-navy-950 dark:text-white">{c.id} - {c.planName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Claim sum: <strong className="text-gold-500">{c.amount}</strong> | Policy Number: {c.policyNumber}</p>
                  </div>
                  <Button variant="gold" size="sm" onClick={() => handleApprove(c.id)}>Authorize Payout</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. HIGH-VALUE APPROVALS TAB
  if (tab === 'approvals') {
    return (
      <div className="space-y-6 text-left">
        <h2 className="text-xl font-bold text-navy-950 dark:text-white font-sans">High-Value Audit Desk</h2>
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs">
              {successMsg}
            </div>
          )}
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {approvalsQueue.map(c => (
              <div key={c.id} className="py-4 flex justify-between items-center gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-navy-950 dark:text-white">Escalated: {c.id} | Sum: <strong className="text-gold-500">{c.amount}</strong></h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Underwriting policy details: {c.policyNumber} | Plan: {c.planName}</p>
                </div>
                <Button variant="gold" size="sm" onClick={() => handleApprove(c.id)}>Approve Payment</Button>
              </div>
            ))}
            {approvalsQueue.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No escalated approval requests pending.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. STAFF PERFORMANCE TAB
  if (tab === 'staff') {
    return (
      <div className="space-y-6 text-left">
        <h2 className="text-xl font-bold text-navy-950 dark:text-white">Agency Force Metrics</h2>
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          <div className="overflow-x-auto text-xs">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 border-b border-slate-200/50 dark:border-white/5 pb-2 text-left font-bold">
                  <th className="py-2.5">Agent Identifier</th>
                  <th>Department / Focus</th>
                  <th>Client Portfolios</th>
                  <th>Conversion rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-navy-900/10">
                  <td className="py-3 font-semibold">Sarah Jenkins</td>
                  <td>Life & Health Coverage</td>
                  <td>42 Active</td>
                  <td className="font-bold text-emerald-500">14.8%</td>
                  <td><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">Top Performer</span></td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-navy-900/10">
                  <td className="py-3 font-semibold">Mark Antony</td>
                  <td>Motor Vehicle Cover</td>
                  <td>28 Active</td>
                  <td className="font-bold text-slate-500">10.2%</td>
                  <td><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-900 text-slate-400 text-[10px] font-bold">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 4. BUSINESS REPORTS TAB
  if (tab === 'reports') {
    return (
      <div className="space-y-6 text-left">
        <h2 className="text-xl font-bold text-navy-950 dark:text-white">Underwriting Performance Audits</h2>
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          <p className="text-xs text-slate-500 leading-normal">
            Download quarterly business performance sheets. These include loss ratios, renewal rates, and Telecaller metrics.
          </p>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-navy-900/40 border border-slate-200/50 dark:border-white/5 rounded-xl flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-navy-950 dark:text-white">Q2_2026_LossRatioReport.xlsx</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Generated July 1, 2026 | Size: 4.2 MB</p>
              </div>
              <Button variant="secondary" size="sm" icon={FaFileDownload}>Download</Button>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-navy-900/40 border border-slate-200/50 dark:border-white/5 rounded-xl flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-navy-950 dark:text-white">Agency_Commissions_PayoutList.pdf</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Generated July 12, 2026 | Size: 1.1 MB</p>
              </div>
              <Button variant="secondary" size="sm" icon={FaFileDownload}>Download</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. CUSTOMERS & PREMIUM DUES TAB (SETTINGS)
  if (tab === 'settings') {
    return (
      <div className="space-y-6 text-left">
        <div>
          <h2 className="text-xl font-bold text-navy-950 dark:text-white font-sans">Customers & Dues Ledger</h2>
          <p className="text-xs text-slate-400 mt-1">Audit customer premium due statuses, verify policy balances, and dispatch warnings.</p>
        </div>

        {reminderSent && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs">
            {reminderSent}
          </div>
        )}

        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          <div className="overflow-x-auto text-xs">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 border-b border-slate-200/50 dark:border-white/5 pb-2 text-left font-bold">
                  <th className="py-2.5">Customer Name</th>
                  <th>Policy Number</th>
                  <th>Plan Details</th>
                  <th>Premium Due</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {customerDues.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-900/10">
                    <td className="py-3 font-semibold text-navy-950 dark:text-white">
                      <div>{cust.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{cust.email}</div>
                    </td>
                    <td>{cust.policy}</td>
                    <td>{cust.plan}</td>
                    <td className="font-semibold">{cust.premium}</td>
                    <td className="text-slate-400">{cust.dueDate}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cust.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : cust.status === 'Renewal Due'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {cust.status}
                      </span>
                    </td>
                    <td>
                      {cust.status !== 'Active' ? (
                        <button
                          onClick={() => handleSendReminder(cust.name, cust.email)}
                          className="px-2.5 py-1 bg-gold-500/10 text-gold-500 hover:bg-gold-500 hover:text-white rounded-lg transition-all font-bold cursor-pointer text-[10px]"
                        >
                          Send Warning
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[10px]">Paid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return <EmptyState title="No Dashboard Section" description="The requested section could not be found." />;
};
export default ManagerDashboard;
