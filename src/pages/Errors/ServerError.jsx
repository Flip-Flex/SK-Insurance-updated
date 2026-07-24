import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { FaServer } from 'react-icons/fa';

export const ServerError = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="p-5 rounded-full bg-red-500/10 text-red-500 text-5xl animate-bounce">
        <FaServer />
      </div>
      <h1 className="text-4xl font-extrabold text-navy-950 dark:text-white">500 - Server Error</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        A system exception occurred during the actuarial verification task. Please reload or contact platform administration.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => window.location.reload()}>Reload Page</Button>
        <Button variant="gold" onClick={() => navigate('/')}>Return Home</Button>
      </div>
    </div>
  );
};
export default ServerError;
