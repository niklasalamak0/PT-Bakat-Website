import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import backend from '~backend/client';

export default function Testimonials() {
  const { data: testimonialsData, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => backend.company.getTestimonials(),
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Testimoni Klien</h2>
            <p className="text-xl text-gray-600">Kepercayaan klien adalah prioritas utama kami</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-6"></div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Testimoni Klien</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kepercayaan klien adalah prioritas utama kami. Berikut adalah pengalaman mereka bekerja sama dengan PT. Bakti Karya Teknik.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData?.testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Quote className="w-8 h-8 text-orange-600 mr-2" />
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-lg">
                      {testimonial.clientName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.clientName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.company}
                    </div>
                    <div className="text-xs text-orange-600 font-medium">
                      {testimonial.projectType}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Bergabunglah dengan 500+ Klien Puas
            </h3>
            <p className="text-gray-600 mb-6">
              Ratusan perusahaan telah mempercayakan kebutuhan periklanan dan maintenance gedung mereka kepada kami. 
              Saatnya giliran Anda merasakan pelayanan terbaik dari tim profesional kami.
            </p>
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">4.9/5</div>
                <div className="text-sm text-gray-600">Rating Kepuasan</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">500+</div>
                <div className="text-sm text-gray-600">Klien Puas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">98%</div>
                <div className="text-sm text-gray-600">Repeat Order</div>
              </div>
            </div>
            <button 
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Mulai Proyek Anda Sekarang
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
