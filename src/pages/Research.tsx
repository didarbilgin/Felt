import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ComingSoonEmpty } from '@/components/content/ComingSoonEmpty';
import { ContentCardActions } from '@/components/content/ContentCardActions';
import { ExtraDetailDialog } from '@/components/content/ExtraDetailDialog';
import { normalizeExternalLink } from '@/lib/contentExtra';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHero } from '@/components/cms/PageHero';
import { usePageContent } from '@/hooks/usePageContent';
import { buildCategoryTabOptions } from '@/lib/cms/categoryTabs';
import { getSection } from '@/lib/cms/pages';
import { articlesApi } from '@/lib/api/articles';
import { Article, ArticleType, Language, articleTypeLabels } from '@/lib/types';

const defaultArticleTypes: { value: ArticleType | 'all'; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'article', label: 'Akademik Makaleler' },
  { value: 'conference', label: 'Kongre & Sunumlar' },
  { value: 'report', label: 'Raporlar' },
  { value: 'book', label: 'Kitaplar' },
  { value: 'scale', label: 'Veri ve Ölçekler' },
];

const defaultUiLabels: Record<string, string> = {
  language_filter: 'Dil:',
  language_all: 'Tümü',
  language_tr: 'Türkçe',
  language_en: 'İngilizce',
  empty: 'Bu kategoride yayın bulunamadı.',
  loading: 'Yükleniyor...',
};

export default function Research() {
  const { heroTitle, heroSubtitle, sections } = usePageContent('research', {
    title: 'Araştırma & Yayınlar',
    subtitle: 'Eğitim, liderlik ve teknoloji alanlarındaki akademik çalışmalarımız',
  });

  const uiLabels = defaultUiLabels;
  const cmsArticleTypes = buildCategoryTabOptions(sections, 'article-tabs');
  const articleTypes =
    cmsArticleTypes.length > 0 ? cmsArticleTypes : defaultArticleTypes;

  const categoryLabel = (slug: string) =>
    articleTypes.find((t) => t.value === slug)?.label ||
    articleTypeLabels[slug as ArticleType] ||
    slug;

  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<Language | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await articlesApi.getPublished();
        setArticles(data);
      } catch (e) {
        setArticles([]);
        setLoadError(e instanceof Error ? e.message : 'Yayınlar yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTitle, setDetailTitle] = useState('');
  const [detailText, setDetailText] = useState('');

  const filteredArticles = articles.filter((article) => {
    const matchesType = activeTab === 'all' || article.type === activeTab;
    const matchesLanguage = languageFilter === 'all' || article.language === languageFilter;
    return matchesType && matchesLanguage;
  });

  return (
    <div>
      <PageHero title={heroTitle} subtitle={heroSubtitle} />

      <section className="section-padding">
        <div className="container-wide">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 mb-6">
            <span className="text-sm text-muted-foreground shrink-0">{uiLabels.language_filter}</span>
            <div className="flex flex-wrap gap-1">
              {(['all', 'TR', 'EN'] as const).map((lang) => (
                <Button
                  key={lang}
                  variant={languageFilter === lang ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguageFilter(lang)}
                >
                  {lang === 'all'
                    ? uiLabels.language_all
                    : lang === 'TR'
                      ? uiLabels.language_tr
                      : uiLabels.language_en}
                </Button>
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="tabs-scroll">
              <TabsList className="tabs-scroll-list bg-muted">
                {articleTypes.map((type) => (
                  <TabsTrigger
                    key={type.value}
                    value={type.value}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm shrink-0"
                  >
                    {type.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-6">
              {loadError ? (
                <div className="text-center py-12 text-destructive">{loadError}</div>
              ) : loading ? (
                <div className="text-center py-12 text-muted-foreground">{uiLabels.loading}</div>
              ) : articles.length === 0 ? (
                <ComingSoonEmpty />
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">{uiLabels.empty}</div>
              ) : (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      categoryLabel={categoryLabel}
                      onDetail={() => {
                        setDetailTitle(article.title);
                        setDetailText(article.detailDescription || '');
                        setDetailOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <ExtraDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={detailTitle}
        description={detailText}
      />
    </div>
  );
}

function ArticleCard({
  article,
  categoryLabel,
  onDetail,
}: {
  article: Article;
  categoryLabel: (slug: string) => string;
  onDetail: () => void;
}) {
  const linkHref = article.link?.trim();
  const doiValue = article.doi?.trim();
  const externalHref = normalizeExternalLink(
    linkHref || (doiValue ? `https://doi.org/${doiValue}` : '')
  );

  return (
    <div className="p-4 sm:p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="secondary">{categoryLabel(article.type)}</Badge>
            <Badge variant="outline">{article.language}</Badge>
            <span className="text-sm text-muted-foreground">{article.year}</span>
          </div>
          <h3 className="font-semibold text-foreground text-lg">{article.title}</h3>
          {article.authors ? (
            <p className="mt-1 text-sm text-muted-foreground">{article.authors}</p>
          ) : null}
          {article.source ? (
            <p className="mt-1 text-sm text-muted-foreground">{article.source}</p>
          ) : null}
          {article.abstract ? (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.abstract}</p>
          ) : null}
          {article.tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
          <Link
            to={`/research/${article.slug}`}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-1 text-sm font-medium text-primary-foreground bg-primary px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Devamını Oku
            <ArrowRight className="h-4 w-4" />
          </Link>
          <ContentCardActions
            extraDetail={article.detailDescription}
            externalLink={externalHref}
            canApply={false}
            onDetail={onDetail}
          />
        </div>
      </div>
    </div>
  );
}
