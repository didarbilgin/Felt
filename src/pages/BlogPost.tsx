import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { blogApi } from '@/lib/api/blog';
import { BlogPost as BlogPostType, blogCategoryLabels } from '@/lib/types';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await blogApi.getBySlug(slug);
      setPost(data || null);
      setLoading(false);
    };
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-narrow text-center text-muted-foreground">
          Yükleniyor...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="section-padding">
        <div className="container-narrow text-center">
          <h1 className="text-2xl font-bold text-foreground">Yazı Bulunamadı</h1>
          <p className="mt-2 text-muted-foreground">Bu yazı mevcut değil veya kaldırılmış olabilir.</p>
          <Link
            to="/blog"
            className="mt-4 inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Blog'a Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container-narrow">
          <Link
            to="/blog"
            className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tüm Yazılar
          </Link>
          <Badge className="bg-primary-foreground/20 text-primary-foreground mb-4">
            {blogCategoryLabels[post.category]}
          </Badge>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center gap-4 text-sm text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {post.publishDate.toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={index} className="text-muted-foreground ml-4">
                    {paragraph.replace('- ', '')}
                  </li>
                );
              }
              if (paragraph.trim() === '') return null;
              return (
                <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Author */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">HK</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Dr. Hümeyra Kalafat</p>
                <p className="text-sm text-muted-foreground">FELT Kurucusu</p>
              </div>
            </div>
          </div>

          {/* Back to blog */}
          <div className="mt-8">
            <Link
              to="/blog"
              className="inline-flex items-center text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tüm Yazılara Dön
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
