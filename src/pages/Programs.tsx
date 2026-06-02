import { useEffect, useState } from 'react';
import { Clock, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHero } from '@/components/cms/PageHero';
import { usePageContent } from '@/hooks/usePageContent';
import { buildProgramCategoryOptions } from '@/lib/cms/programCategories';
import { getSection } from '@/lib/cms/pages';
import { ApiError } from '@/lib/ApiError';
import { programsApi } from '@/lib/api/programs';
import {
  Program,
  ProgramCategory,
  programCategoryLabels,
  programStatusLabels,
} from '@/lib/types';

const fallbackProgramCategories = [
  { value: 'all', label: 'Tümü' },
  { value: 'education-module', label: 'Eğitim Modülleri' },
  { value: 'mentorship', label: 'Mentorluk' },
  { value: 'certificate', label: 'Sertifika' },
  { value: 'transformation-package', label: 'Dönüşüm Paketleri' },
];

export default function Programs() {
  const { heroTitle, heroSubtitle, sections } = usePageContent('programs', {
    title: 'Programlar',
    subtitle: 'Eğitimciler, yöneticiler ve topluluklar için tasarlanmış profesyonel gelişim programları',
  });
  const cta = getSection(sections, 'cta');
  const cmsCategories = buildProgramCategoryOptions(sections);
  const programCategories =
    cmsCategories.length > 0 ? cmsCategories : fallbackProgramCategories;

  const categoryLabel = (slug: string) =>
    programCategories.find((c) => c.value === slug)?.label ||
    programCategoryLabels[slug as ProgramCategory] ||
    slug;

  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeTab, setActiveTab] = useState<ProgramCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrograms = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await programsApi.getActive();
        setPrograms(data);
      } catch (e) {
        setPrograms([]);
        setLoadError(
          e instanceof ApiError
            ? e.message || 'İçerik yüklenemedi.'
            : 'İçerik yüklenemedi.'
        );
      } finally {
        setLoading(false);
      }
    };
    loadPrograms();
  }, []);

  const filteredPrograms = programs.filter((program) => {
    return activeTab === 'all' || program.category === activeTab;
  });

  return (
    <div>
      <PageHero title={heroTitle} subtitle={heroSubtitle} />

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ProgramCategory | 'all')}>
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1 mb-8">
              {programCategories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab}>
              {loadError ? (
                <div className="text-center py-12 text-destructive">{loadError}</div>
              ) : loading ? (
                <div className="text-center py-12 text-muted-foreground">Yükleniyor...</div>
              ) : filteredPrograms.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Bu kategoride program bulunamadı.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      categoryLabel={categoryLabel(program.category)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {cta ? (
        <section className="py-16 bg-muted">
          <div className="container-wide text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              {cta.title || 'Kurumunuz için Özel Program'}
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              {cta.subtitle ||
                'FELT Dönüşüm Paketleri ile okulunuzu geleceğe hazırlayın. Size özel çözümler için iletişime geçin.'}
            </p>
            <Button className="mt-6" size="lg" asChild>
              <a href="/contact">{cta.content || 'İletişime Geçin'}</a>
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ProgramCard({
  program,
  categoryLabel: categoryDisplay,
}: {
  program: Program;
  categoryLabel: string;
}) {
  return (
    <Card className="card-hover border-border">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{categoryDisplay}</Badge>
          <Badge
            variant={program.status === 'active' ? 'default' : 'outline'}
            className={program.status === 'active' ? 'bg-green-600' : ''}
          >
            {programStatusLabels[program.status]}
          </Badge>
        </div>
        <CardTitle className="text-lg">{program.title}</CardTitle>
        <CardDescription>{program.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{program.targetAudience}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{program.duration}</span>
          </div>
        </div>
        <Button className="w-full mt-4" variant="outline">
          Detayları İncele
        </Button>
      </CardContent>
    </Card>
  );
}
