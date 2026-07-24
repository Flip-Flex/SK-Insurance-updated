import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

// Public pages
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Plans } from '../pages/Plans';
import { Calculator } from '../pages/Calculator';
import { Careers } from '../pages/Careers';
import { Support } from '../pages/Support';
import { Blog } from '../pages/Blog';
import { Auth } from '../pages/Auth';
import { Dashboard } from '../pages/Dashboard';
import { NotFound } from '../pages/Errors/NotFound';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { PrivacyPolicy } from '../pages/PrivacyPolicy';
import { Appointment } from '../pages/Appointment';

const PublicLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  if (isAuthPage) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-navy-950">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with standard Header/Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/support" element={<Support />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Dashboard Routes (Custom shell containing Sidebar & Header) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:tab" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
