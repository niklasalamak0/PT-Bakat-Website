import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Process from './components/Process';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

export default function AppInner() {
  const [activeCategory, setActiveCategory] = useState<'advertising' | 'building'>('advertising');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [adminToken, setAdminToken] = useState<string>('');

  // Listen for category changes from mobile buttons
  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      setActiveCategory(event.detail as 'advertising' | 'building');
    };

    window.addEventListener('categoryChange', handleCategoryChange as EventListener);
    return () => {
      window.removeEventListener('categoryChange', handleCategoryChange as EventListener);
    };
  }, []);

  const handleAdminLogin = (user: any, token: string) => {
    setAdminUser(user);
    setAdminToken(token);
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    setAdminToken('');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <Hero activeCategory={activeCategory} />
      <Services activeCategory={activeCategory} />
      <Portfolio activeCategory={activeCategory} />
      <Process activeCategory={activeCategory} />
      <Pricing activeCategory={activeCategory} />
      <Testimonials />
      <Contact />
      <Footer />
      
      {adminUser ? (
        <AdminDashboard 
          user={adminUser} 
          token={adminToken} 
          onLogout={handleAdminLogout} 
        />
      ) : (
        <AdminLogin onLogin={handleAdminLogin} />
      )}
    </div>
  );
}
