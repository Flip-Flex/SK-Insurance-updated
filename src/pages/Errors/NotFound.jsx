import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { FaExclamationTriangle } from 'react-icons/fa';

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="p-5 rounded-full bg-gold-500/10 text-gold-500 text-5xl animate-pulse">
        <FaExclamationTriangle />
      </div>
      <h1 className="text-4xl font-extrabold text-navy-950 dark:text-white">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        The coverage details or platform dashboard page you are trying to access does not exist or has been relocated.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
        <Button variant="gold" onClick={() => navigate('/')}>Home Portal</Button>
      </div>
    </div>
  );
};
export default NotFound;
