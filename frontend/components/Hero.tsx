import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  activeCategory: 'advertising' | 'building';
}

export default function Hero({ activeCategory }: HeroProps) {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroContent = {
    advertising: {
      title: "Solusi Periklanan Terdepan",
      subtitle: "Wujudkan Brand Anda dengan Baliho, Neon Box, dan Papan Nama Berkualitas Tinggi",
      description: "Kami menghadirkan solusi periklanan outdoor yang menarik perhatian dan meningkatkan visibilitas bisnis Anda dengan teknologi terkini dan desain yang memukau.",
      features: [
        "Desain Custom Sesuai Brand",
        "Material Premium Tahan Cuaca",
        "Instalasi Profesional & Aman",
        "Garansi & Maintenance Terjamin"
      ],
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    building: {
      title: "Maintenance Gedung Profesional",
      subtitle: "Layanan Perawatan AC, Sistem Elektrikal, dan Maintenance Gedung Terpercaya",
      description: "Tim ahli kami siap menjaga gedung Anda dalam kondisi optimal dengan layanan maintenance komprehensif, teknologi modern, dan standar keamanan tertinggi.",
      features: [
        "Teknisi Bersertifikat & Berpengalaman",
        "Layanan 24/7 Emergency Response",
        "Preventive & Predictive Maintenance",
        "Laporan Berkala & Monitoring Real-time"
      ],
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  };

  const content = heroContent[activeCategory];

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-orange-50 to-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-transparent"></div>
      
      {/* Mobile category selector - only visible on small screens */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 p-3">
        <div className="flex items-center justify-center space-x-2">
          <Button
            size="sm"
            variant={activeCategory === 'advertising' ? 'default' : 'outline'}
            onClick={() => window.dispatchEvent(new CustomEvent('categoryChange', { detail: 'advertising' }))}
            className={`text-xs px-3 py-2 ${activeCategory === 'advertising' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-600 text-orange-600 hover:bg-orange-50'}`}
          >
            Periklanan
          </Button>
          <Button
            size="sm"
            variant={activeCategory === 'building' ? 'default' : 'outline'}
            onClick={() => window.dispatchEvent(new CustomEvent('categoryChange', { detail: 'building' }))}
            className={`text-xs px-3 py-2 ${activeCategory === 'building' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-600 text-orange-600 hover:bg-orange-50'}`}
          >
            Bangunan & ME
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pt-32 md:pt-40 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                {content.title}
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-orange-600 font-medium">
                {content.subtitle}
              </p>
              <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed">
                {content.description}
              </p>
            </div>

            <div className="space-y-3">
              {content.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-orange-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 md:px-8 py-3 text-sm md:text-base"
                onClick={scrollToContact}
              >
                Konsultasi Gratis
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-6 md:px-8 py-3 text-sm md:text-base"
                onClick={() => {
                  const element = document.getElementById('portfolio');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Lihat Portofolio
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">500+</div>
                <div className="text-xs md:text-sm text-gray-600">Proyek Selesai</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">15+</div>
                <div className="text-xs md:text-sm text-gray-600">Tahun Pengalaman</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600">98%</div>
                <div className="text-xs md:text-sm text-gray-600">Kepuasan Klien</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={content.image} 
                alt={content.title}
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white rounded-xl shadow-lg p-3 md:p-4 lg:p-6 max-w-xs">
              <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-orange-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-xs md:text-sm lg:text-base">Kualitas Terjamin</div>
                  <div className="text-xs md:text-sm text-gray-600">ISO 9001:2015 Certified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
