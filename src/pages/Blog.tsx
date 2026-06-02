import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHero } from '@/components/cms/PageHero';
import { usePageContent } from '@/hooks/usePageContent';
import { buildCategoryTabOptions } from '@/lib/cms/categoryTabs';
import { getSection } from '@/lib/cms/pages';
import { ApiError } from '@/lib/ApiError';
import { ComingSoonEmpty } from '@/components/content/ComingSoonEmpty';
import { ContentCardActions } from '@/components/content/ContentCardActions';
import { ExtraDetailDialog } from '@/components/content/ExtraDetailDialog';
import {
  ApplicationFormDialog,
  type ApplicationFormConfig,
} from '@/components/applications/ApplicationFormDialog';
import { Button } from '@/components/ui/button';
import { blogApi } from '@/lib/api/blog';
import { BlogPost, BlogCategory, blogCategoryLabels } from '@/lib/types';

const defaultBlogCategories: { value: BlogCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'essay', label: 'Deneme' },
  { value: 'future-notes', label: 'Gelecek Notları' },
  { value: 'video-podcast-notes', label: 'Video & Podcast' },
  { value: 'weekly-insight', label: 'Haftalık İçgörü' },
];

export default function Blog() {
  const { heroTitle, heroSubtitle, sections } = usePageContent('blog', {
    title: 'Blog / Perspektif',
    subtitle: 'Eğitimin geleceğine dair düşünceler, analizler ve içgörüler',
  });
  const newsletter = getSection(sections, 'newsletter');
  const cmsBlogCategories = buildCategoryTabOptions(sections, 'blog-tabs');
  const blogCategories =
    cmsBlogCategories.length > 0 ? cmsBlogCategories : defaultBlogCategories;

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await blogApi.getPublished();
        setPosts(data);
      } catch (e) {
        setPosts([]);
        setLoadError(
          e instanceof ApiError
            ? e.message || 'İçerik yüklenemedi.'
            : 'İçerik yüklenemedi.'
        );
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    return activeTab === 'all' || post.category === activeTab;
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTitle, setDetailTitle] = useState('');
  const [detailText, setDetailText] = useState('');
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  const newsletterFormConfig: ApplicationFormConfig | null = newsletter
    ? {
        sourceType: 'newsletter',
        sourceTitle: newsletter.title || 'Blog Bülteni',
        title: 'Bülten Aboneliği',
        submitLabel: 'Abone Ol',
        messageLabel: 'Not (isteğe bağlı)',
        successToastTitle: 'Abonelik kaydedildi',
        successMessage: 'Bültenimize başarıyla kaydoldunuz.',
      }
    : null;

  return (
    <div>
      <PageHero title={heroTitle} subtitle={heroSubtitle} />

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1 mb-8">
              {blogCategories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
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
              ) : posts.length === 0 ? (
                <ComingSoonEmpty />
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Bu kategoride yazı bulunamadı.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                  {filteredPosts.map((post) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      onDetail={() => {
                        setDetailTitle(post.title);
                        setDetailText(post.detailDescription || '');
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

      {newsletter ? (
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container-wide max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium tracking-wide text-primary-foreground/70 uppercase">
            Bülten
          </p>
          <h2 className="mt-3 font-heading text-3xl md:text-4xl font-bold">
            {newsletter?.title || 'Bülten'}
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto leading-relaxed">
            {newsletter?.subtitle || 'Haftalık içgörüler ve yeni yayınlardan haberdar olun'}
          </p>
          <Button
            type="button"
            size="lg"
            variant="secondary"
            className="mt-8"
            onClick={() => setNewsletterOpen(true)}
          >
            Abone Ol
          </Button>
        </div>
      </section>
      ) : null}

      <ApplicationFormDialog
        open={newsletterOpen}
        onOpenChange={setNewsletterOpen}
        config={newsletterFormConfig}
      />

      <ExtraDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={detailTitle}
        description={detailText}
      />
    </div>
  );
}

function BlogCard({ post, onDetail }: { post: BlogPost; onDetail: () => void }) {
  return (
    <Card className="border-border card-hover flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{blogCategoryLabels[post.category]}</Badge>
        </div>
        <CardTitle className="text-lg leading-snug">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{post.excerpt}</p>
        <p className="text-xs text-muted-foreground/80 mt-4">
          {post.publishDate.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <div className="mt-4 space-y-2">
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Devamını Oku <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
          <ContentCardActions
            extraDetail={post.detailDescription}
            externalLink={post.link}
            canApply={false}
            onDetail={onDetail}
          />
        </div>
      </CardContent>
    </Card>
  );
}
