import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, 
  FaCheckCircle, FaTimesCircle, FaArrowLeft, FaSave, 
  FaBox, FaBuilding, FaTags, FaExclamationCircle, FaTimes, FaImage, FaPowerOff, FaEye, FaUpload, FaSpinner
} from 'react-icons/fa';
import { getSettings } from '../../../services/api';
import { getPlans, createPlan, updatePlan, deletePlan } from '../../../features/plans/services/planService';
import { uploadMediaFile } from '../../../services/firebaseService';
import { z } from 'zod';
import imageCompression from 'browser-image-compression';

const DEFAULT_COMPANIES = [
  'SBI Life Insurance', 'LIC', 'Tata AIA', 'HDFC Life', 
  'ICICI Prudential', 'Star Health', 'Care Health', 'Niva Bupa', 'Bajaj Allianz'
];

const DEFAULT_CATEGORIES = [
  'Health Insurance', 'Life Insurance', 'General Insurance'
];

const BILLING_TYPES = ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly'];
const STATUSES = ['Active', 'Inactive', 'Featured Plan', 'Recommended Plan', 'Popular Plan'];

const planSchema = z.object({
  title: z.string().min(3, 'Plan name must be at least 3 characters'),
  company: z.string().min(1, 'Please select a company'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().optional(),
  premiumAmount: z.string().min(1, 'Premium amount is required'),
  billingCycle: z.string(),
  coverageAmount: z.string().min(1, 'Coverage amount is required'),
  features: z.array(z.string()).refine(arr => arr.filter(f => f.trim()).length > 0, 'At least one valid feature is required'),
  status: z.string(),
  priority: z.string(),
  thumbnailUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  slug: z.string().optional(),
});

export const ManagerDashboard = () => {
  const [view, setView] = useState('list');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Dynamic Settings
  const [companies, setCompanies] = useState(DEFAULT_COMPANIES);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  // Filtering & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('Newest');

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', company: '', category: '', description: '',
    premiumAmount: '', billingCycle: 'Monthly', coverageAmount: '',
    features: [''], status: 'Active', priority: '1',
    thumbnailUrl: '', bannerUrl: '',
    metaTitle: '', metaDescription: '', slug: ''
  });
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Modals / Toasts
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchSettings();
    fetchPlans();
  }, []);

  const fetchSettings = async () => {
    const settings = await getSettings('dropdowns');
    if (settings) {
      if (settings.companies) setCompanies(settings.companies);
      if (settings.categories) setCategories(settings.categories);
    }
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await getPlans(null, 15);
      setPlans(data.plans);
      setLastVisible(data.lastVisible);
      setHasMore(data.plans.length === 15);
    } catch (err) {
      showToast('Failed to load plans.', 'error');
    }
    setLoading(false);
  };

  const loadMorePlans = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await getPlans(lastVisible, 15);
      setPlans(prev => [...prev, ...data.plans]);
      setLastVisible(data.lastVisible);
      setHasMore(data.plans.length === 15);
    } catch (err) {
      showToast('Failed to load more plans.', 'error');
    }
    setLoadingMore(false);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // KPIs
  const totalPlans = plans.length;
  const activePlans = plans.filter(p => p.status && p.status !== 'Inactive').length;
  const inactivePlans = plans.filter(p => p.status === 'Inactive').length;
  const uniqueCategories = new Set(plans.map(p => p.category)).size;
  const uniqueCompanies = new Set(plans.map(p => p.company)).size;

  let filteredPlans = plans.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCompany = filterCompany ? p.company === filterCompany : true;
    const matchCategory = filterCategory ? p.category === filterCategory : true;
    return matchSearch && matchCompany && matchCategory;
  });

  if (sortBy === 'Premium') {
    filteredPlans = filteredPlans.sort((a, b) => parseFloat(a.premiumAmount || 0) - parseFloat(b.premiumAmount || 0));
  }

  const openCreateForm = () => {
    setEditingId(null);
    setFormData({
      title: '', company: '', category: '', description: '',
      premiumAmount: '', billingCycle: 'Monthly', coverageAmount: '',
      features: [''], status: 'Active', priority: '1',
      thumbnailUrl: '', bannerUrl: '', metaTitle: '', metaDescription: '', slug: ''
    });
    setFormError('');
    setView('form');
  };

  const openEditForm = (plan) => {
    setEditingId(plan.id);
    setFormData({
      title: plan.title || plan.name || '',
      company: plan.company || '',
      category: plan.category || '',
      description: plan.description || '',
      premiumAmount: (plan.premiumAmount || plan.premiumMonthly || '').toString(),
      billingCycle: plan.billingCycle || 'Monthly',
      coverageAmount: (plan.coverageAmount || '').toString(),
      features: plan.features?.length ? [...plan.features] : [''],
      status: plan.status || 'Active',
      priority: plan.priority?.toString() || '1',
      thumbnailUrl: plan.thumbnailUrl || '',
      bannerUrl: plan.bannerUrl || '',
      metaTitle: plan.metaTitle || '',
      metaDescription: plan.metaDescription || '',
      slug: plan.slug || ''
    });
    setFormError('');
    setView('form');
  };

  const handleDelete = async (id) => {
    try {
      await deletePlan(id);
      showToast('Plan deleted successfully');
      setDeleteModal(null);
      fetchPlans();
    } catch (e) {
      showToast('Failed to delete plan', 'error');
    }
  };

  const handleToggleStatus = async (plan) => {
    try {
      const newStatus = plan.status === 'Inactive' ? 'Active' : 'Inactive';
      await updatePlan(plan.id, { ...plan, status: newStatus });
      showToast(`Plan ${newStatus.toLowerCase()} successfully`);
      fetchPlans();
    } catch (e) {
      showToast(`Failed to update plan status`, 'error');
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };
  
  const addFeature = () => setFormData({ ...formData, features: [...formData.features, ''] });
  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError('');
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const url = await uploadMediaFile(compressedFile, 'plans');
      setFormData({ ...formData, [field]: url });
      showToast('Image uploaded successfully');
    } catch (error) {
      setFormError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const saveForm = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      // Validate using Zod
      const validatedData = planSchema.parse(formData);
      
      setFormSaving(true);
      const cleanData = { 
        ...validatedData, 
        name: validatedData.title,
        premiumMonthly: validatedData.premiumAmount,
        features: validatedData.features.filter(f => f && f.trim()) 
      };

      if (editingId) {
        await updatePlan(editingId, cleanData);
        showToast('Plan updated successfully');
      } else {
        await createPlan(cleanData);
        showToast('Plan created successfully');
      }
      setView('list');
      fetchPlans();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setFormError(err.errors[0].message);
      } else {
        setFormError(`An error occurred: ${err.message}`);
      }
    }
    setFormSaving(false);
  };

  return (
    <div className="w-full relative min-h-screen">
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-6 left-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-xl border ${
              toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : 'bg-green-500/90 border-green-400 text-white'
            }`}
          >
            {toast.type === 'error' ? <FaExclamationCircle /> : <FaCheckCircle />}
            <span className="font-bold text-sm tracking-wide">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-neutral-950 p-6 rounded-3xl shadow-2xl max-w-sm w-full border border-slate-200 dark:border-white/10"
            >
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Delete Plan?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Are you sure you want to delete this insurance plan? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(deleteModal)}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full h-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {view === 'list' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-white/5 flex flex-col justify-center">
                <div className="text-brand-accent mb-2"><FaBox className="text-xl" /></div>
                <h4 className="text-2xl font-black text-neutral-950 dark:text-white">{totalPlans}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Total Loaded</p>
              </div>
              <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-white/5 flex flex-col justify-center">
                <div className="text-green-500 mb-2"><FaCheckCircle className="text-xl" /></div>
                <h4 className="text-2xl font-black text-neutral-950 dark:text-white">{activePlans}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Active</p>
              </div>
              <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-white/5 flex flex-col justify-center">
                <div className="text-red-400 mb-2"><FaTimesCircle className="text-xl" /></div>
                <h4 className="text-2xl font-black text-neutral-950 dark:text-white">{inactivePlans}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Inactive</p>
              </div>
              <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-white/5 flex flex-col justify-center">
                <div className="text-purple-400 mb-2"><FaTags className="text-xl" /></div>
                <h4 className="text-2xl font-black text-neutral-950 dark:text-white">{uniqueCategories}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Categories</p>
              </div>
              <div className="glass-panel p-5 rounded-3xl border border-slate-200/50 dark:border-white/5 flex flex-col justify-center">
                <div className="text-blue-400 mb-2"><FaBuilding className="text-xl" /></div>
                <h4 className="text-2xl font-black text-neutral-950 dark:text-white">{uniqueCompanies}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Companies</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/50 dark:bg-neutral-900/30 p-2 rounded-2xl border border-slate-200/50 dark:border-white/5 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto p-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search plans..." 
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-accent transition-colors w-full md:w-48 text-neutral-950 dark:text-white"
                  />
                </div>
                <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} className="px-3 py-2 bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-accent text-neutral-950 dark:text-white cursor-pointer">
                  <option value="">All Companies</option>
                  {companies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-accent text-neutral-950 dark:text-white cursor-pointer">
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-brand-accent text-neutral-950 dark:text-white cursor-pointer">
                  <option value="Newest">Newest</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              <button 
                onClick={openCreateForm}
                className="w-full md:w-auto px-6 py-2.5 bg-brand-accent text-black font-black uppercase tracking-wider text-xs rounded-xl hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255, 179, 0,0.2)] whitespace-nowrap m-2 cursor-pointer"
              >
                + Create New Plan
              </button>
            </div>

            <div className="glass-panel rounded-3xl border border-slate-200/50 dark:border-white/5 overflow-hidden">
              {loading && plans.length === 0 ? (
                <div className="p-12 text-center text-slate-500 animate-pulse font-bold">Loading Plans...</div>
              ) : filteredPlans.length === 0 ? (
                <div className="p-12 text-center text-slate-500 font-bold flex flex-col items-center">
                  <FaBox className="text-4xl mb-4 opacity-20" />
                  <p>No plans found matching your criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-black/40 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-white/5 w-16">Image</th>
                        <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-white/5">Plan Name</th>
                        <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-white/5 hidden md:table-cell">Company</th>
                        <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-white/5 hidden lg:table-cell">Category</th>
                        <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-white/5">Premium</th>
                        <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-white/5">Status</th>
                        <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-white/5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                      {filteredPlans.map(plan => (
                        <tr key={plan.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                            {plan.thumbnailUrl ? (
                              <img src={plan.thumbnailUrl} alt={plan.title} className="w-10 h-10 rounded-lg bg-slate-200 object-cover border border-slate-200 dark:border-white/10" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 text-slate-400">
                                <FaImage />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-neutral-950 dark:text-white text-sm">{plan.title || plan.name}</div>
                            <div className="text-xs text-slate-500 md:hidden mt-1">{plan.company} • {plan.category}</div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                              {plan.company}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell text-xs font-medium text-slate-600 dark:text-slate-400">
                            {plan.category}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-black text-brand-accent dark:text-brand-accent">₹{plan.premiumAmount || plan.premiumMonthly}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{plan.billingCycle || 'Monthly'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md flex items-center w-max gap-1.5 ${
                              plan.status === 'Inactive' ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' 
                              : 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                            }`}>
                              {plan.status === 'Inactive' ? <FaTimesCircle /> : <FaCheckCircle />}
                              {plan.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                              <button onClick={() => openEditForm(plan)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer" title="View">
                                <FaEye className="text-xs" />
                              </button>
                              <button onClick={() => handleToggleStatus(plan)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${plan.status !== 'Inactive' ? 'bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white dark:bg-amber-500/10' : 'bg-green-100 text-green-600 hover:bg-green-500 hover:text-white dark:bg-green-500/10'}`} title={plan.status !== 'Inactive' ? 'Deactivate' : 'Activate'}>
                                <FaPowerOff className="text-xs" />
                              </button>
                              <button onClick={() => openEditForm(plan)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer" title="Edit">
                                <FaEdit className="text-xs" />
                              </button>
                              <button onClick={() => setDeleteModal(plan.id)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer" title="Delete">
                                <FaTrash className="text-xs" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {hasMore && (
                    <div className="p-4 border-t border-slate-200 dark:border-white/5 flex justify-center">
                      <button 
                        onClick={loadMorePlans} 
                        disabled={loadingMore}
                        className="px-6 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-2"
                      >
                        {loadingMore && <FaSpinner className="animate-spin" />}
                        {loadingMore ? 'Loading...' : 'Load More Plans'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="pb-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setView('list')}
                  className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 shadow-sm border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 hover:text-brand-accent transition-colors cursor-pointer"
                >
                  <FaArrowLeft />
                </button>
                <div>
                  <h2 className="text-2xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
                    {editingId ? 'Edit Insurance Plan' : 'Create New Plan'}
                  </h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Configure plan parameters</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setView('list')} className="px-5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors uppercase tracking-wider cursor-pointer">
                  Cancel
                </button>
                <button 
                  onClick={saveForm}
                  disabled={formSaving || uploadingImage}
                  className="px-6 py-2 bg-brand-accent text-black font-black uppercase tracking-wider text-xs rounded-xl hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255, 179, 0,0.2)] flex items-center gap-2 disabled:opacity-50 disabled:scale-100 cursor-pointer"
                >
                  <FaSave />
                  {formSaving ? 'Saving...' : (editingId ? 'Update Plan' : 'Publish Plan')}
                </button>
              </div>
            </div>

            {formError && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-sm font-bold">
                <FaExclamationCircle className="text-lg" />
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                
                <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-white/5">
                  <h3 className="text-sm font-black uppercase tracking-widest text-neutral-950 dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-3">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Insurance Company <span className="text-red-500">*</span></label>
                      <select required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-accent text-neutral-950 dark:text-white cursor-pointer">
                        <option value="" disabled>Select Company</option>
                        {companies.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Category <span className="text-red-500">*</span></label>
                      <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-accent text-neutral-950 dark:text-white cursor-pointer">
                        <option value="" disabled>Select Category</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Plan Name <span className="text-red-500">*</span></label>
                    <input required type="text" placeholder="e.g. Smart Health Premium" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-accent text-neutral-950 dark:text-white" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Short Description</label>
                    <textarea rows="3" placeholder="Brief description of the plan..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-accent text-neutral-950 dark:text-white resize-none" />
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-white/5">
                  <h3 className="text-sm font-black uppercase tracking-widest text-neutral-950 dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-3">Pricing & Coverage</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Premium Amount (₹) <span className="text-red-500">*</span></label>
                      <input required type="number" placeholder="e.g. 1250" value={formData.premiumAmount} onChange={e => setFormData({...formData, premiumAmount: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-accent text-neutral-950 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Billing Cycle</label>
                      <select value={formData.billingCycle} onChange={e => setFormData({...formData, billingCycle: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-accent text-neutral-950 dark:text-white cursor-pointer">
                        {BILLING_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Coverage Amount <span className="text-red-500">*</span></label>
                      <input required type="text" placeholder="e.g. ₹50 Lakhs" value={formData.coverageAmount} onChange={e => setFormData({...formData, coverageAmount: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-accent text-neutral-950 dark:text-white" />
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-white/5">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-white/5 pb-3">
                    <h3 className="text-sm font-black uppercase tracking-widest text-neutral-950 dark:text-white">Plan Features</h3>
                    <button onClick={addFeature} type="button" className="text-[10px] font-bold uppercase tracking-wider text-brand-accent flex items-center gap-1 hover:underline cursor-pointer">
                      <FaPlus /> Add Feature
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            placeholder="e.g. Cashless Treatment" 
                            value={feature} 
                            onChange={e => handleFeatureChange(index, e.target.value)} 
                            className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-accent text-neutral-950 dark:text-white" 
                          />
                          {formData.features.length > 1 && (
                            <button onClick={() => removeFeature(index)} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="space-y-6">
                
                <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-white/5">
                  <h3 className="text-sm font-black uppercase tracking-widest text-neutral-950 dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-3">Display Settings</h3>
                  
                  <div className="mb-6">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-accent text-neutral-950 dark:text-white cursor-pointer">
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Priority Number (Display Order)</label>
                    <input type="number" placeholder="1" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-accent text-neutral-950 dark:text-white" />
                    <p className="text-[9px] text-slate-400 mt-1 font-semibold">Lower numbers appear first.</p>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-slate-200/50 dark:border-white/5">
                  <h3 className="text-sm font-black uppercase tracking-widest text-neutral-950 dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-3">Media</h3>
                  
                  <div className="flex gap-4 mb-5 flex-col">
                    <div className="flex-1">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Plan Card Image (Thumbnail)</label>
                      <div className="relative">
                        <label className="w-full flex items-center justify-center py-3 bg-slate-50 dark:bg-black/50 border border-dashed border-slate-300 dark:border-white/20 rounded-xl text-xs font-bold cursor-pointer hover:border-brand-accent transition-colors text-slate-500 dark:text-slate-400">
                          <FaUpload className="mr-2" /> Upload Image
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'thumbnailUrl')} className="hidden" />
                        </label>
                      </div>
                    </div>
                    {formData.thumbnailUrl && (
                      <div className="w-full h-32 shrink-0 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-black/50">
                        <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>


                </div>

              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
