import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import backend from '~backend/client';

interface PricingProps {
  activeCategory: 'advertising' | 'building';
}

export default function Pricing({ activeCategory }: PricingProps) {
  const { data: pricingData, isLoading } = useQuery({
    queryKey: ['pricing', activeCategory],
    queryFn: () => backend.company.getPricing({ category: activeCategory }),
  });

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sectionTitles = {
    advertising: {
      title: "Paket Harga Periklanan",
      subtitle: "Pilihan paket yang fleksibel sesuai kebutuhan dan budget Anda"
    },
    building: {
      title: "Paket Harga Maintenance",
      subtitle: "Solusi maintenance gedung dengan harga transparan dan kompetitif"
    }
  };

  const content = sectionTitles[activeCategory];

  if (isLoading) {
    return (
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h2>
            <p className="text-xl text-gray-600">{content.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingData?.packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative group hover:shadow-xl transition-all duration-300 ${
                pkg.isPopular 
                  ? 'border-orange-600 shadow-lg scale-105' 
                  : 'border-gray-200 hover:-translate-y-2'
              }`}
            >
              {pkg.isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white px-4 py-1">
                  <Star className="w-4 h-4 mr-1" />
                  Paling Populer
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {pkg.name}
                </CardTitle>
                <div className="text-3xl font-bold text-orange-600">
                  {pkg.priceRange}
                </div>
                <p className="text-sm text-gray-500">
                  *Harga dapat bervariasi sesuai spesifikasi
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className={`w-full mt-8 ${
                    pkg.isPopular 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'border-orange-600 text-orange-600 hover:bg-orange-50'
                  }`}
                  variant={pkg.isPopular ? 'default' : 'outline'}
                  onClick={scrollToContact}
                >
                  Pilih Paket Ini
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Butuh Paket Custom?
            </h3>
            <p className="text-gray-600 mb-6">
              Kami juga menyediakan paket khusus sesuai kebutuhan spesifik proyek Anda. 
              Konsultasikan kebutuhan Anda dengan tim ahli kami untuk mendapatkan penawaran terbaik.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={scrollToContact}
              >
                Konsultasi Custom Package
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-orange-600 text-orange-600 hover:bg-orange-50"
                onClick={() => {
                  window.open('https://wa.me/6281234567890', '_blank');
                }}
              >
                WhatsApp Langsung
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
