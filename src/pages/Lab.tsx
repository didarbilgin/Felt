import { Brain, Glasses, Rocket, School, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const labSections = [
  {
    id: 'ai-education',
    title: 'Yapay Zeka & Eğitim',
    icon: Brain,
    description: 'Yapay zekanın eğitimde kullanımına yönelik araştırmalar ve uygulamalar',
    projects: [
      'Kişiselleştirilmiş Öğrenme Asistanı Prototipi',
      'AI Destekli Değerlendirme Sistemleri',
      'Öğretmen için AI Okuryazarlığı Araç Seti',
    ],
  },
  {
    id: 'metaverse',
    title: 'Metaverse, VR ve XR Uygulamaları',
    icon: Glasses,
    description: 'Sanal ve artırılmış gerçeklik teknolojileriyle eğitim deneyimleri',
    projects: [
      'Sanal Sınıf Ortamı Tasarımı',
      'VR Tarih Müzesi Deneyimi',
      'XR Fen Laboratuvarı Simülasyonu',
    ],
  },
  {
    id: 'future-scenarios',
    title: 'Gelecek Senaryoları (2040–2050)',
    icon: Rocket,
    description: 'Eğitimin geleceğine dair senaryolar ve stratejik öngörüler',
    projects: [
      '2040 Eğitim Senaryoları Raporu',
      'Gelecek Okuryazarlığı Çerçevesi',
      'Delphi Çalışması: Eğitimin Geleceği',
    ],
  },
  {
    id: 'innovation',
    title: 'Eğitim İnovasyon Projeleri',
    icon: Lightbulb,
    description: 'Yenilikçi eğitim modelleri ve pilot uygulamalar',
    projects: [
      'Proje Tabanlı Öğrenme Modeli',
      'Çok Kuşaklı Öğrenme Programı',
      'Sürdürülebilirlik Eğitimi Müfredatı',
    ],
  },
  {
    id: 'prototype-schools',
    title: 'Prototip Öğrenme Ortamları',
    icon: School,
    description: 'Geleceğin okullarını bugünden tasarlama çalışmaları',
    projects: [
      'FELT Model Okul Konsepti',
      'Esnek Öğrenme Mekanları Tasarımı',
      'Topluluk Tabanlı Öğrenme Merkezi',
    ],
  },
];

export default function Lab() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container-wide">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">FELT Lab</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl">
            Eğitimin geleceğini araştıran, deneyen ve tasarlayan inovasyon laboratuvarı
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-muted/50">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-lg text-muted-foreground leading-relaxed">
              FELT Lab, eğitimde geleceği bugünden deneyimlememizi sağlayan bir araştırma ve 
              geliştirme alanıdır. Burada yapay zeka, sanal gerçeklik, yeni pedagojik yaklaşımlar 
              ve yenilikçi öğrenme ortamları üzerine çalışıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Lab Sections */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="space-y-12">
            {labSections.map((section, index) => (
              <div 
                key={section.id} 
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-start`}
              >
                {/* Icon Card */}
                <div className="lg:w-1/3">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <section.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                {/* Projects */}
                <div className="lg:w-2/3">
                  <h3 className="font-semibold text-foreground mb-4">Projeler</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {section.projects.map((project) => (
                      <Card key={project} className="border-border hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                          <p className="text-sm font-medium text-foreground">{project}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">
            FELT Lab'a Katılın
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            Araştırmacılar, eğitimciler ve yenilikçiler olarak geleceğin eğitimini 
            birlikte şekillendirmek ister misiniz?
          </p>
          <a
            href="/contact"
            className="mt-6 inline-flex items-center px-6 py-3 bg-primary-foreground text-primary font-medium rounded-lg hover:bg-primary-foreground/90 transition-colors"
          >
            İletişime Geçin
          </a>
        </div>
      </section>
    </div>
  );
}
