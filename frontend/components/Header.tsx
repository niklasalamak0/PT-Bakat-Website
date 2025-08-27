import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeCategory: 'advertising' | 'building';
  setActiveCategory: (category: 'advertising' | 'building') => void;
}

export default function Header({ activeCategory, setActiveCategory }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        {/* Main navbar */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            {!logoError ? (
              <img 
                src="https://via.placeholder.com/40x40/f97316/ffffff?text=BKT" 
                alt="PT. Bakti Karya Teknik Logo" 
                className="h-10 w-10 rounded-lg object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="h-10 w-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            )}
            <div className="text-lg md:text-xl lg:text-2xl font-bold text-orange-600">
              PT. Bakti Karya Teknik
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#home" onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-orange-600 transition-colors">
              Beranda
            </a>
            <a href="#services" onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-orange-600 transition-colors">
              Layanan
            </a>
            <a href="#portfolio" onClick={() => scrollToSection('portfolio')} className="text-gray-700 hover:text-orange-600 transition-colors">
              Portofolio
            </a>
            <a href="#pricing" onClick={() => scrollToSection('pricing')} className="text-gray-700 hover:text-orange-600 transition-colors">
              Harga
            </a>
            <a href="#contact" onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-orange-600 transition-colors">
              Kontak
            </a>
          </nav>

          <div className="hidden xl:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>+62 21 1234 5678</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>info@baktikaryateknik.com</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Category buttons - only show on larger screens */}
        <div className="hidden md:flex items-center justify-center space-x-4 py-3 border-t border-gray-200">
          <Button
            variant={activeCategory === 'advertising' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('advertising')}
            className={activeCategory === 'advertising' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-600 text-orange-600 hover:bg-orange-50'}
          >
            Periklanan
          </Button>
          <Button
            variant={activeCategory === 'building' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('building')}
            className={activeCategory === 'building' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-600 text-orange-600 hover:bg-orange-50'}
          >
            Bangunan & ME
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="flex flex-col space-y-4 p-4">
            <a href="#home" onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-orange-600 transition-colors">
              Beranda
            </a>
            <a href="#services" onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-orange-600 transition-colors">
              Layanan
            </a>
            <a href="#portfolio" onClick={() => scrollToSection('portfolio')} className="text-gray-700 hover:text-orange-600 transition-colors">
              Portofolio
            </a>
            <a href="#pricing" onClick={() => scrollToSection('pricing')} className="text-gray-700 hover:text-orange-600 transition-colors">
              Harga
            </a>
            <a href="#contact" onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-orange-600 transition-colors">
              Kontak
            </a>
            
            {/* Category buttons in mobile menu */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Pilih Kategori:</p>
              <div className="flex flex-col space-y-2">
                <Button
                  variant={activeCategory === 'advertising' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveCategory('advertising');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full ${activeCategory === 'advertising' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-600 text-orange-600 hover:bg-orange-50'}`}
                >
                  Periklanan
                </Button>
                <Button
                  variant={activeCategory === 'building' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveCategory('building');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full ${activeCategory === 'building' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-600 text-orange-600 hover:bg-orange-50'}`}
                >
                  Bangunan & ME
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Phone className="w-4 h-4" />
                <span>+62 21 1234 5678</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>info@baktikaryateknik.com</span>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
