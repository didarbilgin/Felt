import { useEffect, useState } from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { eventsApi } from '@/lib/api/events';
import {
  Event,
  EventType,
  eventTypeLabels,
  getEventDisplayStatus,
  getEventDisplayStatusLabel,
} from '@/lib/types';

const eventTypes: { value: EventType | 'all' | 'upcoming' | 'past'; label: string }[] = [
  { value: 'upcoming', label: 'Yaklaşan' },
  { value: 'past', label: 'Geçmiş' },
  { value: 'all', label: 'Tümü' },
  { value: 'summit', label: 'Summit' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'masterclass', label: 'Masterclass' },
  { value: 'podcast', label: 'Podcast' },
];

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const data = await eventsApi.getAll();
      setEvents(data);
      setLoading(false);
    };
    loadEvents();
  }, []);

  const now = new Date();
  const filteredEvents = events.filter((event) => {
    if (activeTab === 'upcoming') return event.date >= now;
    if (activeTab === 'past') return event.date < now;
    if (activeTab === 'all') return true;
    return event.type === activeTab;
  });

  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container-wide">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Etkinlikler</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl">
            FELT Summit, webinarlar, masterclass'lar ve daha fazlası
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1 mb-8">
              {eventTypes.map((type) => (
                <TabsTrigger
                  key={type.value}
                  value={type.value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Yükleniyor...</div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Bu kategoride etkinlik bulunamadı.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FELT Summit Highlight */}
      <section className="py-16 bg-muted">
        <div className="container-wide">
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start justify-between gap-8">
              <div>
                <Badge className="bg-primary-foreground/20 text-primary-foreground mb-4">
                  Yıllık Etkinlik
                </Badge>
                <h2 className="font-heading text-3xl md:text-4xl font-bold">
                  FELT Summit 2025
                </h2>
                <p className="mt-4 text-primary-foreground/80 max-w-xl">
                  Eğitimin geleceğini şekillendiren liderler, araştırmacılar ve yenilikçiler
                  bir araya geliyor. Konuşmacılar, atölyeler ve networking fırsatları.
                </p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>15-16 Haziran 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>İstanbul, Türkiye</span>
                  </div>
                </div>
              </div>
              <Button size="lg" variant="secondary" className="shrink-0">
                Kayıt Ol
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const displayStatus = getEventDisplayStatus(event);
  const displayLabel = getEventDisplayStatusLabel(event);
  const isDimmed = displayStatus === 'completed' || displayStatus === 'cancelled';

  return (
    <Card className={`border-border ${isDimmed ? 'opacity-80 border-muted-foreground/25' : ''}`}>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="secondary">{eventTypeLabels[event.type]}</Badge>
          <Badge
            variant={displayStatus === 'cancelled' ? 'destructive' : displayStatus === 'completed' ? 'secondary' : 'outline'}
          >
            {displayLabel}
          </Badge>
        </div>
        <CardTitle className="text-lg">{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {event.date.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Detaylar
          </a>
        )}
      </CardContent>
    </Card>
  );
}
