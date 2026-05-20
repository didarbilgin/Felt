import { useEffect, useMemo, useState } from 'react';
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
  { value: 'podcast', label: 'Podcast' },
];

const formatEventDate = (date: Date) =>
  date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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

  const publicEvents = useMemo(
    () => events.filter((event) => event.status !== 'archived'),
    [events],
  );

  const filteredEvents = useMemo(
    () =>
      publicEvents.filter((event) => {
        const displayStatus = getEventDisplayStatus(event);

        if (activeTab === 'all') return true;

        if (activeTab === 'upcoming') {
          return displayStatus === 'upcoming';
        }

        if (activeTab === 'past') {
          return displayStatus === 'completed';
        }

        return event.type === activeTab;
      }),
    [activeTab, publicEvents],
  );

  const highlightedEvents = useMemo(() => {
    const now = new Date();

    return publicEvents
      .filter((event) => event.status === 'active')
      .filter((event) => event.date.getTime() >= now.getTime())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [publicEvents]);

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container-wide">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Etkinlikler</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl">
            FELT Summit, webinarlar ve daha fazlası
          </p>
        </div>
      </section>

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

      {highlightedEvents.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container-wide">
            <div className="space-y-6">
              <div>
                <Badge className="mb-3">Aktif Etkinlikler</Badge>
                <h2 className="font-heading text-3xl md:text-4xl font-bold">
                  Yaklaşan ve Planlanan FELT Etkinlikleri
                </h2>
                <p className="mt-3 text-muted-foreground max-w-2xl">
                  FELT kapsamında planlanan aktif etkinlikler en yakın tarihten başlayarak listelenir.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {highlightedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-primary text-primary-foreground rounded-2xl p-8"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge className="bg-primary-foreground/20 text-primary-foreground">
                        {eventTypeLabels[event.type]}
                      </Badge>
                      <Badge className="bg-primary-foreground/20 text-primary-foreground">
                        {getEventDisplayStatusLabel(event)}
                      </Badge>
                    </div>

                    <h3 className="font-heading text-2xl font-bold">{event.title}</h3>

                    <p className="mt-4 text-primary-foreground/80">
                      {event.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatEventDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {event.link && (
                      <Button asChild size="lg" variant="secondary" className="mt-6">
                        <a href={event.link} target="_blank" rel="noopener noreferrer">
                          Detaylar
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
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
            variant={
              displayStatus === 'cancelled'
                ? 'destructive'
                : displayStatus === 'completed'
                  ? 'secondary'
                  : 'outline'
            }
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
            <span>{formatEventDate(event.date)}</span>
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