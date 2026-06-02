import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Download, ExternalLink, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { articlesApi } from '@/lib/api/articles';
import { Article, articleTypeLabels } from '@/lib/types';

export default function ResearchArticle() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await articlesApi.getPublishedBySlug(slug);
      setArticle(data || null);
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-narrow text-center text-muted-foreground">Yükleniyor...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="section-padding">
        <div className="container-narrow text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">Yayın Bulunamadı</h1>
          <p className="mt-2 text-muted-foreground">
            Bu yayın mevcut değil veya yayından kaldırılmış olabilir.
          </p>
          <Link
            to="/research"
            className="mt-4 inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Araştırmalara Dön
          </Link>
        </div>
      </div>
    );
  }

  const publishedLabel = article.publishedAt
    ? article.publishedAt.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : String(article.year);

  const externalHref = article.link || (article.doi ? `https://doi.org/${article.doi}` : '');

  return (
    <article>
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container-narrow">
          <Link
            to="/research"
            className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tüm Yayınlar
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-primary-foreground/20 text-primary-foreground">
              {articleTypeLabels[article.type]}
            </Badge>
            <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground">
              {article.language}
            </Badge>
            <span className="text-sm text-primary-foreground/70">{article.year}</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold leading-tight">
            {article.title}
          </h1>
          {article.source ? (
            <p className="mt-3 text-primary-foreground/80">{article.source}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{publishedLabel}</span>
            </div>
            {article.authors ? (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{article.authors}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full max-h-80 object-cover rounded-lg border border-border mb-8"
            />
          ) : null}

          <div className="prose prose-lg max-w-none">
            {article.content.split('\n').map((paragraph, index) => {
              if (!paragraph.trim()) return null;
              if (paragraph.startsWith('## ')) {
                return (
                  <h2
                    key={index}
                    className="font-heading text-2xl font-bold text-foreground mt-8 mb-4"
                  >
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              return (
                <p key={index} className="text-muted-foreground leading-relaxed mt-4 first:mt-0">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {article.tags.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap gap-3">
            {article.pdfLink ? (
              <Button asChild variant="secondary">
                <a href={article.pdfLink} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Raporu İndir
                </a>
              </Button>
            ) : null}
            {externalHref ? (
              <Button asChild variant="outline">
                <a href={externalHref} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Dış Bağlantı
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </section>
    </article>
  );
}
