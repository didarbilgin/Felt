import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { articlesApi } from '@/lib/api/articles';
import { programsApi } from '@/lib/api/programs';
import { blogApi } from '@/lib/api/blog';
import { Article, Program, BlogPost, articleTypeLabels, blogCategoryLabels } from '@/lib/types';

export default function Home() {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [featuredProgram, setFeaturedProgram] = useState<Program | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [article, program, posts] = await Promise.all([
        articlesApi.getFeatured(),
        programsApi.getFeatured(),
        blogApi.getRecent(3),
      ]);
      setFeaturedArticle(article || null);
      setFeaturedProgram(program || null);
      setRecentPosts(posts);
    };
    loadData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-24 md:py-32">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-up">
              Futures of Education,
              <br />
              Leadership & Technology
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Eğitimin, liderliğin ve teknolojinin geleceğini araştıran, 
              şekillendiren ve paylaşan akademik platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Button asChild size="lg" variant="secondary">
                <Link to="/about">
                  FELT'i Keşfet
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/research">Araştırmaları İncele</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative element */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-accent/20 to-transparent pointer-events-none" />
      </section>

      {/* Highlights Section */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Öne Çıkanlar
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              FELT'in en güncel araştırmaları, programları ve projeleri
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Featured Article */}
            <Card className="card-hover border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Son Yayın</CardTitle>
                <CardDescription>Akademik Araştırma</CardDescription>
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
                  <p className="text-muted-foreground">Yükleniyor...</p>
                )}
              </CardContent>
            </Card>

            {/* Featured Program */}
            <Card className="card-hover border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Aktif Program</CardTitle>
                <CardDescription>Eğitim & Gelişim</CardDescription>
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
                  <p className="text-muted-foreground">Yükleniyor...</p>
                )}
              </CardContent>
            </Card>

            {/* FELT Lab */}
            <Card className="card-hover border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">FELT Lab</CardTitle>
                <CardDescription>İnovasyon & Deneyler</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium text-foreground line-clamp-2">
                  Yapay Zeka & Eğitim Araştırmaları
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  2040-2050 gelecek senaryoları ve prototip projeler
                </p>
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

      {/* Blog Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Blog / Perspektif
              </h2>
              <p className="mt-2 text-muted-foreground">
                Eğitimin geleceğine dair düşünceler ve analizler
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/blog">Tümünü Gör</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Card key={post.id} className="card-hover border-border bg-card">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {blogCategoryLabels[post.category]}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {post.publishDate.toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Devamını Oku <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            FELT Topluluğuna Katılın
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            Eğitimin geleceğini birlikte şekillendirmek isteyen eğitimciler, 
            araştırmacılar ve liderlerle tanışın.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/community">Topluluğu Keşfet</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">İletişime Geç</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
