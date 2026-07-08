import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import StylesCatalog from './pages/StylesCatalog';
import StylistPortfolios from './pages/StylistPortfolios';
import Scheduler from './components/Scheduler';
import AppointmentsDashboard from './pages/AppointmentsDashboard';
import AdminDashboard from './pages/AdminDashboard'; // [ADDED]
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { beautyService } from './lib/client';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isFallback, setIsFallback] = useState(false);

  // Load user session and monitor service mode on startup
  useEffect(() => {
    setUser(beautyService.getCurrentUser());
    setIsFallback(beautyService.isFallbackActive());

    // Pre-test the connection dynamically to set fallback banners immediately
    async function checkConnection() {
      try {
        await beautyService.getHairstyles();
        setIsFallback(beautyService.isFallbackActive());
      } catch (e) {
        setIsFallback(true);
      }
    }
    checkConnection();
  }, []);

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
    setIsFallback(beautyService.isFallbackActive());
  };

  const handleLogout = () => {
    beautyService.logout();
    setUser(null);
  };

  const handleBookingSuccess = () => {
    setIsFallback(beautyService.isFallbackActive());
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-cream selection:bg-gold-200 selection:text-charcoal">
        {/* Navigation Header bar */}
        <Header user={user} onLogout={handleLogout} isFallback={isFallback} />

        {/* Primary Page views */}
        <main className="flex-grow py-6 sm:py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/styles" element={<StylesCatalog />} />
            <Route path="/stylists" element={<StylistPortfolios />} />
            
            <Route 
              path="/book" 
              element={<Scheduler user={user} onBookingSuccess={handleBookingSuccess} />} 
            />
            
            <Route 
              path="/appointments" 
              element={
                <AppointmentsDashboard 
                  user={user} 
                  onLoginSuccess={handleLoginSuccess} 
                />
              } 
            />

            {/* Admin Management Dashboard */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            <Route 
              path="/login" 
              element={<LoginPage onLoginSuccess={handleLoginSuccess} />} 
            />
            
            <Route 
              path="/register" 
              element={<RegisterPage onRegisterSuccess={handleLoginSuccess} />} 
            />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer Area */}
        <Footer />
      </div>
    </HashRouter>
  );
}