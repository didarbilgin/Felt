import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { articlesApi } from '@/lib/api/articles';
import { Article, ArticleType, Language, articleTypeLabels } from '@/lib/types';

const articleTypes: { value: ArticleType | 'all'; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'article', label: 'Akademik Makaleler' },
  { value: 'conference', label: 'Kongre & Sunumlar' },
  { value: 'report', label: 'Raporlar' },
  { value: 'book', label: 'Kitaplar' },
  { value: 'scale', label: 'Veri ve Ölçekler' },
];

export default function Research() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<ArticleType | 'all'>('all');
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

  const filteredArticles = articles.filter((article) => {
    const matchesType = activeTab === 'all' || article.type === activeTab;
    const matchesLanguage = languageFilter === 'all' || article.language === languageFilter;
    return matchesType && matchesLanguage;
  });

  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container-wide">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Araştırma & Yayınlar</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl">
            Eğitim, liderlik ve teknoloji alanlarındaki akademik çalışmalarımız
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          {/* Language Filter */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Dil:</span>
            <div className="flex gap-1">
              {(['all', 'TR', 'EN'] as const).map((lang) => (
                <Button
                  key={lang}
                  variant={languageFilter === lang ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguageFilter(lang)}
                >
                  {lang === 'all' ? 'Tümü' : lang === 'TR' ? 'Türkçe' : 'English'}
                </Button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ArticleType | 'all')}>
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1">
              {articleTypes.map((type) => (
                <TabsTrigger
                  key={type.value}
                  value={type.value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {loadError ? (
                <div className="text-center py-12 text-destructive">{loadError}</div>
              ) : loading ? (
                <div className="text-center py-12 text-muted-foreground">Yükleniyor...</div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Bu kategoride yayın bulunamadı.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const linkHref = article.link?.trim();
  const doiValue = article.doi?.trim();
  const externalHref = linkHref || (doiValue ? `https://doi.org/${doiValue}` : '');

  return (
    <div className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="secondary">{articleTypeLabels[article.type]}</Badge>
            <Badge variant="outline">{article.language}</Badge>
            <span className="text-sm text-muted-foreground">{article.year}</span>
          </div>
          <h3 className="font-semibold text-foreground text-lg">{article.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{article.source}</p>
          {article.abstract && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.abstract}</p>
          )}
          {article.tags.length > 0 && (
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
          )}
        </div>
        {externalHref ? (
          <a
            href={externalHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:underline shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
            {doiValue && !linkHref ? 'DOI' : 'Bağlantı'}
          </a>
        ) : null}
      </div>
    </div>
  );
}
