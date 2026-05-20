import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Network,
  Users,
  FileText,
  BookMarked,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { articlesApi } from '@/lib/api/articles';
import { programsApi } from '@/lib/api/programs';
import { blogApi } from '@/lib/api/blog';
import { Article, Program, BlogPost, articleTypeLabels, blogCategoryLabels } from '@/lib/types';

const feltHubs = [
  {
    name: 'AI & Pedagogy Circle',
    type: 'Circle',
    description:
      'Yapay zekanın pedagojik ve etik sınırlarını okuma grupları ve tartışma serileriyle araştırır.',
  },
  {
    name: 'Human Futures Lab',
    type: 'Lab',
    description:
      'İnsan merkezli gelecek senaryoları, değerler ve öğrenme modelleri üzerine deneysel çalışmalar.',
  },
  {
    name: 'Post-Digital Learning Hub',
    type: 'Hub',
    description:
      'Post-dijital çağda öğrenme, liderlik ve kurum dönüşümüne dair araştırma ve perspektifler.',
  },
  {
    name: 'Futures Reading Group',
    type: 'Group',
    description:
      'Gelecek okuryazarlığı ve eğitim felsefesi üzerine çevrimiçi okuma ve yorum toplulukları.',
  },
];

const ecosystemSignals = [
  'Çevrimiçi okuma grupları',
  'Üç aylık araştırma notları',
  'Fellows programları',
  'Araştırma toplulukları',
];

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
      <section className="relative bg-primary text-primary-foreground py-28 md:py-36">
        <div className="container-wide">
          <div className="max-w-4xl">
            <p className="text-sm md:text-base font-medium tracking-wide text-primary-foreground/70 uppercase">
              Futures of Education, Leadership & Technology
            </p>
            <h1 className="mt-4 font-heading text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.15] animate-fade-up">
              The future of education is being negotiated now.
            </h1>
            <p
              className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed animate-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              Researching AI, ethics, leadership, and human learning in the
              post-digital age.
            </p>
            <p
              className="mt-4 text-base text-primary-foreground/65 max-w-xl leading-relaxed animate-fade-up"
              style={{ animationDelay: '0.15s' }}
            >
              FELT, yapay zekâ çağının eğitim, etik ve insanlık düzeyindeki
              dönüşümüne yanıt veren bir düşünce ve araştırma ağıdır.
            </p>
            <div
              className="mt-10 flex flex-wrap gap-4 animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              <Button asChild size="lg" variant="secondary">
                <Link to="/about">
                  FELT'i Keşfet
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
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-accent/20 to-transparent pointer-events-none" />
      </section>

      {/* Manifesto / Big Idea */}
      <section className="py-12 md:py-16 border-b border-border bg-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary/5 border-l-4 border-primary px-6 py-8 md:px-10 md:py-10 rounded-r-lg">
              <p className="font-heading text-xl md:text-2xl text-foreground leading-relaxed italic">
                &ldquo;FELT explores how education systems, leaders, and learners
                can respond to the ethical, technological, and human
                challenges of the AI age.&rdquo;
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Bir düşünce platformu, araştırma ağı ve gelecek odaklı eğitim
                enstitüsü.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hubs, Circles & Labs */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="max-w-3xl mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Hub&apos;lar, Circle&apos;lar ve Lab&apos;lar
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              FELT yalnızca bir web sitesi değil; büyüyen bir araştırma
              ekosistemidir. Hub&apos;lar, circle&apos;lar ve lab&apos;lar
              düşünce topluluklarını, okuma gruplarını ve ortak araştırmayı
              bir araya getirir.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {feltHubs.map((hub) => (
              <Card
                key={hub.name}
                className="border-border bg-card card-hover"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium uppercase tracking-wider text-primary">
                      {hub.type}
                    </span>
                    <Network className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                  <CardTitle className="font-heading text-lg md:text-xl">
                    {hub.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {hub.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-4">
              Büyüyen ekosistem
            </p>
            <div className="flex flex-wrap gap-2">
              {ecosystemSignals.map((signal) => (
                <span
                  key={signal}
                  className="text-sm px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground"
                >
                  {signal}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground max-w-2xl">
              Contributors, fellows ve collaborators ile genişleyen bir{' '}
              <span className="text-foreground font-medium">FELT Network</span>
              — kurumsal üyelikten çok, ortak düşünce ve araştırma çevresi.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="section-padding bg-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Öne Çıkanlar
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Güncel araştırmalar, programlar ve perspektifler
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

      {/* CTA Section — FELT Network */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <p className="text-sm font-medium tracking-wide text-primary-foreground/70 uppercase">
            FELT Network
          </p>
          <h2 className="mt-3 font-heading text-3xl md:text-4xl font-bold">
            Join the FELT Community
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Contributors, fellows, collaborators ve research circle
            üyeleriyle eğitimin geleceğini birlikte düşünün ve araştırın.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-primary-foreground/70">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Collaborators
            </span>
            <span className="text-primary-foreground/40">·</span>
            <span className="inline-flex items-center gap-1.5">
              <BookMarked className="h-4 w-4" />
              Research Circle
            </span>
            <span className="text-primary-foreground/40">·</span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              Fellows
            </span>
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
              <Link to="/contact">İletişime Geç</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
