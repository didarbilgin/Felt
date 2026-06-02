import { Brain, Glasses, Rocket, School, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHero } from '@/components/cms/PageHero';
import { usePageContent } from '@/hooks/usePageContent';
import { DEFAULT_LAB_PROJECT_TAGLINE, getLabProjects, getSection } from '@/lib/cms/pages';
import { cn } from '@/lib/utils';

const iconByTitle: Record<string, typeof Brain> = {
  'Yapay Zeka & Eğitim': Brain,
  'Metaverse, VR ve XR Uygulamaları': Glasses,
  'Gelecek Senaryoları (2040–2050)': Rocket,
  'Eğitim İnovasyon Projeleri': Lightbulb,
  'Prototip Öğrenme Ortamları': School,
};

const defaultLabSections = [
  {
    title: 'Yapay Zeka & Eğitim',
    description: 'Yapay zekanın eğitimde kullanımına yönelik araştırmalar ve uygulamalar',
    projects: ['Kişiselleştirilmiş Öğrenme Asistanı Prototipi', 'AI Destekli Değerlendirme Sistemleri'],
  },
];

export default function Lab() {
  const { heroTitle, heroSubtitle, sections } = usePageContent('lab', {
    title: 'FELT Lab',
    subtitle: 'Eğitimin geleceğini araştıran, deneyen ve tasarlayan inovasyon laboratuvarı',
  });

  const labSectionsData = getSection(sections, 'lab-sections');
  const defaultProjectTagline =
    labSectionsData?.subtitle?.trim() || DEFAULT_LAB_PROJECT_TAGLINE;

  const labSections =
    labSectionsData?.items?.map((item) => ({
      title: item.title || '',
      description: item.content || '',
      projects: getLabProjects(item, defaultProjectTagline),
      icon: iconByTitle[item.title || ''] || Lightbulb,
    })) ||
    defaultLabSections.map((s) => ({
      ...s,
      icon: Lightbulb,
      projects: s.projects.map((name) => ({ name, tagline: defaultProjectTagline })),
    }));

  return (
    <div>
      <PageHero title={heroTitle} subtitle={heroSubtitle} />

      <section className="section-padding">
        <div className="container-wide space-y-16 md:space-y-20">
          {labSections.map((section, index) => {
            const isReversed = index % 2 === 1;

            return (
              <div
                key={section.title}
                className={cn(
                  'grid lg:grid-cols-12 gap-8 lg:gap-12 items-start',
                  isReversed && 'lg:[direction:rtl]'
                )}
              >
                <div
                  className={cn(
                    'lg:col-span-4 flex gap-4 lg:flex-col lg:items-start',
                    isReversed && 'lg:[direction:ltr]'
                  )}
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <section.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="lg:[direction:ltr]">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-muted-foreground leading-relaxed max-w-md">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className={cn('lg:col-span-8 lg:[direction:ltr]')}>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.projects.map((project) => (
                      <Card key={project.name} className="border-border h-full">
                        <CardHeader>
                          <CardTitle className="text-base leading-snug">{project.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>{project.tagline}</CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
