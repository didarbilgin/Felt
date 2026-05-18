import { useState } from 'react';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'founder', label: 'Kurucunun Mesajı' },
  { id: 'what-is-felt', label: 'FELT Nedir?' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'values', label: 'Değerler ve İlkeler' },
  { id: 'roadmap', label: 'Stratejik Yol Haritası' },
];

export default function About() {
  const [activeSection, setActiveSection] = useState('founder');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container-wide">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Hakkında</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl">
            FELT'in hikayesi, vizyonu ve geleceğe yönelik stratejik hedefleri
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 flex-shrink-0">
              <nav className="sticky top-24 space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 max-w-3xl">
              {/* Founder's Message */}
              <section id="founder" className="mb-16 scroll-mt-24">
                <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                  Kurucunun Mesajı
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    Değerli okuyucular,
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Eğitim, her zaman toplumların geleceğini şekillendiren en güçlü araç olmuştur. 
                    Ancak bugün, hiç olmadığı kadar hızlı değişen bir dünyada yaşıyoruz. Yapay zeka, 
                    dijital dönüşüm ve küresel zorluklar, eğitimi yeniden düşünmemizi gerektiriyor.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    FELT, bu dönüşümün merkezinde yer almak için kuruldu. Amacımız, geleceğin 
                    eğitim liderlerini yetiştirmek, yenilikçi araştırmalar üretmek ve eğitim 
                    sistemlerinin dönüşümüne öncülük etmektir.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Birlikte, eğitimin geleceğini şekillendirebiliriz.
                  </p>
                  <p className="text-foreground font-medium mt-6">
                    Dr. Hümeyra Kalafat
                    <br />
                    <span className="text-muted-foreground font-normal">FELT Kurucusu</span>
                  </p>
                </div>
              </section>

              {/* What is FELT */}
              <section id="what-is-felt" className="mb-16 scroll-mt-24">
                <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                  FELT Nedir?
                </h2>
                <div className="space-y-6">
                  <div className="p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Misyon</h3>
                    <p className="text-muted-foreground">
                      Eğitimin, liderliğin ve teknolojinin geleceğini araştırmak, anlamak ve 
                      şekillendirmek için çalışan bir akademik platform olmak.
                    </p>
                  </div>
                  <div className="p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Vizyon</h3>
                    <p className="text-muted-foreground">
                      2040 yılına kadar, dünya genelinde eğitim sistemlerinin dönüşümüne 
                      öncülük eden referans kuruluş olmak.
                    </p>
                  </div>
                  <div className="p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Felsefe</h3>
                    <p className="text-muted-foreground">
                      İnsan merkezli, etik değerlere bağlı, teknoloji destekli ve 
                      gelecek odaklı bir eğitim anlayışı.
                    </p>
                  </div>
                </div>
              </section>

              {/* Manifesto */}
              <section id="manifesto" className="mb-16 scroll-mt-24">
                <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                  Manifesto
                </h2>
                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                  <p className="text-foreground italic text-lg leading-relaxed">
                    "Geleceğin eğitimi, bugünün hayal gücüyle şekillenir. Biz, eğitimin 
                    sınırlarını genişleten, teknolojiyi insanlığın hizmetine sunan ve 
                    her öğrencinin potansiyelini açığa çıkaran bir dünya için çalışıyoruz."
                  </p>
                </div>
                <div className="mt-6 space-y-4 text-muted-foreground">
                  <p>
                    FELT olarak, eğitimin sadece bilgi aktarımı değil, insanın bütüncül 
                    gelişimi olduğuna inanıyoruz. Teknoloji bir araçtır, amaç değil.
                  </p>
                  <p>
                    Gelecekçi liderlik, belirsizliği kucaklayan, etik değerlere bağlı 
                    kalan ve sürekli öğrenen bir liderlik anlayışıdır.
                  </p>
                  <p>
                    Biz, eğitim sistemlerinin dönüşümünün zorunlu olduğuna, bu dönüşümün 
                    insan merkezli olması gerektiğine ve birlikte çalışarak daha iyi 
                    bir gelecek inşa edebileceğimize inanıyoruz.
                  </p>
                </div>
              </section>

              {/* Values */}
              <section id="values" className="mb-16 scroll-mt-24">
                <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                  Değerler ve İlkeler
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: 'İnsan Merkezlilik', desc: 'Her kararımızın merkezinde insan var.' },
                    { title: 'Etik ve Dürüstlük', desc: 'Araştırma ve eğitimde en yüksek etik standartlar.' },
                    { title: 'Yenilikçilik', desc: 'Sürekli öğrenme ve gelişim kültürü.' },
                    { title: 'İş Birliği', desc: 'Küresel ortaklıklar ve topluluk gücü.' },
                    { title: 'Kapsayıcılık', desc: 'Herkes için erişilebilir eğitim fırsatları.' },
                    { title: 'Sürdürülebilirlik', desc: 'Gelecek nesillere karşı sorumluluk.' },
                  ].map((value) => (
                    <div key={value.title} className="p-4 border border-border rounded-lg">
                      <h3 className="font-semibold text-foreground">{value.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Roadmap */}
              <section id="roadmap" className="scroll-mt-24">
                <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                  Stratejik Yol Haritası 2025–2030
                </h2>
                <div className="space-y-4">
                  {[
                    { year: '2025', goal: 'Platform lansmanı ve ilk sertifika programları' },
                    { year: '2026', goal: 'FELT Summit ve uluslararası ortaklıklar' },
                    { year: '2027', goal: 'FELT Lab projelerinin genişletilmesi' },
                    { year: '2028', goal: 'Model okul programının pilot uygulaması' },
                    { year: '2029', goal: 'Küresel topluluk ağının 50.000 üyeye ulaşması' },
                    { year: '2030', goal: '10 ülkede FELT Model Okulları' },
                  ].map((milestone, index) => (
                    <div key={milestone.year} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {milestone.year.slice(-2)}
                        </div>
                        {index < 5 && <div className="w-0.5 h-full bg-border mt-2" />}
                      </div>
                      <div className="pb-8">
                        <span className="text-sm font-medium text-primary">{milestone.year}</span>
                        <p className="text-muted-foreground">{milestone.goal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
