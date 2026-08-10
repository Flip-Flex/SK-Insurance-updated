import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Loader } from '../components/ui/Loader';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Lazy load pages for code splitting
const Home = lazy(() => import('../pages/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('../pages/About').then(module => ({ default: module.About })));
const Plans = lazy(() => import('../pages/Plans').then(module => ({ default: module.Plans })));
const Calculator = lazy(() => import('../pages/Calculator').then(module => ({ default: module.Calculator })));
const Careers = lazy(() => import('../pages/Careers').then(module => ({ default: module.Careers })));
const Support = lazy(() => import('../pages/Support').then(module => ({ default: module.Support })));
const Blog = lazy(() => import('../pages/Blog').then(module => ({ default: module.Blog })));
const Auth = lazy(() => import('../pages/Auth').then(module => ({ default: module.Auth })));
const Dashboard = lazy(() => import('../pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Claims = lazy(() => import('../pages/Claims').then(module => ({ default: module.Claims })));
const NotFound = lazy(() => import('../pages/Errors/NotFound').then(module => ({ default: module.NotFound })));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy').then(module => ({ default: module.PrivacyPolicy })));
const Appointment = lazy(() => import('../pages/Appointment').then(module => ({ default: module.Appointment })));

const FallbackLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
    <Loader />
  </div>
);

const PublicLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  if (isAuthPage) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-navy-950">
        <Suspense fallback={<FallbackLoader />}>
          <Outlet />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<FallbackLoader />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/support" element={<Support />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={
          <Suspense fallback={<FallbackLoader />}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="/dashboard/:tab" element={
          <Suspense fallback={<FallbackLoader />}>
            <Dashboard />
          </Suspense>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
