import React from 'react';
import { MessageSquare, PenTool, Wrench, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProcessProps {
  activeCategory: 'advertising' | 'building';
}

export default function Process({ activeCategory }: ProcessProps) {
  const processSteps = {
    advertising: [
      {
        icon: MessageSquare,
        title: "Konsultasi & Analisis",
        description: "Diskusi kebutuhan, lokasi, target audience, dan budget untuk menentukan solusi periklanan terbaik"
      },
      {
        icon: PenTool,
        title: "Desain & Perencanaan",
        description: "Tim kreatif membuat desain custom sesuai brand identity dan melakukan survey lokasi pemasangan"
      },
      {
        icon: Wrench,
        title: "Produksi & Instalasi",
        description: "Proses produksi dengan material berkualitas tinggi dan instalasi profesional oleh tim berpengalaman"
      },
      {
        icon: CheckCircle,
        title: "Serah Terima & Maintenance",
        description: "Quality check, serah terima proyek, dan layanan maintenance berkala untuk menjaga kualitas"
      }
    ],
    building: [
      {
        icon: MessageSquare,
        title: "Assessment & Survey",
        description: "Evaluasi kondisi gedung, sistem ME, dan kebutuhan maintenance untuk menentukan scope kerja"
      },
      {
        icon: PenTool,
        title: "Planning & Scheduling",
        description: "Penyusunan jadwal maintenance, pemilihan spare part, dan koordinasi dengan manajemen gedung"
      },
      {
        icon: Wrench,
        title: "Execution & Monitoring",
        description: "Pelaksanaan maintenance oleh teknisi bersertifikat dengan monitoring real-time dan safety protocol"
      },
      {
        icon: CheckCircle,
        title: "Report & Follow-up",
        description: "Laporan hasil kerja, rekomendasi perbaikan, dan jadwal maintenance selanjutnya"
      }
    ]
  };

  const sectionTitles = {
    advertising: {
      title: "Proses Kerja Periklanan",
      subtitle: "4 langkah mudah untuk mewujudkan media periklanan impian Anda"
    },
    building: {
      title: "Proses Kerja Maintenance",
      subtitle: "4 tahap sistematis untuk menjaga gedung Anda dalam kondisi optimal"
    }
  };

  const steps = processSteps[activeCategory];
  const content = sectionTitles[activeCategory];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            
            return (
              <Card key={index} className="relative group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-orange-600 transition-colors duration-300">
                      <IconComponent className="w-10 h-10 text-orange-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-orange-300"></div>
                    <div className="w-0 h-0 border-l-4 border-l-orange-300 border-t-2 border-t-transparent border-b-2 border-b-transparent absolute right-0 top-1/2 transform -translate-y-1/2"></div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Siap Memulai Proyek Anda?
            </h3>
            <p className="text-gray-600 mb-6">
              Tim profesional kami siap membantu mewujudkan kebutuhan {activeCategory === 'advertising' ? 'periklanan' : 'maintenance gedung'} Anda dengan standar kualitas terbaik.
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Mulai Konsultasi Gratis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
