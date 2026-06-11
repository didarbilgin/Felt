import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Network,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePageContent } from '@/hooks/usePageContent';
import { getSection, splitLines } from '@/lib/cms/pages';
import { buildHomeRenderPlan } from '@/lib/cms/homeRenderPlan';
import { EcosystemIntro } from '@/components/home/EcosystemIntro';
import { HomeManifesto } from '@/components/home/HomeManifesto';
import { preferTurkishDisplay, translateHubType } from '@/lib/cms/turkishDefaults';
import { articlesApi } from '@/lib/api/articles';
import { programsApi } from '@/lib/api/programs';
import { blogApi } from '@/lib/api/blog';
import { Article, Program, BlogPost, articleTypeLabels, blogCategoryLabels } from '@/lib/types';

const ECOSYSTEM_INTRO =
  "FELT, eğitim, teknoloji ve insan odaklı dönüşüm üzerine düşünen araştırmacıları, eğitimcileri ve liderleri bir araya getiren gelişen bir araştırma ekosistemidir. Hub'lar, circle'lar ve lab'lar; düşünce topluluklarını, okuma gruplarını ve ortak araştırma süreçlerini destekler.";

const defaultHubs = [
  {
    name: 'Yapay Zeka ve Pedagoji Çemberi',
    type: 'Çember',
    description:
      'Yapay zekanın pedagojik ve etik sınırlarını okuma grupları ve tartışma serileriyle araştırır.',
  },
  {
    name: 'İnsan Gelecekleri Laboratuvarı',
    type: 'Laboratuvar',
    description:
      'İnsan merkezli gelecek senaryoları, değerler ve öğrenme modelleri üzerine deneysel çalışmalar.',
  },
  {
    name: 'Post-Dijital Öğrenme Merkezi',
    type: 'Merkez',
    description: 'Post-dijital çağda öğrenme, liderlik ve kurum dönüşümüne dair araştırma ve perspektifler.',
  },
  {
    name: 'Gelecek Okuryazarlığı Okuma Grubu',
    type: 'Grup',
    description:
      'Gelecek okuryazarlığı ve eğitim felsefesi üzerine çevrimiçi okuma ve yorum toplulukları.',
  },
];

function HubCard({
  name,
  type,
  description,
}: {
  name: string;
  type: string;
  description: string;
}) {
  return (
    <article className="group rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm transition-shadow hover:shadow-md h-full flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-4">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          {type}
        </span>
        <Network className="h-5 w-5 text-primary/50 shrink-0" />
      </div>
      <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground leading-snug">
        {name}
      </h3>
      {description ? (
        <p className="mt-4 text-base text-muted-foreground leading-relaxed flex-1">{description}</p>
      ) : null}
    </article>
  );
}

