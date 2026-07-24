import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MY_POLICIES, CLAIMS, PLANS } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { SearchBar } from '../components/common/SearchBar';
import { Filters } from '../components/common/Filters';
import { EmptyState } from '../components/ui/EmptyState';
import {
  FaShieldAlt, FaPlusCircle, FaFolderOpen, FaClock,
  FaCheckCircle, FaTrash, FaCloudUploadAlt, FaHistory, FaHeartbeat, FaCar, FaHome, FaPlane, FaChevronRight, FaFileInvoice
} from 'react-icons/fa';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, onSnapshot, doc } from 'firebase/firestore';
import { 
  subscribeToCollection, 
  addDocWithAudit, 
  updateDocWithAudit, 
  deleteDocWithAudit, 
  uploadMediaFile 
} from '../services/firebaseService';
import { saveAuditLog } from '../services/api';

export const CustomerDashboard = ({ tab }) => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [docs, setDocs] = useState([
    { name: 'SK_Smart_Platinum_Policy.pdf', date: '2026-01-15', size: '1.2 MB' },
    { name: 'Payment_Receipt_July2026.pdf', date: '2026-07-10', size: '345 KB' }
  ]);
  const [searchVal, setSearchVal] = useState('');
  const [activePlanFilter, setActivePlanFilter] = useState('ALL');

  // Claim Form state
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimPolicy, setClaimPolicy] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [claimDesc, setClaimDesc] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  const [claimStep, setClaimStep] = useState(1);
  const [claimLossDate, setClaimLossDate] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [claimFile, setClaimFile] = useState(null);
  const [claimFileObj, setClaimFileObj] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Policy Renewal state
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewPolicy, setRenewPolicy] = useState(null);
  const [renewSuccess, setRenewSuccess] = useState(false);

  // Document upload mock
  const [uploadedFile, setUploadedFile] = useState(null);

  // Listeners & Seeding
  useEffect(() => {
    if (!user) return;
    const uid = user.uid || user.id;

    // Seed default items if empty
    const checkAndSeed = async () => {
      try {
        const policiesQuery = query(collection(db, 'policies'), where('userId', '==', uid));
        const policiesSnap = await getDocs(policiesQuery);
        if (policiesSnap.empty) {
          for (const p of MY_POLICIES) {
            await addDocWithAudit('policies', { ...p, id: p.policyNumber, userId: uid }, user);
          }
        }

        const claimsQuery = query(collection(db, 'claims'), where('userId', '==', uid));
        const claimsSnap = await getDocs(claimsQuery);
        if (claimsSnap.empty) {
          for (const c of CLAIMS) {
            await addDocWithAudit('claims', { ...c, id: c.id, userId: uid }, user);
          }
        }
      } catch (err) {
        console.error("Failed checking or seeding customer dashboard databases", err);
      }
    };
    checkAndSeed();

    // Query Snapshots
    const unsubscribePolicies = onSnapshot(
      query(collection(db, 'policies'), where('userId', '==', uid)),
      (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const uniqueList = [];
        const seen = new Set();
        for (const item of list) {
          if (item.policyNumber && !seen.has(item.policyNumber)) {
            seen.add(item.policyNumber);
            uniqueList.push(item);
          }
        }
        setPolicies(uniqueList);
        if (uniqueList.length > 0 && !claimPolicy) {
          setClaimPolicy(uniqueList[0].policyNumber);
        }
      }
    );

    const unsubscribeClaims = onSnapshot(
      query(collection(db, 'claims'), where('userId', '==', uid)),
      (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const uniqueList = [];
        const seen = new Set();
        for (const item of list) {
          const claimId = item.id || item.policyNumber;
          if (claimId && !seen.has(claimId)) {
            seen.add(claimId);
            uniqueList.push(item);
          }
        }
        setClaims(uniqueList);
      }
    );

    const unsubscribeDocs = onSnapshot(
      query(collection(db, 'documents'), where('userId', '==', uid)),
      (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const uniqueList = [];
        const seen = new Set();
        for (const item of list) {
          if (item.name && !seen.has(item.name)) {
            seen.add(item.name);
            uniqueList.push(item);
          }
        }
        if (uniqueList.length > 0) setDocs(uniqueList);
      }
    );

    return () => {
      unsubscribePolicies();
      unsubscribeClaims();
      unsubscribeDocs();
    };
  }, [user]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setClaimFileObj(file);
      setClaimFile({ name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` });
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setClaimFileObj(file);
      setClaimFile({ name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` });
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    const uid = user.uid || user.id;
    const targetPolicy = policies.find(p => p.policyNumber === claimPolicy);

    try {
      let finalFileUrl = '';
      if (claimFileObj) {
        setSuccessMsg('Uploading claim documents...');
        finalFileUrl = await uploadMediaFile(claimFileObj, 'claims');
      }

      const newClaim = {
        policyNumber: claimPolicy,
        planName: targetPolicy ? targetPolicy.planName : 'Custom Claim Policy',
        type: targetPolicy ? targetPolicy.type : 'Health',
        amount: `₹${Number(claimAmount).toLocaleString()}`,
        dateFiled: new Date().toISOString().split('T')[0],
        status: 'In Progress',
        description: claimDesc,
        fileName: claimFile ? claimFile.name : 'Not Provided',
        fileUrl: finalFileUrl,
        userId: uid,
        history: [
          { date: new Date().toISOString().split('T')[0], status: 'Claim Filed', note: 'Claim registered online by user.' }
        ]
      };

      await addDocWithAudit('claims', newClaim, user);
      await saveAuditLog(`Claim filed: ${claimPolicy}`, user);

      setClaimSuccess(true);
      setSuccessMsg('');
      setTimeout(() => {
        setClaimSuccess(false);
        setShowClaimModal(false);
        setClaimStep(1);
        setClaimAmount('');
        setClaimDesc('');
        setClaimLossDate('');
        setClaimFile(null);
        setClaimFileObj(null);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenewSubmit = async (e) => {
    e.preventDefault();
    if (!renewPolicy) return;
    try {
      await updateDocWithAudit('policies', renewPolicy.id, {
        status: 'Active',
        nextDueDate: '2027-07-20',
        endDate: '2027-07-20'
      }, user);
      
      await saveAuditLog(`Policy renewed: ${renewPolicy.policyNumber}`, user);

      setRenewSuccess(true);
      setTimeout(() => {
        setRenewSuccess(false);
        setShowRenewModal(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDocUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        setUploadedFile(file.name);
        const downloadURL = await uploadMediaFile(file, 'documents');
        const newDoc = {
          name: file.name,
          url: downloadURL,
          date: new Date().toISOString().split('T')[0],
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          userId: user.uid || user.id
        };
        await addDocWithAudit('documents', newDoc, user);
        setTimeout(() => setUploadedFile(null), 3000);
      } catch (err) {
        console.error("Document upload failed", err);
        setUploadedFile(null);
      }
    }
  };

  const handleDocDelete = async (idx) => {
    const targetDoc = docs[idx];
    if (!targetDoc || !targetDoc.id) {
      // fallback if it doesn't have an id (local state fallback)
      setDocs(docs.filter((_, i) => i !== idx));
      return;
    }
    try {
      await deleteDocWithAudit('documents', targetDoc.id, user);
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  const getPlanIcon = (type) => {
    switch (type) {
      case 'Health': return <FaHeartbeat className="text-rose-500 text-lg" />;
      case 'Motor': return <FaCar className="text-blue-500 text-lg" />;
      case 'Life': return <FaShieldAlt className="text-indigo-500 text-lg" />;
      default: return <FaShieldAlt className="text-gold-500 text-lg" />;
    }
  };

  // 1. OVERVIEW VIEW
  if (!tab || tab === 'overview') {
    const activePolicies = policies.filter(p => p.status === 'Active');
    const openClaims = claims.filter(c => c.status === 'In Progress');

    return (
      <div className="space-y-6 text-left">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <FaShieldAlt className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Coverages</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">{activePolicies.length} Policies</h3>
            </div>
          </div>

          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 flex items-center space-x-4">
            <div className="p-3 bg-gold-500/10 text-gold-500 rounded-xl">
              <FaFileInvoice className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Next Premium Amount</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">₹12,500.00</h3>
            </div>
          </div>

          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <FaClock className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Claims Under Review</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">{openClaims.length} Pending</h3>
            </div>
          </div>
        </div>

        {/* Policies & Claims Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Policies Table */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-navy-950 dark:text-white">Active Insurance Portfolios</h3>
              <Button variant="outline" size="sm" onClick={() => setShowClaimModal(true)}>File a Claim</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-200/50 dark:border-white/5 pb-2 text-left font-bold">
                    <th className="py-2.5">Policy Number</th>
                    <th>Insured Plan</th>
                    <th>Type</th>
                    <th>Renewal Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {policies.map(p => (
                    <tr key={p.policyNumber} className="hover:bg-slate-50/50 dark:hover:bg-navy-900/10">
                      <td className="py-3 font-semibold text-navy-950 dark:text-white">{p.policyNumber}</td>
                      <td>
                        <div className="flex items-center space-x-1.5">
                          {getPlanIcon(p.type)}
                          <span className="font-medium">{p.planName}</span>
                        </div>
                      </td>
                      <td>{p.type}</td>
                      <td>{p.endDate}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          p.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick claim tracker */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 space-y-4">
            <h3 className="text-base font-bold text-navy-950 dark:text-white">Live Claims Timeline</h3>
            
            <div className="space-y-4">
              {claims.slice(0, 2).map((claim) => (
                <div key={claim.id} className="p-3 bg-slate-50 dark:bg-navy-900/40 rounded-xl space-y-2 border border-slate-200/30 dark:border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-navy-950 dark:text-white">{claim.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      claim.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                      claim.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-400/10 text-slate-400'
                    }`}>{claim.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{claim.planName}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Filed: {claim.dateFiled}</span>
                    <span className="font-bold text-gold-500">{claim.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Claim Modal Portal */}
        <Modal isOpen={showClaimModal} onClose={() => setShowClaimModal(false)} title="File New Insurance Claim" size="md">
          {claimSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 text-3xl mb-2 animate-bounce">
                <FaCheckCircle />
              </div>
              <h3 className="text-lg font-bold text-navy-950 dark:text-white">Claim Logged Successfully</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Claim case ID has been generated. The Employee Queue will evaluate the document proof.
              </p>
            </div>
          ) : (
            <div className="pt-2">
              {/* Step Progress Tracker */}
              <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-white/5 pb-4 mb-4 text-[10px] font-bold text-slate-400">
                <span className={claimStep === 1 ? "text-gold-500" : claimStep > 1 ? "text-navy-950 dark:text-white font-extrabold" : ""}>1. Incident Details</span>
                <span className="text-slate-200 dark:text-white/10 font-normal">➔</span>
                <span className={claimStep === 2 ? "text-gold-500" : claimStep > 2 ? "text-navy-950 dark:text-white font-extrabold" : ""}>2. Proof of Loss</span>
                <span className="text-slate-200 dark:text-white/10 font-normal">➔</span>
                <span className={claimStep === 3 ? "text-gold-500" : ""}>3. Summary Preview</span>
              </div>

              {claimStep === 1 && (
                /* STEP 1: DETAILS */
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Policy Account</label>
                    <select
                      value={claimPolicy}
                      onChange={(e) => setClaimPolicy(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white"
                    >
                      {policies.map(p => (
                        <option key={p.policyNumber} value={p.policyNumber}>
                          {p.policyNumber} - {p.planName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Estimated Loss Date</label>
                      <input
                        required
                        type="date"
                        value={claimLossDate}
                        onChange={(e) => setClaimLossDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Claim Amount Requested (₹)</label>
                      <input
                        required
                        type="number"
                        value={claimAmount}
                        onChange={(e) => setClaimAmount(e.target.value)}
                        placeholder="12000"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end space-x-2 border-t border-slate-200/50 dark:border-white/5">
                    <Button variant="secondary" onClick={() => setShowClaimModal(false)}>Cancel</Button>
                    <Button
                      variant="gold"
                      disabled={!claimLossDate || !claimAmount}
                      onClick={() => setClaimStep(2)}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {claimStep === 2 && (
                /* STEP 2: PROOF & DESCRIPTION */
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Incident Description</label>
                    <textarea
                      required
                      value={claimDesc}
                      onChange={(e) => setClaimDesc(e.target.value)}
                      placeholder="Detail the accident, hospital admission diagnosis, or structural damage..."
                      rows="3"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Upload Receipt Invoice Proof (PDF/Image)</label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer relative ${
                        isDragOver 
                          ? 'border-gold-500 bg-gold-500/5' 
                          : 'border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-navy-900/40'
                      }`}
                    >
                      <input 
                        type="file" 
                        onChange={handleFileSelect} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        accept="image/*,application/pdf"
                      />
                      
                      {claimFile ? (
                        <div className="space-y-2">
                          <FaFileInvoice className="text-3xl text-gold-500 mx-auto" />
                          <div>
                            <p className="font-bold text-navy-950 dark:text-white truncate max-w-[200px] mx-auto">{claimFile.name}</p>
                            <p className="text-[10px] text-slate-400">{claimFile.size}</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setClaimFile(null); }}
                            className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer"
                          >
                            Remove File
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <FaCloudUploadAlt className="text-3xl text-slate-400 mx-auto animate-pulse" />
                          <p className="font-bold text-navy-950 dark:text-slate-300">Drag & drop files here</p>
                          <p className="text-[10px] text-slate-400">or click to browse from device (PDF, PNG, JPG)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between space-x-2 border-t border-slate-200/50 dark:border-white/5">
                    <Button variant="secondary" onClick={() => setClaimStep(1)}>Back</Button>
                    <Button
                      variant="gold"
                      disabled={!claimDesc}
                      onClick={() => setClaimStep(3)}
                    >
                      Preview Summary
                    </Button>
                  </div>
                </div>
              )}

              {claimStep === 3 && (
                /* STEP 3: PREVIEW & SUBMIT */
                <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
                  <div className="bg-slate-50 dark:bg-navy-900/40 border border-slate-200/50 dark:border-white/5 rounded-2xl p-4 space-y-3 text-left">
                    <h4 className="text-[10px] font-bold text-gold-500 uppercase tracking-wider">Claims Review Summary</h4>
                    
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Policy Number</span>
                        <span className="font-semibold text-navy-950 dark:text-white">{claimPolicy}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Loss Event Date</span>
                        <span className="font-semibold text-navy-950 dark:text-white">{claimLossDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Amount Requested</span>
                        <span className="font-bold text-gold-500 text-sm">₹{Number(claimAmount).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Document Evidence</span>
                        <span className="font-semibold text-navy-950 dark:text-white truncate block max-w-[150px]">
                          {claimFile ? claimFile.name : 'No file attached'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/40 dark:border-white/5">
                      <span className="text-[10px] text-slate-400 block">Incident Description</span>
                      <p className="text-slate-600 dark:text-slate-300 leading-normal italic mt-0.5">{claimDesc}</p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between space-x-2 border-t border-slate-200/50 dark:border-white/5">
                    <Button variant="secondary" onClick={() => setClaimStep(2)}>Back</Button>
                    <Button type="submit" variant="gold" className="px-6 font-bold">Submit Claim</Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </Modal>
      </div>
    );
  }

  // 2. POLICIES TAB
  if (tab === 'policies') {
    return (
      <div className="space-y-6 text-left">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-navy-950 dark:text-white">Active Insurance Packages</h2>
          <Button variant="gold" size="sm" onClick={() => setShowClaimModal(true)}>File Claim</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policies.map(p => (
            <div key={p.policyNumber} className="glass-panel dark:glass-panel-gold rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  {getPlanIcon(p.type)}
                  <div>
                    <h3 className="text-base font-bold text-navy-950 dark:text-white leading-tight">{p.planName}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{p.policyNumber}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                }`}>{p.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <p className="text-slate-400 font-medium">Coverage Assured</p>
                  <p className="font-semibold text-navy-950 dark:text-white">{p.coverage}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Monthly Premium</p>
                  <p className="font-semibold text-gold-500">{p.premiumAmount}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Policy Start Date</p>
                  <p className="font-medium text-slate-600 dark:text-slate-300">{p.startDate}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Expiration Date</p>
                  <p className="font-medium text-slate-600 dark:text-slate-300">{p.endDate}</p>
                </div>
              </div>

              {p.insuredPersons && (
                <div className="text-xs border-t border-slate-100 dark:border-white/5 pt-3">
                  <span className="text-slate-400 font-medium">Insured Persons: </span>
                  <span className="font-semibold">{p.insuredPersons.join(', ')}</span>
                </div>
              )}

              {p.status === 'Renewal Due' && (
                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex justify-end">
                  <Button variant="gold" size="sm" onClick={() => {
                    setRenewPolicy(p);
                    setShowRenewModal(true);
                  }}>Renew Now</Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Claim Modal reuse */}
        <Modal isOpen={showClaimModal} onClose={() => setShowClaimModal(false)} title="File Claim" size="md">
          {/* Claim submit wizard form */}
          <form onSubmit={handleClaimSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Claim Amount Requested (₹)</label>
              <input required type="number" placeholder="500" value={claimAmount} onChange={e => setClaimAmount(e.target.value)} className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Details</label>
              <textarea required placeholder="Explain..." rows="3" value={claimDesc} onChange={e => setClaimDesc(e.target.value)} className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white"></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowClaimModal(false)}>Cancel</Button>
              <Button type="submit" variant="gold">Process Claim</Button>
            </div>
          </form>
        </Modal>

        {/* Renewal Modal */}
        <Modal isOpen={showRenewModal} onClose={() => setShowRenewModal(false)} title="Renew Policy Coverage" size="md">
          {renewSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 text-3xl mb-2 animate-bounce">
                <FaCheckCircle />
              </div>
              <h3 className="text-lg font-bold text-navy-950 dark:text-white">Policy Renewed</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your premium payment has been processed and policy coverage has been extended.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRenewSubmit} className="space-y-4 pt-2 text-xs">
              <p className="text-slate-500">
                Confirm renewal for <strong>{renewPolicy?.planName}</strong> ({renewPolicy?.policyNumber}).
              </p>
              <div className="p-3 bg-slate-50 dark:bg-navy-900 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span>Annual Premium Cost:</span>
                  <span className="font-bold text-gold-500">₹4,200.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Coverage Term:</span>
                  <span>1 Year Extension</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="secondary" onClick={() => setShowRenewModal(false)}>Cancel</Button>
                <Button type="submit" variant="gold">Authorize Payment & Renew</Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    );
  }

  // 3. CLAIMS CENTER TAB
  if (tab === 'claims') {
    return (
      <div className="space-y-6 text-left">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-navy-950 dark:text-white">Filing & Claim Histories</h2>
          <Button variant="gold" size="sm" onClick={() => setShowClaimModal(true)}>File New Claim</Button>
        </div>

        <div className="space-y-6">
          {claims.map(claim => (
            <div key={claim.id} className="glass-panel dark:glass-panel-gold rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-slate-100 dark:bg-navy-900 rounded-xl text-navy-950 dark:text-white shrink-0">
                    {getPlanIcon(claim.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-950 dark:text-white">{claim.planName}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">ID: {claim.id} | Policy: {claim.policyNumber}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    claim.status === 'Approved' || claim.status === 'Settled' ? 'bg-emerald-500/10 text-emerald-500' :
                    claim.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-400/10 text-slate-400'
                  }`}>{claim.status}</span>
                  <p className="text-sm font-extrabold text-navy-950 dark:text-white mt-1">{claim.amount}</p>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs space-y-1">
                <span className="text-slate-400 font-medium">Claim Remarks:</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {claim.description}
                </p>
              </div>

              {/* History Timeline */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Audit Log & Timeline</h4>
                <div className="space-y-3 relative pl-4 border-l border-slate-200 dark:border-white/10">
                  {claim.history.map((hist, idx) => (
                    <div key={idx} className="relative text-xs">
                      {/* Timeline dot */}
                      <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-gold-400 ring-4 ring-white dark:ring-navy-950" />
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-navy-950 dark:text-white">{hist.status}</span>
                        <span className="text-[10px] text-slate-400">{hist.date}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{hist.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. DOCUMENT HUB TAB
  if (tab === 'documents') {
    return (
      <div className="space-y-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-navy-950 dark:text-white">Insurance Document Vault</h2>
          
          <label className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-600 text-navy-950 text-xs font-bold rounded-xl shadow cursor-pointer transition-colors">
            <FaCloudUploadAlt className="text-sm" />
            <span>Upload Document</span>
            <input type="file" onChange={handleDocUpload} className="hidden" />
          </label>
        </div>

        {uploadedFile && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <FaCheckCircle />
            <span>File <strong>{uploadedFile}</strong> uploaded successfully and added to vault list.</span>
          </div>
        )}

        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
            {docs.map((doc, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-slate-100 dark:bg-navy-900 rounded-xl text-gold-500 shrink-0">
                    <FaFolderOpen className="text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-950 dark:text-white hover:underline cursor-pointer">{doc.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Uploaded on {doc.date} | Size: {doc.size}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDocDelete(idx)}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-900 transition-all cursor-pointer"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 5. SETTINGS / PROFILE TAB
  if (tab === 'settings') {
    return (
      <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 text-left space-y-6 max-w-2xl border border-slate-200/40 dark:border-white/5">
        <h2 className="text-lg font-bold text-navy-950 dark:text-white border-l-2 border-gold-400 pl-2">
          Profile & Account Management
        </h2>

        <form className="space-y-4 text-xs" onSubmit={e => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">First Name</label>
              <input type="text" defaultValue="John" className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Last Name</label>
              <input type="text" defaultValue="Doe" className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
            <input type="email" defaultValue={user.email} className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-navy-900 rounded-xl space-y-3">
            <h4 className="font-bold text-navy-950 dark:text-white text-[11px] uppercase tracking-wider">Premium Billing Plan</h4>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-gold-500 h-4 w-4 bg-white dark:bg-navy-950 border-slate-200" />
              <div>
                <p className="font-semibold text-navy-950 dark:text-white">Enable Automated Premium Auto-Debit</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Deducts monthly premium invoices directly from bank draft.</p>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="gold">Update Settings</Button>
          </div>
        </form>
      </div>
    );
  }

  // 6. SUPPORT TAB
  if (tab === 'support') {
    return (
      <div className="space-y-6 text-left">
        <h2 className="text-xl font-bold text-navy-950 dark:text-white">Helpdesk Support Inbox</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
            <h3 className="font-bold text-navy-950 dark:text-white text-sm">Recent Queries</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-navy-900/40 border border-slate-200/50 dark:border-white/5 rounded-xl flex justify-between items-center gap-4">
                <div>
                  <p className="font-semibold text-navy-950 dark:text-white">Tax Certificate for July 2026</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Opened 2 days ago | Category: Billing</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-500">Open</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-navy-900/40 border border-slate-200/50 dark:border-white/5 rounded-xl flex justify-between items-center gap-4">
                <div>
                  <p className="font-semibold text-navy-950 dark:text-white">Claims Form Appendectomy PDF issue</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Opened 1 week ago | Resolved on July 10</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-500">Resolved</span>
              </div>
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
            <h3 className="font-bold text-navy-950 dark:text-white text-sm">File Support Ticket</h3>
            <form onSubmit={e => { e.preventDefault(); alert('Mock ticket submitted!'); }} className="space-y-3 text-xs">
              <div>
                <input required placeholder="Ticket Subject" className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
              </div>
              <div>
                <textarea required placeholder="Explain issue..." rows="3" className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white"></textarea>
              </div>
              <Button type="submit" variant="gold" className="w-full text-xs">Submit Ticket</Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <EmptyState title="No Dashboard Section" description="The requested section could not be found." />;
};
export default CustomerDashboard;
