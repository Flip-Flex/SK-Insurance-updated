import React, { Component } from 'react';
import { FaShieldAlt } from 'react-icons/fa';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Auto-reload on dynamic import chunk loading failures (common after a new deployment)
    if (error && error.message && error.message.includes('Failed to fetch dynamically imported module')) {
      const hasReloaded = sessionStorage.getItem('chunk_error_reloaded');
      if (!hasReloaded) {
        sessionStorage.setItem('chunk_error_reloaded', 'true');
        window.location.reload();
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-navy-950 px-4 py-12 text-center">
          <div className="max-w-md w-full bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-white/10 p-8 rounded-3xl shadow-xl space-y-6">
            <div className="inline-flex p-4 rounded-full bg-rose-500/10 text-rose-500 text-4xl">
              <FaShieldAlt />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-navy-950 dark:text-white">
                Something went wrong
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                An unexpected system exception occurred. We have logged the error details. Please retry or contact technical support.
              </p>
            </div>
            {this.state.error && (
              <div className="p-3 bg-slate-50 dark:bg-navy-950/50 rounded-xl border border-slate-100 dark:border-white/5 text-[10px] text-rose-500 font-mono text-left max-h-24 overflow-y-auto whitespace-pre-wrap">
                {this.state.error.toString()}
              </div>
            )}
            <div className="flex justify-center">
              <button 
                onClick={this.handleReset} 
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Reload Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
