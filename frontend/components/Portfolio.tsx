import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import backend from '~backend/client';

interface PortfolioProps {
  activeCategory: 'advertising' | 'building';
}

export default function Portfolio({ activeCategory }: PortfolioProps) {
  const { data: portfolioData, isLoading } = useQuery({
    queryKey: ['portfolios', activeCategory],
    queryFn: () => backend.company.getPortfolios({ category: activeCategory, limit: 6 }),
  });

  const sectionTitles = {
    advertising: {
      title: "Portofolio Periklanan",
      subtitle: "Karya-karya terbaik kami dalam bidang periklanan outdoor"
    },
    building: {
      title: "Portofolio Bangunan & ME",
      subtitle: "Proyek-proyek maintenance dan sistem mekanikal elektrikal"
    }
  };

  const content = sectionTitles[activeCategory];

  if (isLoading) {
    return (
      <section id="portfolio" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h2>
            <p className="text-xl text-gray-600">{content.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
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
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioData?.portfolios.map((project) => (
            <Card key={project.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Badge className="absolute top-4 left-4 bg-orange-600 text-white">
                  {activeCategory === 'advertising' ? 'Periklanan' : 'Bangunan & ME'}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Building2 className="w-4 h-4" />
                    <span>{project.clientName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(project.completionDate).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Ingin melihat lebih banyak proyek kami?
          </p>
          <button 
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-orange-600 hover:text-orange-700 font-semibold underline"
          >
            Hubungi kami untuk portofolio lengkap
          </button>
        </div>
      </div>
    </section>
  );
}
