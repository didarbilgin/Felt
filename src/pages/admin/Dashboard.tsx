import { useEffect, useState } from 'react';
import { FileText, GraduationCap, Calendar, PenTool } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { articlesApi } from '@/lib/api/articles';
import { programsApi } from '@/lib/api/programs';
import { eventsApi } from '@/lib/api/events';
import { blogApi } from '@/lib/api/blog';
export default function AdminDashboard() {
  const [stats, setStats] = useState({ articles: 0, programs: 0, events: 0, posts: 0 });

  useEffect(() => {
    const load = async () => {
      const [articles, programs, events, posts] = await Promise.all([
        articlesApi.getAll(), programsApi.getAll(), eventsApi.getAll(), blogApi.getAll()
      ]);
      setStats({ articles: articles.length, programs: programs.length, events: events.length, posts: posts.length });
    };
    load();
  }, []);

  const cards = [
    { title: 'Makaleler', value: stats.articles, icon: FileText, href: '/admin/articles' },
    { title: 'Programlar', value: stats.programs, icon: GraduationCap, href: '/admin/programs' },
    { title: 'Etkinlikler', value: stats.events, icon: Calendar, href: '/admin/events' },
    { title: 'Blog Yazıları', value: stats.posts, icon: PenTool, href: '/admin/blog' },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.title} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
