import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppRoutes } from './routes';
import { ChatWidget } from './components/ui/ChatWidget';
import { HelmetProvider, Helmet } from 'react-helmet-async';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <Helmet>
                <title>SK Smart Investments</title>
                <meta name="description" content="Premium insurance portfolios and policies. Start your digital application instantly." />
                <meta name="theme-color" content="#f6ff00" />
              </Helmet>
              <ScrollToTop />
              <AppRoutes />
              <ChatWidget />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
