import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { blogApi } from '@/lib/api/blog';
import { BlogPost, BlogCategory, blogCategoryLabels } from '@/lib/types';

const blogCategories: { value: BlogCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'essay', label: 'Essay' },
  { value: 'future-notes', label: 'Future Notes' },
  { value: 'video-podcast-notes', label: 'Video & Podcast' },
  { value: 'weekly-insight', label: 'Weekly Insight' },
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState<BlogCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const data = await blogApi.getPublished();
      setPosts(data);
      setLoading(false);
    };
    loadPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    return activeTab === 'all' || post.category === activeTab;
  });

  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container-wide">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Blog / Perspektif</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl">
            Eğitimin geleceğine dair düşünceler, analizler ve içgörüler
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BlogCategory | 'all')}>
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
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Yükleniyor...</div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Bu kategoride yazı bulunamadı.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-muted">
        <div className="container-wide text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            FELT Bülteni
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Haftalık içgörüler, yeni yayınlar ve etkinlik duyuruları için bültenimize abone olun.
          </p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Abone Ol
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card className="border-border card-hover">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{blogCategoryLabels[post.category]}</Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          {post.publishDate.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          Devamını Oku <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
