import { useEffect, useState } from 'react';
import { Clock, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ApplicationFormDialog,
  type ApplicationFormConfig,
} from '@/components/applications/ApplicationFormDialog';
import { ComingSoonEmpty } from '@/components/content/ComingSoonEmpty';
import { ContentCardActions } from '@/components/content/ContentCardActions';
import { ExtraDetailDialog } from '@/components/content/ExtraDetailDialog';
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

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTitle, setDetailTitle] = useState('');
  const [detailText, setDetailText] = useState('');

  const [applyOpen, setApplyOpen] = useState(false);
  const [applyConfig, setApplyConfig] = useState<ApplicationFormConfig | null>(null);

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

  const openDetail = (program: Program) => {
    setDetailTitle(program.title);
    setDetailText(program.detailDescription || '');
    setDetailOpen(true);
  };

  const openApply = (program: Program) => {
    setApplyConfig({
      sourceType: 'program',
      sourceId: program.id,
      sourceTitle: program.title,
      title: 'Başvur',
      successMessage: 'Program başvurunuz alındı.',
    });
    setApplyOpen(true);
  };

  const openCtaApply = () => {
    setApplyConfig({
      sourceType: 'program',
      sourceTitle: cta?.title || 'Program başvurusu',
      title: 'Başvur',
      successMessage: 'Başvurunuz alındı.',
    });
    setApplyOpen(true);
  };

  const hasAnyPrograms = programs.length > 0;

  return (
    <div>
      <PageHero title={heroTitle} subtitle={heroSubtitle} />

      <section className="section-padding">
        <div className="container-wide">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ProgramCategory | 'all')}>
            <div className="tabs-scroll mb-8">
              <TabsList className="tabs-scroll-list bg-muted data-[state=active]:shadow-sm">
                {programCategories.map((category) => (
                  <TabsTrigger
                    key={category.value}
                    value={category.value}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm shrink-0"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeTab}>
              {loadError ? (
                <div className="text-center py-12 text-destructive">{loadError}</div>
              ) : loading ? (
                <div className="text-center py-12 text-muted-foreground">Yükleniyor...</div>
              ) : !hasAnyPrograms ? (
                <ComingSoonEmpty />
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
                      onDetail={() => openDetail(program)}
                      onApply={() => openApply(program)}
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
            <Button className="mt-6" size="lg" onClick={openCtaApply}>
              Başvur
            </Button>
          </div>
        </section>
      ) : null}

      <ExtraDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={detailTitle}
        description={detailText}
      />
      <ApplicationFormDialog open={applyOpen} onOpenChange={setApplyOpen} config={applyConfig} />
    </div>
  );
}

function ProgramCard({
  program,
  categoryLabel: categoryDisplay,
  onDetail,
  onApply,
}: {
  program: Program;
  categoryLabel: string;
  onDetail: () => void;
  onApply: () => void;
}) {
  return (
    <Card className="card-hover border-border flex flex-col">
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
      <CardContent className="flex flex-col flex-1">
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
        <ContentCardActions
          className="mt-4"
          size="default"
          extraDetail={program.detailDescription}
          externalLink={program.link}
          applyLabel="Başvur"
          onDetail={onDetail}
          onApply={onApply}
        />
      </CardContent>
    </Card>
  );
}
