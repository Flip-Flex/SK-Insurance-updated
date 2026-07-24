import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CAREERS } from '../../services/mockData';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaCheckCircle, FaInbox } from 'react-icons/fa';
import { subscribeToCollection } from '../../services/firebaseService';
import { db } from '../../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [successApply, setSuccessApply] = useState(false);

  const [pageSettings, setPageSettings] = useState({
    badge: 'Join Our Team',
    title: 'Build the Future of InsurTech',
    subtitle: 'We are looking for creative thinkers, diligent risk assessors, and talented engineers to shape digital protection products globally.',
    hrEmail: 'careers@skinsurance.com'
  });

  const [jobs, setJobs] = useState(CAREERS);

  useEffect(() => {
    // 1. Subscribe to careers list
    const unsubscribeJobs = subscribeToCollection('careers', (data) => {
      if (data && data.length > 0) setJobs(data);
    });

    // 2. Subscribe to page header settings
    let unsubscribeSettings = () => {};
    try {
      const docRef = doc(db, 'settings', 'careers_page');
      unsubscribeSettings = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setPageSettings(docSnap.data());
        }
      });
    } catch (e) {
      console.error("Error setting up careers settings listener", e);
    }

    return () => {
      unsubscribeJobs();
      unsubscribeSettings();
    };
  }, []);

  const handleApply = (job) => {
    setSelectedJob(job);
    setSuccessApply(false);
    setShowApplyModal(true);
  };

  const handleMockSubmit = (e) => {
    e.preventDefault();
    setSuccessApply(true);
    setTimeout(() => {
      setShowApplyModal(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="text-center mb-12">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-500 bg-gold-500/10 rounded-full">
          {pageSettings.badge || 'Join Our Team'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-950 dark:text-white mt-2">
          {pageSettings.title || 'Build the Future of InsurTech'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto text-sm">
          {pageSettings.subtitle || 'We are looking for creative thinkers, diligent risk assessors, and talented engineers to shape digital protection products globally.'}
        </p>
      </div>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <div className="text-center py-12 p-8 bg-white dark:bg-navy-900 rounded-3xl border border-slate-200/50 dark:border-white/5 space-y-3">
          <FaInbox className="text-4xl text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-950 dark:text-white">No Open Positions Currently</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Check back later for new career opportunities or contact our HR team directly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="glass-panel dark:glass-panel-gold rounded-3xl p-6 flex flex-col justify-between border border-slate-200/40 dark:border-white/5 group hover:shadow-xl transition-all"
            >
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-500 bg-gold-500/10 px-2 py-0.5 rounded">
                  {job.department}
                </span>
                <h3 className="text-lg font-bold text-navy-950 dark:text-white group-hover:text-gold-500 transition-colors">
                  {job.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <FaMapMarkerAlt />
                    <span>{job.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaClock />
                    <span>{job.type}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
                  {job.description}
                </p>
              </div>

              <div className="pt-6">
                <Button
                  variant="gold"
                  className="w-full"
                  onClick={() => handleApply(job)}
                >
                  Apply Online
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title={selectedJob ? `Application: ${selectedJob.title}` : ''}
        size="md"
      >
        {successApply ? (
          <div className="text-center py-6 space-y-3">
            <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 text-3xl mb-2 animate-bounce">
              <FaCheckCircle />
            </div>
            <h3 className="text-lg font-bold text-navy-950 dark:text-white">Application Logged!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your mock resume has been uploaded. An administrator has been notified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleMockSubmit} className="space-y-4 pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please submit your details below. The candidate review panel typically responds within 3 business days.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                <input required type="text" placeholder="Your Name" className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                <input required type="email" placeholder="Enter Email" className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Resume File Upload (PDF)</label>
              <div className="p-4 border border-dashed border-slate-300 dark:border-white/10 rounded-lg text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-900">
                <span className="text-[10px] text-slate-400">Drag or click to upload PDF resume file</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cover Note / Remarks</label>
              <textarea placeholder="Tell us why you are a fit for SK Smart Investments..." rows="3" className="w-full px-3 py-2 text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-lg text-navy-950 dark:text-white focus:outline-none focus:border-gold-400"></textarea>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowApplyModal(false)}>Cancel</Button>
              <Button type="submit" variant="gold">Submit Resume</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
export default Careers;
