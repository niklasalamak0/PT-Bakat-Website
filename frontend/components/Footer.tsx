import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-orange-600 mb-4">
                PT. Bakti Karya Teknik
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Solusi terpercaya untuk kebutuhan periklanan outdoor dan maintenance gedung dengan standar kualitas tinggi dan pelayanan profesional.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Layanan Periklanan</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors duration-300">
                  Baliho & Billboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors duration-300">
                  Neon Box & LED Sign
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors duration-300">
                  Papan Nama
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors duration-300">
                  Desain Grafis
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors duration-300">
                  Konsultasi Branding
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Layanan Bangunan & ME</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors duration-300">
                  Maintenance AC
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors duration-300">
                  Sistem Elektrikal
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors duration-300">
                  Maintenance Gedung
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors duration-300">
                  Facility Management
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors duration-300">
                  Emergency Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Kontak Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>Jl. Industri Raya No. 123</p>
                  <p>Kawasan Industri Pulogadung</p>
                  <p>Jakarta Timur 13260</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>+62 21 1234 5678</p>
                  <p>+62 812 3456 7890</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>info@baktikaryateknik.com</p>
                  <p>sales@baktikaryateknik.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} PT. Bakti Karya Teknik. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a 
                href="#" 
                onClick={() => scrollToSection('home')}
                className="text-gray-400 hover:text-orange-600 transition-colors duration-300"
              >
                Beranda
              </a>
              <a 
                href="#" 
                onClick={() => scrollToSection('services')}
                className="text-gray-400 hover:text-orange-600 transition-colors duration-300"
              >
                Layanan
              </a>
              <a 
                href="#" 
                onClick={() => scrollToSection('portfolio')}
                className="text-gray-400 hover:text-orange-600 transition-colors duration-300"
              >
                Portofolio
              </a>
              <a 
                href="#" 
                onClick={() => scrollToSection('contact')}
                className="text-gray-400 hover:text-orange-600 transition-colors duration-300"
              >
                Kontak
              </a>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              Dibuat dengan ❤️ untuk memberikan solusi terbaik bagi kebutuhan periklanan dan maintenance gedung Anda
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
