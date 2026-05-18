import { Users, Globe, Heart, BookOpen, Lightbulb, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const membershipTypes = [
  {
    title: 'Öğrenciler',
    description: 'Lisans, yüksek lisans ve doktora öğrencileri',
    benefits: ['Ücretsiz webinar erişimi', 'Kaynak kütüphanesi', 'Mentorluk fırsatları'],
  },
  {
    title: 'Akademisyenler',
    description: 'Araştırmacılar ve akademik personel',
    benefits: ['Araştırma iş birliği', 'Yayın fırsatları', 'Konferans indirimleri'],
  },
  {
    title: 'Okullar',
    description: 'K-12 okulları ve eğitim kurumları',
    benefits: ['Kurumsal danışmanlık', 'Öğretmen gelişimi', 'FELT Model erişimi'],
  },
  {
    title: 'Araştırmacılar',
    description: 'Bağımsız araştırmacılar ve think-tank\'ler',
    benefits: ['Veri paylaşımı', 'Ortak projeler', 'Yayın platformu'],
  },
];

const communityGroups = [
  {
    icon: BookOpen,
    title: 'Future Literacy Circle',
    description: 'Gelecek okuryazarlığı üzerine okuma ve tartışma grubu',
  },
  {
    icon: Lightbulb,
    title: 'Liderlik & Değerler Hub',
    description: 'Eğitim liderliği ve değerler eğitimi çalışma grubu',
  },
  {
    icon: MessageCircle,
    title: 'Teknoloji & Etik Forumu',
    description: 'Eğitim teknolojileri ve etik tartışmalar platformu',
  },
];

export default function Community() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container-wide">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Topluluk</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl">
            Eğitimin geleceğini birlikte şekillendiren küresel bir topluluk
          </p>
        </div>
      </section>

      {/* Membership Types */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">Üyelik</h2>
            <p className="mt-3 text-muted-foreground">
              FELT topluluğuna katılın ve eğitimin geleceğini birlikte şekillendirin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipTypes.map((type) => (
              <Card key={type.title} className="border-border card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Programs */}
      <section className="py-16 bg-muted">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Gönüllü Programları
              </h2>
              <p className="mt-4 text-muted-foreground">
                FELT'in misyonuna katkıda bulunmak isteyen gönüllüler için çeşitli 
                programlar sunuyoruz. İçerik üretimi, etkinlik organizasyonu, çeviri 
                ve araştırma desteği gibi alanlarda gönüllülerimizle çalışıyoruz.
              </p>
              <ul className="mt-6 space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  İçerik ve çeviri gönüllüleri
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Etkinlik organizasyon ekibi
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Araştırma asistanları
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Sosyal medya elçileri
                </li>
              </ul>
              <Button className="mt-6">Gönüllü Başvurusu</Button>
            </div>
            <div className="lg:w-1/2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Global Partnerlikler
              </h2>
              <p className="mt-4 text-muted-foreground">
                FELT, dünya genelinde üniversiteler, araştırma merkezleri, sivil toplum 
                kuruluşları ve eğitim kurumlarıyla iş birliği yapmaktadır.
              </p>
              <p className="mt-4 text-muted-foreground">
                Ortak araştırma projeleri, değişim programları ve küresel etkinlikler 
                aracılığıyla eğitimin geleceğini birlikte şekillendiriyoruz.
              </p>
              <Button variant="outline" className="mt-6">Partner Olun</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Groups */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Kulüpler & Çalışma Grupları
            </h2>
            <p className="mt-3 text-muted-foreground">
              İlgi alanlarınıza göre çalışma gruplarına katılın
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {communityGroups.map((group) => (
              <Card key={group.title} className="border-border card-hover text-center">
                <CardHeader>
                  <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <group.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{group.title}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm">Katıl</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="font-heading text-3xl font-bold">
            Hemen Katılın
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            FELT topluluğuna üye olun, etkinliklere katılın ve eğitimin 
            geleceğini birlikte şekillendirin.
          </p>
          <Button size="lg" variant="secondary" className="mt-6">
            Üyelik Başvurusu
          </Button>
        </div>
      </section>
    </div>
  );
}