function HomeHubsSection({
  ecosystemTitle,
  ecosystemIntro,
  hubCards,
}: {
  ecosystemTitle: string;
  ecosystemIntro: string;
  hubCards: { name: string; type: string; description: string }[];
}) {
  return (
    <section className="relative bg-muted/25 border-b border-border">
      <div className="container-wide pt-12 md:pt-16 pb-16 md:pb-24">
        <div className="mb-12 md:mb-16">
          <EcosystemIntro title={ecosystemTitle} intro={ecosystemIntro} />
        </div>
        <div className="relative max-w-6xl">
          <div className="mb-10 md:mb-12">
            <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground">
              Hub&apos;lar, çemberler ve laboratuvarlar
            </h3>
            <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
              Araştırma ve uygulama alanlarında bir araya gelen topluluklar ve çalışma biçimleri.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {hubCards.map((hub) => (
              <HubCard key={hub.name} {...hub} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeEcosystemSignalsSection({
  title,
  subtitle,
  signalCards,
}: {
  title: string;
  subtitle: string;
  signalCards: { name: string; type: string; description: string }[];
}) {
  if (signalCards.length === 0) return null;

  return (
    <section className="relative bg-muted/25 border-b border-border">
      <div className="container-wide py-16 md:py-24">
        <div className="relative max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
                {title}
              </h2>
              {subtitle ? (
                <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
            {signalCards.map((card, index) => (
              <EcosystemLayerCard
                key={card.name}
                index={index + 1}
                name={card.name}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EcosystemLayerCard({
  index,
  name,
  description,
}: {
  index: number;
  name: string;
  description?: string;
}) {
  return (
    <article className="group relative flex gap-5 md:gap-6 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/[0.04] p-6 md:p-8 lg:p-9 shadow-sm hover:shadow-lg transition-shadow min-h-[168px] md:min-h-[192px] overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-primary/20"
        aria-hidden
      />
      <span className="font-heading text-4xl md:text-5xl font-bold text-primary/20 tabular-nums leading-none pt-1 shrink-0">
        {String(index).padStart(2, '0')}
      </span>
      <div className="flex flex-col justify-center min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-2">
          Ekosistem katmanı
        </p>
        <h4 className="font-heading text-xl md:text-2xl font-semibold text-foreground leading-snug">
          {name}
        </h4>
        {description ? (
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">{description}</p>
        ) : null}
      </div>
    </article>
  );
}

export default function Home() {
  const { sections } = usePageContent('home', {
    title: 'Ana Sayfa',
    subtitle: '',
  });

  const hero = getSection(sections, 'hero');
  const manifesto = getSection(sections, 'manifesto');
  const hubsSection = getSection(sections, 'hubs');
  const ecosystem = getSection(sections, 'ecosystem');
  const highlights = getSection(sections, 'highlights');
  const blogPreview = getSection(sections, 'blog-preview');
  const networkCta = getSection(sections, 'network-cta');

  const heroEyebrow = preferTurkishDisplay(
    hero?.title,
    'Eğitim, Liderlik ve Teknolojinin Geleceği'
  );
  const heroHeadline = preferTurkishDisplay(
    hero?.subtitle,
    'Eğitimin geleceği bugün şekilleniyor.'
  );
  const heroBodyParts = splitLines(hero?.content).map((line) =>
    preferTurkishDisplay(line, line)
  );
  const heroSubtitle =
    preferTurkishDisplay(
      heroBodyParts[0],
      'Yapay zekâ, etik, liderlik ve insan öğrenmesi üzerine araştırma ve düşünce üretiyoruz.'
    ) ||
    'Yapay zekâ, etik, liderlik ve insan öğrenmesi üzerine araştırma ve düşünce üretiyoruz.';
  const heroContext =
    heroBodyParts.slice(1).join('\n') ||
    'FELT, yapay zekâ çağının eğitim, etik ve insanlık düzeyindeki dönüşümüne yanıt veren bir düşünce ve araştırma ağıdır.';

  const manifestoQuote = preferTurkishDisplay(
    manifesto?.content,
    'FELT, eğitim sistemlerinin, liderlerin ve öğrenenlerin yapay zekâ çağının etik, teknolojik ve insani zorluklarına nasıl yanıt verebileceğini araştırır.'
  );

  const hubCards =
    hubsSection?.items?.map((item) => ({
      name: item.title || '',
      type: translateHubType(item.subtitle || ''),
      description: item.content || '',
    })) || defaultHubs;

  const ecosystemTitle = preferTurkishDisplay(
    hubsSection?.title,
    'Büyüyen Araştırma Ekosistemi'
  );
  const ecosystemIntro = preferTurkishDisplay(
    hubsSection?.subtitle || ecosystem?.content,
    ECOSYSTEM_INTRO
  );
  const ecosystemSignalsTitle = preferTurkishDisplay(
    ecosystem?.title,
    'Ekosistem alanları'
  );
  const ecosystemSignalsSubtitle = preferTurkishDisplay(
    ecosystem?.subtitle || '',
    'Ağın farklı katmanlarında sürdürülen çalışma ve paylaşım biçimleri — araştırma kümeleri ve düşünce ağları.'
  );

  const signalCards =
    ecosystem?.items
      ?.map((item) => ({
        name: item.title || '',
        type: 'Alan',
        description: item.content || '',
      }))
      .filter((c) => c.name) || [
      { name: 'Çevrimiçi okuma grupları', type: 'Alan', description: '' },
      { name: 'Üç aylık araştırma notları', type: 'Alan', description: '' },
      { name: 'Fellow programları', type: 'Alan', description: '' },
      { name: 'Araştırma toplulukları', type: 'Alan', description: '' },
    ];

  const highlightCards = highlights?.items || [];
  const labCard = highlightCards[2];

  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [featuredProgram, setFeaturedProgram] = useState<Program | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [articleResult, programResult, postsResult] = await Promise.allSettled([
        articlesApi.getFeatured(),
        programsApi.getFeatured(),
        blogApi.getRecent(3),
      ]);
      if (articleResult.status === 'fulfilled') {
        setFeaturedArticle(articleResult.value || null);
      }
      if (programResult.status === 'fulfilled') {
        setFeaturedProgram(programResult.value || null);
      }
      if (postsResult.status === 'fulfilled') {
        setRecentPosts(postsResult.value);
      }
    };
    loadData();
  }, []);

  const renderPlan = useMemo(() => {
    const plan = buildHomeRenderPlan(sections);
    if (plan.some((block) => block.kind === 'hero')) return plan;
    return [{ kind: 'hero' as const }, ...plan];
  }, [sections]);

  const renderBlock = (block: (typeof renderPlan)[number], index: number) => {
    switch (block.kind) {
      case 'hero':
        return (
          <section
            key={`hero-${index}`}
            className="relative bg-primary text-primary-foreground overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-accent/20 to-transparent pointer-events-none" />
            <div className="container-wide relative pt-24 md:pt-28 lg:pt-32 pb-16 md:pb-20 lg:pb-24">
              <div className="max-w-4xl">
                <p className="text-sm md:text-base font-medium tracking-wide text-primary-foreground/70 uppercase">
                  {heroEyebrow}
                </p>
                <h1 className="mt-4 font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.15] break-words">
                  {heroHeadline}
                </h1>
                <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
                  {heroSubtitle}
                </p>
                <p className="mt-4 text-base text-primary-foreground/65 max-w-xl leading-relaxed">
                  {heroContext}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Button asChild size="lg" variant="secondary">
                    <Link to="/about">
                      FELT&apos;i Keşfet
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    <Link to="/research">Araştırmaları İncele</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div
              className="h-10 md:h-14 bg-gradient-to-b from-primary to-muted/25 pointer-events-none"
              aria-hidden
            />
          </section>
        );

      case 'hubs':
        return (
          <HomeHubsSection
            key={`hubs-${index}`}
            ecosystemTitle={ecosystemTitle}
            ecosystemIntro={ecosystemIntro}
            hubCards={hubCards}
          />
        );

      case 'ecosystem-signals':
        return (
          <HomeEcosystemSignalsSection
            key={`ecosystem-${index}`}
            title={ecosystemSignalsTitle}
            subtitle={ecosystemSignalsSubtitle}
            signalCards={signalCards}
          />
        );

      case 'manifesto':
        return (
          <HomeManifesto
            key={`manifesto-${index}`}
            quote={manifestoQuote}
            subtitle={manifesto?.subtitle}
          />
        );

      case 'highlights':
        return (
          <section
            key={`highlights-${index}`}
            className="py-16 md:py-24 bg-background border-b border-border/60"
          >
            <div className="container-wide">
              <div className="mb-12 md:mb-14 max-w-3xl border-l-4 border-primary pl-6 md:pl-8">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  {highlights?.title || 'Öne Çıkanlar'}
                </h2>
                <p className="mt-3 text-base md:text-lg text-muted-foreground leading-relaxed">
                  {highlights?.subtitle || 'Güncel araştırmalar, programlar ve perspektifler'}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <Card className="card-hover border-border">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">
                      {highlightCards[0]?.title || 'Son Yayın'}
                    </CardTitle>
                    <CardDescription>
                      {highlightCards[0]?.subtitle || 'Akademik Araştırma'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {featuredArticle ? (
                      <>
                        <h3 className="font-medium text-foreground line-clamp-2">
                          {featuredArticle.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {articleTypeLabels[featuredArticle.type]} • {featuredArticle.year}
                        </p>
                        <Link
                          to="/research"
                          className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                          Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Henüz öne çıkan yayın yok.</p>
                    )}
                  </CardContent>
                </Card>
                <Card className="card-hover border-border">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">
                      {highlightCards[1]?.title || 'Aktif Program'}
                    </CardTitle>
                    <CardDescription>
                      {highlightCards[1]?.subtitle || 'Eğitim ve Gelişim'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {featuredProgram ? (
                      <>
                        <h3 className="font-medium text-foreground line-clamp-2">
                          {featuredProgram.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {featuredProgram.duration} • {featuredProgram.targetAudience}
                        </p>
                        <Link
                          to="/programs"
                          className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                          Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Henüz öne çıkan program yok.</p>
                    )}
                  </CardContent>
                </Card>
                <Card className="card-hover border-border">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{labCard?.title || 'FELT Lab'}</CardTitle>
                    <CardDescription>
                      {labCard?.subtitle || 'İnovasyon ve Deneyler'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {labCard?.content ? (
                      <>
                        {splitLines(labCard.content).map((line, i) => (
                          <p
                            key={i}
                            className={
                              i === 0
                                ? 'font-medium text-foreground line-clamp-2'
                                : 'mt-2 text-sm text-muted-foreground'
                            }
                          >
                            {line}
                          </p>
                        ))}
                      </>
                    ) : (
                      <>
                        <h3 className="font-medium text-foreground line-clamp-2">
                          Yapay Zeka ve Eğitim Araştırmaları
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          2040–2050 gelecek senaryoları ve prototip projeler
                        </p>
                      </>
                    )}
                    <Link
                      to="/lab"
                      className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Keşfet <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        );

      case 'blog-preview':
        return (
          <section
            key={`blog-${index}`}
            className="py-16 md:py-24 bg-muted/40 border-y border-border"
          >
            <div className="container-wide">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 md:mb-12">
                <div className="max-w-2xl border-l-4 border-primary pl-6">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                    {blogPreview?.title || 'Blog / Perspektif'}
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {blogPreview?.subtitle || 'Eğitimin geleceğine dair düşünceler ve analizler'}
                  </p>
                </div>
                <Button asChild variant="outline" className="shrink-0">
                  <Link to="/blog">Tümünü Gör</Link>
                </Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                {recentPosts.map((post) => (
                  <Card key={post.id} className="card-hover border-border bg-card flex flex-col h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {blogCategoryLabels[post.category]}
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-snug">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 pt-0">
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {post.excerpt}
                      </p>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="mt-5 inline-flex items-center text-sm font-medium text-primary hover:underline"
                      >
                        Devamını Oku <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        );

      case 'network-cta':
        return (
          <section
            key={`cta-${index}`}
            className="py-16 md:py-24 bg-primary text-primary-foreground"
          >
            <div className="container-wide max-w-4xl mx-auto text-center">
              <p className="text-sm font-medium tracking-wide text-primary-foreground/70 uppercase">
                {networkCta?.content || 'FELT Topluluğu'}
              </p>
              <h2 className="mt-3 font-heading text-3xl md:text-4xl font-bold">
                {networkCta?.title || 'FELT Topluluğuna Katılın'}
              </h2>
              <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
                {networkCta?.subtitle ||
                  'Eğitimin geleceğini birlikte düşünmek ve araştırmak için topluluğumuza davetlisiniz.'}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-primary-foreground/70">
                {(networkCta?.items || [
                  { title: 'İş birlikleri' },
                  { title: 'Araştırma çevreleri' },
                  { title: 'Bursiyer programı' },
                ]).map((item, itemIndex) => (
                  <span key={item.title} className="inline-flex items-center gap-1.5">
                    {itemIndex > 0 ? (
                      <span className="text-primary-foreground/40 mx-1">·</span>
                    ) : null}
                    {item.title === 'Fellows' ? 'Bursiyer programı' : item.title}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/community">FELT Topluluğuna Katıl</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link to="/contact#contact-form">İletişime Geç</Link>
                </Button>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-background">
      {renderPlan.map((block, index) => renderBlock(block, index))}
    </div>
  );
}

