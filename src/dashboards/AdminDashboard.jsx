import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SYSTEM_LOGS, CAREERS, PLANS } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { SearchBar } from '../components/common/SearchBar';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { 
  FaShieldAlt, FaUsers, FaHistory, FaServer, FaCheckCircle, 
  FaTrash, FaPlus, FaInfoCircle, FaBriefcase, FaClock, 
  FaMapMarkerAlt, FaEdit, FaUserCircle, FaCamera, FaChevronRight 
} from 'react-icons/fa';
import { 
  subscribeToCollection, 
  addDocWithAudit, 
  updateDocWithAudit, 
  deleteDocWithAudit, 
  uploadMediaFile 
} from '../services/firebaseService';
import { db } from '../config/firebase';
import { doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';

export const AdminDashboard = ({ tab }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState(SYSTEM_LOGS);
  const [userSearch, setUserSearch] = useState('');
  const [systemLogsSearch, setSystemLogsSearch] = useState('');

  const [platformUsers, setPlatformUsers] = useState([
    { id: 'USR-101', name: 'John Doe', role: 'Customer', email: 'customer@mail.com', active: true },
    { id: 'USR-102', name: 'Sarah Jenkins', role: 'Agent', email: 'agent@mail.com', active: true },
    { id: 'USR-103', name: 'Mike Ross', role: 'Telecaller', email: 'telecaller@mail.com', active: true },
    { id: 'USR-104', name: 'Jane Watson', role: 'Employee', email: 'employee@mail.com', active: true },
    { id: 'USR-105', name: 'David Vance', role: 'Manager', email: 'manager1@mail.com', active: true },
    { id: 'USR-106', name: 'Alex Mercer', role: 'Admin', email: 'admin@mail.com', active: true }
  ]);

  // User Edit State
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('customer');
  const [editAvatar, setEditAvatar] = useState('');
  const [editAvatarFile, setEditAvatarFile] = useState(null);
  const [editActive, setEditActive] = useState(true);

  const handleOpenEditUserModal = (u) => {
    setEditingUser(u);
    setEditName(u.name || '');
    setEditEmail(u.email || '');
    setEditRole(u.role ? u.role.toLowerCase() : 'customer');
    setEditAvatar(u.avatar || '');
    setEditAvatarFile(null);
    setEditActive(u.active !== false);
  };

  const handleEditUserPhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setEditAvatarFile(file);
      setEditAvatar(URL.createObjectURL(file));
    }
  };

  const handleSaveEditedUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      let finalAvatarUrl = editAvatar;
      if (editAvatarFile) {
        setSuccessMsg('Uploading profile avatar...');
        finalAvatarUrl = await uploadMediaFile(editAvatarFile, 'avatars');
      }

      await updateDocWithAudit('users', editingUser.id, {
        name: editName.trim(),
        email: editEmail.trim(),
        role: editRole,
        avatar: finalAvatarUrl,
        active: editActive
      }, user);

      setEditingUser(null);
      setEditAvatarFile(null);
      setSuccessMsg('User profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setSuccessMsg(`Failed to save user updates: ${err.message}`);
    }
  };

  const [claims, setClaims] = useState([
    { id: 'CLM-901', client: 'Vijay Kumar', type: 'Health Platinum Cover', amount: '₹1,50,000', status: 'Pending', date: '2026-07-12' },
    { id: 'CLM-902', client: 'Arun Mozhi', type: 'Auto Max Cover', amount: '₹45,000', status: 'Approved', date: '2026-07-10' },
    { id: 'CLM-903', client: 'Deepa Selvan', type: 'Term Life Elite', amount: '₹12,00,000', status: 'Pending', date: '2026-07-09' },
    { id: 'CLM-904', client: 'Karthik Raja', type: 'Safe Haven Home Policy', amount: '₹3,50,000', status: 'Rejected', date: '2026-07-08' }
  ]);

  const handleUpdateClaimStatus = async (id, newStatus) => {
    try {
      await updateDocWithAudit('claims', id, { status: newStatus }, user);
      setSuccessMsg(`Escalated claim status updated to: ${newStatus}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const [awardsList, setAwardsList] = useState([
    { title: 'Excellence in Financial Planning', desc: 'Recognized for outstanding client portfolio management and wealth creation advisory.', img: '/IMG-20260714-WA0061.jpg' },
    { title: 'Best Insurance Distributor', desc: 'Commended for seamless claim settlement support and strategic insurance guidance.', img: '/IMG-20260714-WA0062.jpg' },
    { title: 'Trusted Mutual Fund Advisory', desc: 'Honored for delivering goal-based growth and custom risk mitigation strategies.', img: '/IMG-20260714-WA0063.jpg' },
    { title: 'Financial Literacy Contributor', desc: 'Recognized for public education campaigns on investment strategies and retirement savings.', img: '/IMG-20260714-WA0064.jpg' }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImg, setNewImg] = useState('/IMG-20260714-WA0061.jpg');
  const [customImgUrl, setCustomImgUrl] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Careers Job Opportunities State
  const [careersList, setCareersList] = useState(CAREERS);

  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDepartment, setNewJobDepartment] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('');
  const [newJobType, setNewJobType] = useState('Full-time');
  const [newJobDescription, setNewJobDescription] = useState('');

  // Edit Job Posting State
  const [editingJob, setEditingJob] = useState(null);
  const [editJobTitle, setEditJobTitle] = useState('');
  const [editJobDepartment, setEditJobDepartment] = useState('');
  const [editJobLocation, setEditJobLocation] = useState('');
  const [editJobType, setEditJobType] = useState('Full-time');
  const [editJobDescription, setEditJobDescription] = useState('');

  const handleOpenEditJobModal = (job) => {
    setEditingJob(job);
    setEditJobTitle(job.title || '');
    setEditJobDepartment(job.department || '');
    setEditJobLocation(job.location || '');
    setEditJobType(job.type || 'Full-time');
    setEditJobDescription(job.description || '');
  };

  const handleSaveEditedJob = async (e) => {
    e.preventDefault();
    if (!editingJob) return;

    try {
      await updateDocWithAudit('careers', editingJob.id, {
        title: editJobTitle.trim(),
        department: editJobDepartment.trim(),
        location: editJobLocation.trim() || 'Kanchipuram HQ',
        type: editJobType,
        description: editJobDescription.trim()
      }, user);
      setEditingJob(null);
      setSuccessMsg('Job opportunity updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Careers Page Content Settings (Editable from Settings tab)
  const [careersSettings, setCareersSettings] = useState({
    badge: 'Join Our Team',
    title: 'Build the Future of InsurTech',
    subtitle: 'We are looking for creative thinkers, diligent risk assessors, and talented engineers to shape digital protection products globally.',
    hrEmail: 'careers@skinsurance.com'
  });

  const handleSaveCareersSettings = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'careers_page'), careersSettings);
      setSuccessMsg('Careers Page settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('customer');

  const [permsMatrix, setPermsMatrix] = useState({
    'Initiate Mutual Fund SIP': ['Admin', 'Manager', 'Agent', 'Customer'],
    'Submit Insurance Claim': ['Admin', 'Manager', 'Employee', 'Agent', 'Customer'],
    'Approve Claim Requests': ['Admin', 'Manager', 'Employee'],
    'Read Platform Audit Logs': ['Admin', 'Manager'],
    'Upload Gallery Assets': ['Admin']
  });

  const handleTogglePerm = async (op, role) => {
    const current = permsMatrix[op] || [];
    const updated = current.includes(role)
      ? current.filter(r => r !== role)
      : [...current, role];
    const newMatrix = { ...permsMatrix, [op]: updated };
    
    try {
      await setDoc(doc(db, 'settings', 'permissions'), newMatrix);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setCustomImgUrl(URL.createObjectURL(file));
    }
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (awardsList.length >= 25) {
      setSuccessMsg('Maximum limit of 25 photos reached. Remove an item to add a new photo.');
      return;
    }
    if (!newTitle.trim() || !newDesc.trim()) return;

    try {
      let imgPath = newImg;
      if (photoFile) {
        setSuccessMsg('Uploading photo to Firebase Storage...');
        imgPath = await uploadMediaFile(photoFile, 'gallery');
      } else if (customImgUrl && !customImgUrl.startsWith('blob:')) {
        imgPath = customImgUrl.trim();
      }

      const newPhoto = {
        title: newTitle.trim(),
        tag: newTag.trim() || 'CERTIFIED RECOGNITION',
        desc: newDesc.trim(),
        img: imgPath
      };

      await addDocWithAudit('gallery', newPhoto, user);

      setNewTitle('');
      setNewTag('');
      setNewDesc('');
      setCustomImgUrl('');
      setPhotoFile(null);
      setSuccessMsg('Photo added to gallery successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setSuccessMsg(`Failed to add photo: ${err.message}`);
    }
  };

  const handleRemovePhoto = async (index) => {
    const target = awardsList[index];
    if (!target) return;
    try {
      await deleteDocWithAudit('gallery', target.id, user);
      setSuccessMsg('Photo removed from gallery.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Plans Database Management State (Admin database control)
  const [plansDb, setPlansDb] = useState(PLANS);

  const [planSearch, setPlanSearch] = useState('');
  const [editingPlan, setEditingPlan] = useState(null);
  const [editPlanName, setEditPlanName] = useState('');
  const [editPlanCompany, setEditPlanCompany] = useState('');
  const [editPlanCategory, setEditPlanCategory] = useState('');
  const [editPlanCoverage, setEditPlanCoverage] = useState('');
  const [editPlanPremium, setEditPlanPremium] = useState('');
  const [editPlanDescription, setEditPlanDescription] = useState('');
  const [editPlanDisplayOrder, setEditPlanDisplayOrder] = useState('1');
  const [editPlanIsVisible, setEditPlanIsVisible] = useState(true);
  const [editPlanShowOnHome, setEditPlanShowOnHome] = useState(true);
  const [editPlanFeatures, setEditPlanFeatures] = useState('');
  const [editPlanBadge, setEditPlanBadge] = useState('');

  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanCompany, setNewPlanCompany] = useState('SBI Life Insurance');
  const [newPlanCategory, setNewPlanCategory] = useState('Child Plan');
  const [newPlanCoverage, setNewPlanCoverage] = useState('1,0,000');
  const [newPlanPremium, setNewPlanPremium] = useState('₹950/month*');
  const [newPlanDescription, setNewPlanDescription] = useState('');
  const [newPlanDisplayOrder, setNewPlanDisplayOrder] = useState('1');
  const [newPlanIsVisible, setNewPlanIsVisible] = useState(true);
  const [newPlanShowOnHome, setNewPlanShowOnHome] = useState(true);
  const [newPlanFeatures, setNewPlanFeatures] = useState("Cashless hospitalisation & claims processing\nFlexible premium payout options\nTax savings benefit\nOptional rider protection");
  const [newPlanBadge, setNewPlanBadge] = useState('NEW OFFER');

  const handleOpenEditPlanModal = (plan) => {
    setEditingPlan(plan);
    setEditPlanName(plan.name || '');
    setEditPlanCompany(plan.company || 'SBI Life Insurance');
    setEditPlanCategory(plan.category || 'Child Plan');
    setEditPlanCoverage(plan.coverageAmount || '');
    setEditPlanPremium(plan.premiumStartsFrom || '');
    setEditPlanDescription(plan.description || '');
    setEditPlanDisplayOrder(plan.displayOrder !== undefined ? String(plan.displayOrder) : '1');
    setEditPlanIsVisible(plan.isVisible !== undefined ? plan.isVisible : true);
    setEditPlanShowOnHome(plan.showOnHome !== undefined ? plan.showOnHome : true);
    setEditPlanFeatures(plan.features ? plan.features.join('\n') : '');
    setEditPlanBadge(plan.badge || '');
  };

  const handleSaveEditedPlan = async (e) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      await updateDocWithAudit('plans', editingPlan.id, {
        name: editPlanName.trim(),
        company: editPlanCompany.trim(),
        category: editPlanCategory.trim(),
        categoryTag: editPlanCategory.trim().toUpperCase(),
        coverageAmount: editPlanCoverage.trim(),
        premiumStartsFrom: editPlanPremium.trim(),
        description: editPlanDescription.trim(),
        displayOrder: parseInt(editPlanDisplayOrder) || 1,
        isVisible: editPlanIsVisible,
        showOnHome: editPlanShowOnHome,
        features: editPlanFeatures.split('\n').map(f => f.trim()).filter(Boolean),
        badge: editPlanBadge.trim()
      }, user);
      setEditingPlan(null);
      setSuccessMsg('Insurance Plan database updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPlanSubmit = async (e) => {
    e.preventDefault();
    if (!newPlanName.trim() || !newPlanDescription.trim()) return;

    const newPlan = {
      name: newPlanName.trim(),
      company: newPlanCompany.trim(),
      category: newPlanCategory.trim(),
      categoryTag: newPlanCategory.trim().toUpperCase(),
      description: newPlanDescription.trim(),
      coverageLabel: 'STANDARD COVERAGE VALUE',
      coverageAmount: newPlanCoverage.trim(),
      premiumStartsFrom: newPlanPremium.trim(),
      premiumMonthly: 500,
      features: newPlanFeatures.split('\n').map(f => f.trim()).filter(Boolean),
      badge: newPlanBadge.trim(),
      displayOrder: parseInt(newPlanDisplayOrder) || 1,
      isVisible: newPlanIsVisible,
      showOnHome: newPlanShowOnHome
    };

    try {
      await addDocWithAudit('plans', newPlan, user);
      setNewPlanName('');
      setNewPlanDescription('');
      setNewPlanDisplayOrder('1');
      setNewPlanIsVisible(true);
      setNewPlanShowOnHome(true);
      setNewPlanFeatures("Cashless hospitalisation & claims processing\nFlexible premium payout options\nTax savings benefit\nOptional rider protection");
      setNewPlanBadge('NEW OFFER');
      setShowAddPlanModal(false);
      setSuccessMsg('New policy plan added to database successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      await deleteDocWithAudit('plans', planId, user);
      setSuccessMsg('Insurance policy plan deleted from database.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobDepartment.trim() || !newJobDescription.trim()) return;

    const newJob = {
      title: newJobTitle.trim(),
      department: newJobDepartment.trim(),
      location: newJobLocation.trim() || 'Kanchipuram HQ',
      type: newJobType,
      description: newJobDescription.trim()
    };

    try {
      await addDocWithAudit('careers', newJob, user);
      setNewJobTitle('');
      setNewJobDepartment('');
      setNewJobLocation('');
      setNewJobType('Full-time');
      setNewJobDescription('');
      setSuccessMsg('New job opportunity published to Careers page successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveJob = async (jobId) => {
    try {
      await deleteDocWithAudit('careers', jobId, user);
      setSuccessMsg('Job posting removed from Careers page.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const nextId = `USR-${Date.now()}`;
    const newUser = {
      id: nextId,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      active: true
    };
    
    try {
      await setDoc(doc(db, 'users', nextId), newUser);
      setNewUserName('');
      setNewUserEmail('');
      setShowAddUserForm(false);
      setSuccessMsg('User profile provisioned successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setSuccessMsg('User account deleted.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Setup Real-Time Subscriptions
  useEffect(() => {
    // 1. Subscribe to users
    const unsubscribeUsers = subscribeToCollection('users', setPlatformUsers);

    // 2. Subscribe to gallery
    const unsubscribeGallery = subscribeToCollection('gallery', setAwardsList);

    // 3. Subscribe to plans
    const unsubscribePlans = subscribeToCollection('plans', setPlansDb);

    // 4. Subscribe to careers
    const unsubscribeCareers = subscribeToCollection('careers', setCareersList);

    // 5. Subscribe to claims
    const unsubscribeClaims = subscribeToCollection('claims', setClaims);

    // 6. Subscribe to logs
    const unsubscribeLogs = subscribeToCollection('logs', (data) => {
      const sorted = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setLogs(sorted);
    });

    // 7. Subscribe to careers page settings
    const unsubscribeCareersSettings = onSnapshot(doc(db, 'settings', 'careers_page'), (snap) => {
      if (snap.exists()) setCareersSettings(snap.data());
    });

    // 8. Subscribe to permissions matrix
    const unsubscribePerms = onSnapshot(doc(db, 'settings', 'permissions'), (snap) => {
      if (snap.exists()) setPermsMatrix(snap.data());
    });

    return () => {
      unsubscribeUsers();
      unsubscribeGallery();
      unsubscribePlans();
      unsubscribeCareers();
      unsubscribeClaims();
      unsubscribeLogs();
      unsubscribeCareersSettings();
      unsubscribePerms();
    };
  }, []);

  const filteredUsers = platformUsers.filter(u =>
    (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredLogs = logs.filter(log =>
    (log.user || '').toLowerCase().includes(systemLogsSearch.toLowerCase()) ||
    (log.action || '').toLowerCase().includes(systemLogsSearch.toLowerCase())
  );

  // 0. FEATURE-RICH EXECUTIVE COMMAND CONSOLE FOR ADMIN HOME
  if (!tab || tab === '' || tab === 'index' || tab === 'home') {
    return (
      <div className="space-y-8 text-left">
        {/* Executive Welcome & Health Header Banner */}
        <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-white/10 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 z-10 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>🟢 Live Operational Status: 99.9% Uptime</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 dark:text-white tracking-tight">
              Welcome back, {user?.name || 'System Administrator'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              SK Smart Executive Control Center is online. Quick access tools and diagnostic features are active.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            <Button variant="gold" size="sm" onClick={() => navigate('/dashboard/plans-manager')}>
              📂 Manage Policy Plans
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/overview')}>
              📊 Open Analytics
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/users')}>
              👥 Provision Users
            </Button>
          </div>
        </div>

        {/* Quick Launch Command Hub Grid (5 Main Features) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 0: Plans Manager */}
          <div 
            onClick={() => navigate('/dashboard/plans-manager')}
            className="glass-panel rounded-3xl p-5 border border-slate-200/60 dark:border-white/10 hover:border-gold-500/50 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gold-500/10 text-gold-500 rounded-2xl group-hover:scale-110 transition-transform">
                <FaBriefcase className="text-xl" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-gold-500 bg-gold-500/10 px-2 py-0.5 rounded-full">
                DATABASE
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-950 dark:text-white group-hover:text-gold-500 transition-colors">
                Plans Database
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Add, edit, or delete policy plans across 16 companies.
              </p>
            </div>
            <div className="text-[11px] font-bold text-gold-500 flex items-center space-x-1 pt-1">
              <span>Control Database</span>
              <span>→</span>
            </div>
          </div>
          {/* Card 1: System Analytics */}
          <div 
            onClick={() => navigate('/dashboard/overview')}
            className="glass-panel rounded-3xl p-6 border border-slate-200/60 dark:border-white/10 hover:border-gold-500/50 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl group-hover:scale-110 transition-transform">
                <FaServer className="text-2xl" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                ANALYTICS
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white group-hover:text-gold-500 transition-colors">
                System Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                DB Clusters, user signups, and underwriting statistics.
              </p>
            </div>
            <div className="text-xs font-bold text-gold-500 flex items-center space-x-1 pt-2">
              <span>View Dashboard</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2: Account Management */}
          <div 
            onClick={() => navigate('/dashboard/users')}
            className="glass-panel rounded-3xl p-6 border border-slate-200/60 dark:border-white/10 hover:border-blue-500/50 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
                <FaUsers className="text-2xl" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full">
                {platformUsers.length} USERS
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white group-hover:text-blue-500 transition-colors">
                User Accounts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Manage roles for Agents, Telecallers, and Employees.
              </p>
            </div>
            <div className="text-xs font-bold text-blue-500 flex items-center space-x-1 pt-2">
              <span>Manage Accounts</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 3: Claims Queue */}
          <div 
            onClick={() => navigate('/dashboard/claims')}
            className="glass-panel rounded-3xl p-6 border border-slate-200/60 dark:border-white/10 hover:border-rose-500/50 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl group-hover:scale-110 transition-transform">
                <FaCheckCircle className="text-2xl" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full">
                UNDERWRITING
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white group-hover:text-rose-500 transition-colors">
                Claims Review
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Review and approve policy claims & payout requests.
              </p>
            </div>
            <div className="text-xs font-bold text-rose-500 flex items-center space-x-1 pt-2">
              <span>Review Claims</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 4: Console Settings */}
          <div 
            onClick={() => navigate('/dashboard/settings')}
            className="glass-panel rounded-3xl p-6 border border-slate-200/60 dark:border-white/10 hover:border-emerald-500/50 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform">
                <FaShieldAlt className="text-2xl" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                CONTENT & HR
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white group-hover:text-emerald-500 transition-colors">
                Console Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Post job openings & manage About Us awards gallery.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-500 flex items-center space-x-1 pt-2">
              <span>Configure Settings</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* System Diagnostics Strip & Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Security & System Health Card */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/60 dark:border-white/10 space-y-4">
            <h3 className="text-base font-bold text-navy-950 dark:text-white flex items-center space-x-2">
              <FaShieldAlt className="text-gold-500" />
              <span>System Health & Security</span>
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-navy-900 rounded-2xl flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Actuarial Database Cluster</span>
                <span className="font-bold text-emerald-500">🟢 Online (Primary)</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-navy-900 rounded-2xl flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Security Encryption</span>
                <span className="font-bold text-navy-950 dark:text-white">🔒 TLS 1.3 Active</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-navy-900 rounded-2xl flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Active Roles</span>
                <span className="font-bold text-gold-500">6 System Roles</span>
              </div>
            </div>
          </div>

          {/* Mini Activity Snapshot Feed */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200/60 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-950 dark:text-white flex items-center space-x-2">
                <FaHistory className="text-gold-500" />
                <span>Recent System Audit Snapshot</span>
              </h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/logs')}>
                View Full Logs
              </Button>
            </div>

            <div className="space-y-2">
              {logs.slice(0, 3).map(log => (
                <div 
                  key={log.id} 
                  className="p-3 bg-slate-50 dark:bg-navy-900 rounded-2xl flex items-center justify-between text-xs border border-slate-200/40 dark:border-white/5"
                >
                  <div className="flex items-center space-x-3">
                    <span className="p-2 bg-gold-500/10 text-gold-500 rounded-xl font-bold">
                      {log.id}
                    </span>
                    <div>
                      <p className="font-bold text-navy-950 dark:text-white">{log.action}</p>
                      <p className="text-[10px] text-slate-400">{log.user} • {log.ip}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-200/60 dark:bg-navy-950 px-2.5 py-1 rounded-full">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 1. SYSTEM DASHBOARD VIEW (ANALYTICS & CONSOLE HEALTH)
  if (tab === 'overview' || tab === 'analytics' || tab === 'dashboard') {
    return (
      <div className="space-y-6 text-left">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
              <FaServer className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Actuarial DB Clusters</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">Online (99.9%)</h3>
            </div>
          </div>

          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <FaUsers className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Registered Accounts</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">{platformUsers.length} Users</h3>
            </div>
          </div>

          <div className="glass-panel dark:glass-panel-gold rounded-2xl p-5 flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <FaHistory className="text-2xl" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Security Events Logged</p>
              <h3 className="text-2xl font-bold text-navy-950 dark:text-white mt-0.5">{logs.length} Audited</h3>
            </div>
          </div>
        </div>

        {/* SVG Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart: User Roles */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 space-y-3">
            <h3 className="text-xs font-bold text-navy-950 dark:text-white uppercase tracking-wider">User Registrations by Role</h3>
            <div className="h-36 w-full flex items-end justify-around pb-2 relative border-b border-slate-100 dark:border-white/5 pt-4">
              {/* Customer */}
              <div className="flex flex-col items-center w-12 group">
                <span className="text-[9px] font-bold text-gold-500 mb-1">12</span>
                <div className="w-6 bg-gradient-to-t from-gold-600 to-gold-400 rounded-t-md" style={{ height: '60px' }} />
                <span className="text-[9px] text-slate-400 font-semibold mt-1">Cust</span>
              </div>
              {/* Agent */}
              <div className="flex flex-col items-center w-12 group">
                <span className="text-[9px] font-bold text-gold-500 mb-1">8</span>
                <div className="w-6 bg-gradient-to-t from-gold-600 to-gold-400 rounded-t-md" style={{ height: '40px' }} />
                <span className="text-[9px] text-slate-400 font-semibold mt-1">Agent</span>
              </div>
              {/* Employee */}
              <div className="flex flex-col items-center w-12 group">
                <span className="text-[9px] font-bold text-gold-500 mb-1">4</span>
                <div className="w-6 bg-gradient-to-t from-gold-600 to-gold-400 rounded-t-md" style={{ height: '20px' }} />
                <span className="text-[9px] text-slate-400 font-semibold mt-1">Emp</span>
              </div>
              {/* Manager */}
              <div className="flex flex-col items-center w-12 group">
                <span className="text-[9px] font-bold text-gold-500 mb-1">2</span>
                <div className="w-6 bg-gradient-to-t from-gold-600 to-gold-400 rounded-t-md" style={{ height: '10px' }} />
                <span className="text-[9px] text-slate-400 font-semibold mt-1">Mgr</span>
              </div>
            </div>
          </div>

          {/* Donut Chart: Claims Underwriting */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 space-y-3">
            <h3 className="text-xs font-bold text-navy-950 dark:text-white uppercase tracking-wider">Claims Underwriting Outcomes</h3>
            <div className="flex items-center justify-around h-36">
              {/* SVG Donut */}
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background segment */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="transparent" strokeWidth="3" />
                  
                  {/* Approved segment (60%) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.2" 
                    strokeDasharray="60 40" strokeDashoffset="0" />
                  
                  {/* Pending segment (30%) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3.2" 
                    strokeDasharray="30 70" strokeDashoffset="-60" />
                  
                  {/* Rejected segment (10%) */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="3.2" 
                    strokeDasharray="10 90" strokeDashoffset="-90" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-navy-950 dark:text-white leading-none">100%</span>
                  <span className="text-[7px] text-slate-400 uppercase mt-0.5 font-bold">Resolved</span>
                </div>
              </div>

              {/* Legends list */}
              <div className="text-[10px] space-y-2 text-left font-bold">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" />
                  <span className="text-slate-400">Approved (60%)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 bg-amber-500 rounded-full inline-block" />
                  <span className="text-slate-400">In Progress (30%)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 bg-rose-500 rounded-full inline-block" />
                  <span className="text-slate-400">Rejected (10%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global systems health check status card */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 dark:border-white/5 space-y-4">
          <h3 className="text-base font-bold text-navy-950 dark:text-white">Platform Systems Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-navy-900 rounded-xl flex items-center justify-between border border-slate-200/50 dark:border-white/5">
              <span className="text-slate-400 font-medium">Actuarial DB API</span>
              <span className="font-bold text-emerald-500 flex items-center"><FaCheckCircle className="mr-1" /> Active</span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-navy-900 rounded-xl flex items-center justify-between border border-slate-200/50 dark:border-white/5">
              <span className="text-slate-400 font-medium">Claims Validator Engine</span>
              <span className="font-bold text-emerald-500 flex items-center"><FaCheckCircle className="mr-1" /> Active</span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-navy-900 rounded-xl flex items-center justify-between border border-slate-200/50 dark:border-white/5">
              <span className="text-slate-400 font-medium">Email Dispatch SMTP</span>
              <span className="font-bold text-emerald-500 flex items-center"><FaCheckCircle className="mr-1" /> Active</span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-navy-900 rounded-xl flex items-center justify-between border border-slate-200/50 dark:border-white/5">
              <span className="text-slate-400 font-medium">Payment Treasury Gateway</span>
              <span className="font-bold text-emerald-500 flex items-center"><FaCheckCircle className="mr-1" /> Active</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 1.5 PLANS MANAGER TAB (FULL DATABASE CONTROL FOR ADMIN)
  if (tab === 'plans-manager' || tab === 'plans') {
    const filteredPlansList = plansDb
      .filter(p =>
        (p.name || '').toLowerCase().includes(planSearch.toLowerCase()) ||
        (p.company || '').toLowerCase().includes(planSearch.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(planSearch.toLowerCase())
      )
      .sort((a, b) => {
        const orderA = a.displayOrder !== undefined ? parseInt(a.displayOrder) : 999;
        const orderB = b.displayOrder !== undefined ? parseInt(b.displayOrder) : 999;
        return orderA - orderB;
      });

    return (
      <div className="space-y-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-navy-950 dark:text-white font-sans">Insurance Plans Database Control</h2>
            <p className="text-xs text-slate-400 mt-1">Full Admin control to add, edit, or delete insurance policies across all 16 partner companies.</p>
          </div>
          <div className="flex items-center space-x-3">
            <SearchBar value={planSearch} onChange={setPlanSearch} placeholder="Search plans database..." />
            <Button variant="gold" onClick={() => setShowAddPlanModal(true)}>
              <FaPlus className="mr-1.5" /> Add New Policy Plan
            </Button>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-semibold">
            {successMsg}
          </div>
        )}

        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
            <h3 className="text-sm font-bold text-navy-950 dark:text-white">Active Policy Catalog ({filteredPlansList.length})</h3>
            <span className="text-[10px] text-slate-400 font-semibold">Changes sync instantly to /plans</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlansList.map((plan) => (
              <div key={plan.id} className="p-5 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f97316] bg-[#f97316]/10 px-2.5 py-0.5 rounded border border-[#f97316]/20">
                      {plan.categoryTag || plan.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {plan.company || 'SBI Life Insurance'}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-navy-950 dark:text-white text-base mt-2">{plan.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{plan.description}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Coverage</p>
                      <p className="font-extrabold text-navy-950 dark:text-white">{plan.coverageAmount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Premium</p>
                      <p className="font-extrabold text-[#f97316]">{plan.premiumStartsFrom}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleOpenEditPlanModal(plan)}
                    className="px-3 py-1.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <FaEdit />
                    <span>Edit Plan</span>
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Plan Modal */}
        <Modal
          isOpen={showAddPlanModal}
          onClose={() => setShowAddPlanModal(false)}
          title="Add New Insurance Policy Plan"
          size="md"
        >
          <form onSubmit={handleAddPlanSubmit} className="space-y-4 text-xs text-left">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plan Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Smart Future Protect"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Insurance Company *</label>
                <select
                  value={newPlanCompany}
                  onChange={(e) => setNewPlanCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="SBI Life Insurance">SBI Life Insurance</option>
                  <option value="Postal Office">Postal Office</option>
                  <option value="Future Generali">Future Generali</option>
                  <option value="Bajaj Allianz">Bajaj Allianz</option>
                  <option value="Aditya Birla Sun Life">Aditya Birla Sun Life</option>
                  <option value="Oriental Insurance">Oriental Insurance</option>
                  <option value="Tata AIA Life">Tata AIA Life</option>
                  <option value="ICICI Prudential / Lombard">ICICI Prudential / Lombard</option>
                  <option value="HDFC Life">HDFC Life</option>
                  <option value="Niva Bupa Health">Niva Bupa Health</option>
                  <option value="Allianz Care">Allianz Care</option>
                  <option value="Kotak Mahindra Life">Kotak Mahindra Life</option>
                  <option value="PNB MetLife">PNB MetLife</option>
                  <option value="ManipalCigna Health">ManipalCigna Health</option>
                  <option value="Star Health Insurance">Star Health Insurance</option>
                  <option value="Max Life / Axis">Max Life / Axis</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category *</label>
                <select
                  value={newPlanCategory}
                  onChange={(e) => setNewPlanCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="Child Plan">Child Plan</option>
                  <option value="ULIP">ULIP</option>
                  <option value="Term Insurance">Term Insurance</option>
                  <option value="Savings Plan">Savings Plan</option>
                  <option value="Pension Plan">Pension Plan</option>
                  <option value="Health">Health</option>
                  <option value="Motor">Motor</option>
                  <option value="Home">Home</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sum Assured / Coverage</label>
                <input
                  type="text"
                  placeholder="e.g. ₹10,00,000"
                  value={newPlanCoverage}
                  onChange={(e) => setNewPlanCoverage(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Starting Premium</label>
                <input
                  type="text"
                  placeholder="e.g. ₹950/month*"
                  value={newPlanPremium}
                  onChange={(e) => setNewPlanPremium(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Featured Badge / Ribbon Tag (e.g. POPULAR, Return of Premium, Family Refill)</label>
              <input
                type="text"
                placeholder="e.g. POPULAR"
                value={newPlanBadge}
                onChange={(e) => setNewPlanBadge(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plan Description *</label>
              <textarea
                required
                rows="2"
                placeholder="Describe plan features, benefits, and target policyholders..."
                value={newPlanDescription}
                onChange={(e) => setNewPlanDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Included Features (One per line) *</label>
              <textarea
                required
                rows="3"
                placeholder="e.g. Cashless hospitalisation&#10;Tax savings benefit&#10;Flexible payout options"
                value={newPlanFeatures}
                onChange={(e) => setNewPlanFeatures(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200/50 dark:border-white/5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Display Order</label>
                <input
                  type="number"
                  placeholder="e.g. 1"
                  value={newPlanDisplayOrder}
                  onChange={(e) => setNewPlanDisplayOrder(e.target.value)}
                  className="w-full px-2 py-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white focus:outline-none"
                />
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <input
                  type="checkbox"
                  id="newPlanIsVisible"
                  checked={newPlanIsVisible}
                  onChange={(e) => setNewPlanIsVisible(e.target.checked)}
                  className="rounded text-gold-500 focus:ring-gold-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="newPlanIsVisible" className="text-[10px] font-bold text-slate-500 uppercase cursor-pointer select-none">Visible on Plans</label>
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <input
                  type="checkbox"
                  id="newPlanShowOnHome"
                  checked={newPlanShowOnHome}
                  onChange={(e) => setNewPlanShowOnHome(e.target.checked)}
                  className="rounded text-gold-500 focus:ring-gold-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="newPlanShowOnHome" className="text-[10px] font-bold text-slate-500 uppercase cursor-pointer select-none">Show on Home</label>
              </div>
            </div>

            <div className="pt-2 flex space-x-2">
              <Button type="submit" variant="gold" className="flex-1 py-2 font-bold">
                Publish New Policy
              </Button>
              <Button variant="outline" type="button" className="py-2" onClick={() => setShowAddPlanModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Edit Plan Modal */}
        <Modal
          isOpen={!!editingPlan}
          onClose={() => setEditingPlan(null)}
          title={editingPlan ? `Edit Policy: ${editingPlan.name}` : 'Edit Plan'}
          size="md"
        >
          {editingPlan && (
            <form onSubmit={handleSaveEditedPlan} className="space-y-4 text-xs text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  value={editPlanName}
                  onChange={(e) => setEditPlanName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Insurance Company</label>
                  <input
                    type="text"
                    value={editPlanCompany}
                    onChange={(e) => setEditPlanCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={editPlanCategory}
                    onChange={(e) => setEditPlanCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sum Assured / Coverage</label>
                  <input
                    type="text"
                    value={editPlanCoverage}
                    onChange={(e) => setEditPlanCoverage(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Starting Premium</label>
                  <input
                    type="text"
                    value={editPlanPremium}
                    onChange={(e) => setEditPlanPremium(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Featured Badge / Ribbon Tag (e.g. POPULAR, Return of Premium, Family Refill)</label>
                <input
                  type="text"
                  placeholder="e.g. POPULAR"
                  value={editPlanBadge}
                  onChange={(e) => setEditPlanBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plan Description *</label>
                <textarea
                  required
                  rows="2"
                  value={editPlanDescription}
                  onChange={(e) => setEditPlanDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Included Features (One per line) *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="e.g. Cashless hospitalisation&#10;Tax savings benefit&#10;Flexible payout options"
                  value={editPlanFeatures}
                  onChange={(e) => setEditPlanFeatures(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200/50 dark:border-white/5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Display Order</label>
                  <input
                    type="number"
                    placeholder="e.g. 1"
                    value={editPlanDisplayOrder}
                    onChange={(e) => setEditPlanDisplayOrder(e.target.value)}
                    className="w-full px-2 py-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-4">
                  <input
                    type="checkbox"
                    id="editPlanIsVisible"
                    checked={editPlanIsVisible}
                    onChange={(e) => setEditPlanIsVisible(e.target.checked)}
                    className="rounded text-gold-500 focus:ring-gold-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="editPlanIsVisible" className="text-[10px] font-bold text-slate-500 uppercase cursor-pointer select-none">Visible on Plans</label>
                </div>
                <div className="flex items-center space-x-2 pt-4">
                  <input
                    type="checkbox"
                    id="editPlanShowOnHome"
                    checked={editPlanShowOnHome}
                    onChange={(e) => setEditPlanShowOnHome(e.target.checked)}
                    className="rounded text-gold-500 focus:ring-gold-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="editPlanShowOnHome" className="text-[10px] font-bold text-slate-500 uppercase cursor-pointer select-none">Show on Home</label>
                </div>
              </div>

              <div className="pt-2 flex space-x-2">
                <Button type="submit" variant="gold" className="flex-1 py-2 font-bold">
                  Save Policy Changes
                </Button>
                <Button variant="outline" type="button" className="py-2" onClick={() => setEditingPlan(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    );
  }

  // 2. USERS MANAGEMENT TAB
  if (tab === 'users') {
    return (
      <div className="space-y-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-navy-950 dark:text-white font-sans">Platform Users Register</h2>
            <p className="text-xs text-slate-400 mt-1">Create, view, and manage roles for platform accounts.</p>
          </div>
          <div className="flex items-center space-x-3">
            <SearchBar value={userSearch} onChange={setUserSearch} placeholder="Search user accounts..." />
            <Button variant="gold" onClick={() => setShowAddUserForm(!showAddUserForm)}>
              <FaPlus className="mr-1.5" /> Create Account
            </Button>
          </div>
        </div>

        {showAddUserForm && (
          <form onSubmit={handleCreateUser} className="p-5 bg-white dark:bg-navy-900 border border-slate-200/50 dark:border-white/5 rounded-3xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Legal Name</label>
              <input 
                type="text" 
                required 
                placeholder="Your Name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="Enter Email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assigned Role</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-gold-500"
              >
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
                <option value="telecaller">Telecaller</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button type="submit" variant="gold" className="flex-1 py-2 font-bold">
                Add User
              </Button>
              <Button variant="outline" className="py-2" onClick={() => setShowAddUserForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          {filteredUsers.length === 0 ? (
            <EmptyState title="No Users Found" description="Try editing search terms." />
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="w-full">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-200/50 dark:border-white/5 pb-2 text-left font-bold">
                    <th className="py-2.5">User ID</th>
                    <th>Full Legal Name</th>
                    <th>Email Address</th>
                    <th>Assigned Role</th>
                    <th>Access Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-900/10">
                      <td className="py-3 font-semibold text-navy-950 dark:text-white">{u.id}</td>
                      <td>
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-500/40 bg-white dark:bg-navy-950 flex items-center justify-center shrink-0">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-bold text-[10px] text-amber-600 dark:text-amber-400">
                                {u.name ? u.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'US'}
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-navy-950 dark:text-white">{u.name}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td><span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-900 font-bold border border-slate-200/50 dark:border-white/5">{u.role}</span></td>
                      <td>
                        <span className={u.active !== false ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                          {u.active !== false ? '🟢 Active' : '🔴 Suspended'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenEditUserModal(u)}
                            title="Edit User Details & Profile Photo"
                            className="p-1.5 hover:text-amber-500 hover:bg-amber-500/10 rounded transition-all cursor-pointer text-slate-400"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            title="Delete Account"
                            className="p-1.5 hover:text-red-500 hover:bg-red-500/10 rounded transition-all cursor-pointer text-slate-400"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. AUDIT LOGS TAB
  if (tab === 'logs') {
    return (
      <div className="space-y-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-navy-950 dark:text-white font-sans">Audit Logs Ledger</h2>
          <SearchBar value={systemLogsSearch} onChange={setSystemLogsSearch} placeholder="Filter audit logs..." />
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          {filteredLogs.length === 0 ? (
            <EmptyState title="No Logs Match Search" description="Refine your logs query terms." />
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="w-full">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-200/50 dark:border-white/5 pb-2 text-left font-bold">
                    <th className="py-2.5">Audit Timestamp</th>
                    <th>Platform Operator</th>
                    <th>Trigger Action</th>
                    <th>Result Status</th>
                    <th>Origin IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-navy-900/10">
                      <td className="py-3 font-semibold text-slate-400">{log.timestamp.replace('T', ' ')}</td>
                      <td className="font-bold">{log.user}</td>
                      <td>{log.action}</td>
                      <td><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">{log.status}</span></td>
                      <td className="text-slate-400">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3.5 CLAIMS UNDERWRITING REVIEW QUEUE
  if (tab === 'claims') {
    return (
      <div className="space-y-6 text-left">
        <div>
          <h2 className="text-xl font-bold text-navy-950 dark:text-white font-sans">Underwriting Claims Queue</h2>
          <p className="text-xs text-slate-400 mt-1">Review active customer claims, perform risk validation, and update approval statuses.</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          <div className="overflow-x-auto text-xs">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 border-b border-slate-200/50 dark:border-white/5 pb-2 text-left font-bold">
                  <th className="py-2.5">Claim ID</th>
                  <th>Customer/Client</th>
                  <th>Policy Plan Type</th>
                  <th>Claim Value</th>
                  <th>Date Logged</th>
                  <th>Underwriting Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-900/10">
                    <td className="py-3 font-semibold text-navy-950 dark:text-gold-400">{claim.id}</td>
                    <td className="font-bold">{claim.client}</td>
                    <td>{claim.type}</td>
                    <td className="font-semibold text-slate-600 dark:text-slate-200">{claim.amount}</td>
                    <td className="text-slate-400">{claim.date}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        claim.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : claim.status === 'Rejected'
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-2">
                      {claim.status === 'Pending' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateClaimStatus(claim.id, 'Approved')}
                            className="px-2.5 py-1 bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all font-bold cursor-pointer text-[10px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateClaimStatus(claim.id, 'Rejected')}
                            className="px-2.5 py-1 bg-red-500/15 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all font-bold cursor-pointer text-[10px]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[10px]">Processed</span>
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

  // 3.8 CAREERS PAGE & JOB OPENINGS MANAGER TAB
  if (tab === 'careers') {
    return (
      <div className="space-y-6 text-left">
        <div>
          <h2 className="text-xl font-bold text-navy-950 dark:text-white flex items-center space-x-2">
            <FaBriefcase className="text-gold-500" />
            <span>Careers Page & Job Openings Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Publish, update, or remove job opportunities listed live on the public Careers page.</p>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-semibold">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Job Form */}
          <div className="lg:col-span-1 glass-panel rounded-3xl p-5 border border-slate-200/40 dark:border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-navy-950 dark:text-white">Post New Job Opening</h4>
            <form onSubmit={handleAddJob} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Job Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Senior Financial Advisor" 
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Department *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Agency Force / Underwriting" 
                  value={newJobDepartment}
                  onChange={(e) => setNewJobDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Kanchipuram HQ" 
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Type</label>
                  <select 
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Commission-based">Commission-based</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Job Description *</label>
                <textarea 
                  required
                  placeholder="Describe key responsibilities and requirements..." 
                  value={newJobDescription}
                  onChange={(e) => setNewJobDescription(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <Button type="submit" variant="gold" className="w-full py-2.5 font-bold mt-2">
                Publish Job Opportunity
              </Button>
            </form>
          </div>

          {/* Current Openings List */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-5 border border-slate-200/40 dark:border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-navy-950 dark:text-white">Active Job Opportunities ({careersList.length})</h4>
              <span className="text-[10px] text-slate-400 font-semibold">Updates live on /careers</span>
            </div>

            {careersList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No active job opportunities. Publish one above to list it on the Careers page.</p>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {careersList.map((job) => (
                  <div key={job.id} className="p-4 bg-slate-50 dark:bg-navy-900 rounded-2xl border border-slate-200/40 dark:border-white/5 flex items-start justify-between space-x-3 text-xs">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gold-500 bg-gold-500/10 px-2 py-0.5 rounded">
                          {job.department}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                          <FaClock className="text-[9px]" />
                          <span>{job.type}</span>
                        </span>
                      </div>
                      <h5 className="font-bold text-navy-950 dark:text-white text-sm">{job.title}</h5>
                      <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <FaMapMarkerAlt />
                        <span>{job.location}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 pt-1">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button 
                        onClick={() => handleOpenEditJobModal(job)}
                        className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-xl cursor-pointer"
                        title="Edit Job Opportunity"
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button 
                        onClick={() => handleRemoveJob(job.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl cursor-pointer"
                        title="Remove Job Posting"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 4. GALLERY MANAGER TAB (SETTINGS)
  if (tab === 'settings') {
    return (
      <div className="space-y-6 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-navy-950 dark:text-white">About Us Gallery & System Settings</h2>
            <p className="text-xs text-slate-400 mt-1">Manage award certificate photos displayed on the About Us page (Upload up to 25 photos) and configure access matrix.</p>
          </div>
          <span className="px-3 py-1.5 text-xs font-bold bg-gold-500/10 text-gold-500 rounded-full border border-gold-500/20">
            {awardsList.length} / 25 Photos Uploaded
          </span>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-semibold">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Photo Form */}
          <div className="lg:col-span-1 glass-panel rounded-3xl p-5 border border-slate-200/40 dark:border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-navy-950 dark:text-white">Add New Photo / Award</h3>
            <form onSubmit={handleAddPhoto} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Award / Photo Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. MDRT Excellence Award" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tag / Category Badge</label>
                <input 
                  type="text" 
                  placeholder="e.g. CERTIFIED EXCELLENCE" 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description *</label>
                <textarea 
                  required
                  placeholder="Describe this milestone or award..." 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Upload Photo From Computer</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full px-2 py-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white text-xs file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gold-500/10 file:text-gold-500 cursor-pointer"
                />
              </div>

              <div className="relative my-2 text-center text-[10px] text-slate-400 font-bold">OR CUSTOM URL / PRESET</div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Preset Image</label>
                <select 
                  value={newImg}
                  onChange={(e) => {
                    setNewImg(e.target.value);
                    setCustomImgUrl('');
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="/IMG-20260714-WA0061.jpg">Milestone Image 1</option>
                  <option value="/IMG-20260714-WA0062.jpg">Milestone Image 2</option>
                  <option value="/IMG-20260714-WA0063.jpg">Milestone Image 3</option>
                  <option value="/IMG-20260714-WA0064.jpg">Milestone Image 4</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Custom Image URL</label>
                <input 
                  type="text" 
                  placeholder="e.g. https://... or /photo.jpg" 
                  value={customImgUrl}
                  onChange={(e) => setCustomImgUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <Button 
                type="submit" 
                variant="gold" 
                disabled={awardsList.length >= 25}
                className="w-full py-2 font-bold mt-2 disabled:opacity-50"
              >
                {awardsList.length >= 25 ? 'Limit Reached (25/25)' : 'Add Photo to Gallery'}
              </Button>
            </form>
          </div>

          {/* Current Gallery List */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-5 border border-slate-200/40 dark:border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-navy-950 dark:text-white">Current Gallery Items ({awardsList.length})</h3>
            {awardsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No photos in gallery. Add one to display on the About Us page.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[440px] overflow-y-auto pr-1">
                {awardsList.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-navy-900 rounded-2xl flex items-center space-x-3 border border-slate-200/40 dark:border-white/5 relative group">
                    <img src={item.img} className="w-16 h-16 object-cover rounded-xl border border-slate-200/50 dark:border-white/5" alt={item.title} />
                    <div className="flex-1 min-w-0 text-xs text-left">
                      <p className="font-bold text-navy-950 dark:text-white truncate">{item.title}</p>
                      <p className="text-[9px] font-extrabold uppercase text-gold-500 tracking-wider truncate">{item.tag || 'CERTIFIED'}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleRemovePhoto(idx)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl cursor-pointer"
                      title="Remove Photo"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Careers Page Content Customizer */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-navy-950 dark:text-white flex items-center space-x-2">
                <FaBriefcase className="text-gold-500" />
                <span>Careers Page Header & HR Application Settings</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Customize public Careers page title, hero subtitle, and HR application contact details.</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard/careers')} 
              className="px-3 py-1.5 text-xs font-bold bg-gold-500/10 text-gold-500 hover:bg-gold-500/20 rounded-xl border border-gold-500/20 flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Manage Job Openings</span>
              <FaChevronRight className="text-[10px]" />
            </button>
          </div>

          <form onSubmit={handleSaveCareersSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Badge Tag *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Join Our Team" 
                  value={careersSettings.badge}
                  onChange={(e) => setCareersSettings({ ...careersSettings, badge: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">HR Application Email *</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. careers@skinsurance.com" 
                  value={careersSettings.hrEmail}
                  onChange={(e) => setCareersSettings({ ...careersSettings, hrEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Main Page Headline *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Build the Future of InsurTech" 
                value={careersSettings.title}
                onChange={(e) => setCareersSettings({ ...careersSettings, title: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hero Subtitle / Description *</label>
              <textarea 
                required
                rows="2"
                placeholder="Describe your company culture and mission..." 
                value={careersSettings.subtitle}
                onChange={(e) => setCareersSettings({ ...careersSettings, subtitle: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <Button type="submit" variant="gold" className="py-2 px-5 font-bold">
              Save Careers Page Settings
            </Button>
          </form>
        </div>

        {/* Roles Permission Authorization Matrix */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200/40 dark:border-white/5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-navy-950 dark:text-white font-sans">Role-Based Access Matrix</h3>
            <p className="text-xs text-slate-400 mt-0.5">Configure feature authorization policies across customer and staff roles.</p>
          </div>

          <div className="overflow-x-auto text-xs text-left">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 border-b border-slate-200/50 dark:border-white/5 pb-2 text-left font-bold">
                  <th className="py-2.5">Platform Operation</th>
                  <th className="text-center">Admin</th>
                  <th className="text-center">Manager</th>
                  <th className="text-center">Employee</th>
                  <th className="text-center">Agent</th>
                  <th className="text-center">Customer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {Object.keys(permsMatrix).map((op) => (
                  <tr key={op} className="hover:bg-slate-50/50 dark:hover:bg-navy-900/10">
                    <td className="py-3 font-semibold text-navy-950 dark:text-white">{op}</td>
                    {['Admin', 'Manager', 'Employee', 'Agent', 'Customer'].map((role) => (
                      <td key={role} className="text-center">
                        <input 
                          type="checkbox"
                          checked={permsMatrix[op].includes(role)}
                          onChange={() => handleTogglePerm(op, role)}
                          className="w-4 h-4 rounded border-slate-300 text-gold-500 focus:ring-gold-500 cursor-pointer accent-gold-500"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 text-left">
        {/* Executive Welcome & Health Header Banner */}
        <div className="glass-panel dark:glass-panel-gold rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-white/10 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 z-10 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>🟢 Live Operational Status: 99.9% Uptime</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 dark:text-white tracking-tight">
              Welcome back, {user?.name || 'System Administrator'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              SK Smart Executive Control Center is online. Quick access tools and diagnostic features are active.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            <Button variant="gold" size="sm" onClick={() => navigate('/dashboard/plans-manager')}>
              📂 Manage Policy Plans
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/overview')}>
              📊 Open Analytics
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/users')}>
              👥 Provision Users
            </Button>
          </div>
        </div>

        {/* Quick Launch Command Hub Grid (5 Main Features) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 0: Plans Manager */}
          <div 
            onClick={() => navigate('/dashboard/plans-manager')}
            className="glass-panel rounded-3xl p-5 border border-slate-200/60 dark:border-white/10 hover:border-gold-500/50 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-gold-500/10 text-gold-500 rounded-2xl group-hover:scale-110 transition-transform">
                <FaBriefcase className="text-xl" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-gold-500 bg-gold-500/10 px-2 py-0.5 rounded-full">
                DATABASE
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-950 dark:text-white group-hover:text-gold-500 transition-colors">
                Plans Database
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Add, edit, or delete policy plans across 16 companies.
              </p>
            </div>
            <div className="text-[11px] font-bold text-gold-500 flex items-center space-x-1 pt-1">
              <span>Control Database</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 1: System Analytics */}
          <div 
            onClick={() => navigate('/dashboard/overview')}
            className="glass-panel rounded-3xl p-6 border border-slate-200/60 dark:border-white/10 hover:border-gold-500/50 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl group-hover:scale-110 transition-transform">
                <FaServer className="text-2xl" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                ANALYTICS
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white group-hover:text-gold-500 transition-colors">
                System Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                DB Clusters, user signups, and underwriting statistics.
              </p>
            </div>
            <div className="text-xs font-bold text-gold-500 flex items-center space-x-1 pt-2">
              <span>View Dashboard</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2: Account Management */}
          <div 
            onClick={() => navigate('/dashboard/users')}
            className="glass-panel rounded-3xl p-6 border border-slate-200/60 dark:border-white/10 hover:border-blue-500/50 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
                <FaUsers className="text-2xl" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full">
                {platformUsers.length} USERS
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white group-hover:text-blue-500 transition-colors">
                User Accounts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Manage roles for Agents, Telecallers, and Employees.
              </p>
            </div>
            <div className="text-xs font-bold text-blue-500 flex items-center space-x-1 pt-2">
              <span>Manage Accounts</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 3: Claims Queue */}
          <div 
            onClick={() => navigate('/dashboard/claims')}
            className="glass-panel rounded-3xl p-6 border border-slate-200/60 dark:border-white/10 hover:border-rose-500/50 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl group-hover:scale-110 transition-transform">
                <FaCheckCircle className="text-2xl" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full">
                UNDERWRITING
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white group-hover:text-rose-500 transition-colors">
                Claims Review
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Review and approve policy claims & payout requests.
              </p>
            </div>
            <div className="text-xs font-bold text-rose-500 flex items-center space-x-1 pt-2">
              <span>Review Claims</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 4: Console Settings */}
          <div 
            onClick={() => navigate('/dashboard/settings')}
            className="glass-panel rounded-3xl p-6 border border-slate-200/60 dark:border-white/10 hover:border-emerald-500/50 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform">
                <FaShieldAlt className="text-2xl" />
              </div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                CONTENT & HR
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white group-hover:text-emerald-500 transition-colors">
                Console Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Post job openings & manage About Us awards gallery.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-500 flex items-center space-x-1 pt-2">
              <span>Configure Settings</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
  );

      {/* Edit User Account Details & Profile Photo Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title={editingUser ? `Edit User Account: ${editingUser.id}` : 'Edit User Details'}
        size="md"
      >
        {editingUser && (
          <form onSubmit={handleSaveEditedUser} className="space-y-4 text-xs text-left">
            {/* Profile Avatar Upload Section */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-navy-950 rounded-2xl border border-slate-200/50 dark:border-white/5 space-y-3">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gold-500 shadow-md bg-white flex items-center justify-center">
                {editAvatar ? (
                  <img src={editAvatar} alt={editName} className="w-full h-full object-cover" />
                ) : (
                  <FaUserCircle className="text-5xl text-slate-300 dark:text-slate-600" />
                )}
              </div>

              <div className="flex flex-col items-center space-y-1.5 w-full">
                <label className="text-[10px] font-extrabold uppercase text-gold-500 tracking-wider flex items-center space-x-1">
                  <FaCamera className="mr-1" />
                  <span>Upload Profile Photo</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditUserPhotoUpload}
                  className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-gold-500/10 file:text-gold-500 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="Or enter Image URL (e.g. https://...)"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white text-xs focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* Name & Email Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* Role & Status Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Platform Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="customer">Customer</option>
                  <option value="agent">Agent</option>
                  <option value="telecaller">Telecaller</option>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Account Access Status</label>
                <select
                  value={editActive ? 'active' : 'suspended'}
                  onChange={(e) => setEditActive(e.target.value === 'active')}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="active">Active (Granted)</option>
                  <option value="suspended">Suspended (Restricted)</option>
                </select>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="pt-3 flex space-x-2">
              <Button type="submit" variant="gold" className="flex-1 py-2 font-bold">
                Save Account Changes
              </Button>
              <Button variant="outline" type="button" className="py-2" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>
      {/* Edit Job Opportunity Modal */}
      <Modal
        isOpen={!!editingJob}
        onClose={() => setEditingJob(null)}
        title={editingJob ? `Edit Position: ${editingJob.title}` : 'Edit Job Opportunity'}
        size="md"
      >
        {editingJob && (
          <form onSubmit={handleSaveEditedJob} className="space-y-4 text-xs text-left">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Job Title *</label>
              <input 
                type="text" 
                required
                value={editJobTitle}
                onChange={(e) => setEditJobTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Department *</label>
              <input 
                type="text" 
                required
                value={editJobDepartment}
                onChange={(e) => setEditJobDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Location</label>
                <input 
                  type="text" 
                  value={editJobLocation}
                  onChange={(e) => setEditJobLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Employment Type</label>
                <select 
                  value={editJobType}
                  onChange={(e) => setEditJobType(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Commission-based">Commission-based</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Job Description *</label>
              <textarea 
                required
                rows="4"
                value={editJobDescription}
                onChange={(e) => setEditJobDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-xl text-navy-950 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="pt-3 flex space-x-2">
              <Button type="submit" variant="gold" className="flex-1 py-2 font-bold">
                Save Position Changes
              </Button>
              <Button variant="outline" type="button" className="py-2" onClick={() => setEditingJob(null)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};
export default AdminDashboard;
