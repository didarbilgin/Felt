import { useEffect, useMemo, useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import {
  ApplicationFormDialog,
  type ApplicationFormConfig,
} from '@/components/applications/ApplicationFormDialog';
import { ComingSoonEmpty } from '@/components/content/ComingSoonEmpty';
import { ContentCardActions } from '@/components/content/ContentCardActions';
import { ExtraDetailDialog } from '@/components/content/ExtraDetailDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/cms/PageHero';
import { usePageContent } from '@/hooks/usePageContent';
import { buildCategoryTabOptions } from '@/lib/cms/categoryTabs';
import { getSection } from '@/lib/cms/pages';
import { ApiError } from '@/lib/ApiError';
import { eventsApi } from '@/lib/api/events';
import {
  Event,
  EventType,
  eventTypeLabels,
  getEventDisplayStatus,
  getEventDisplayStatusLabel,
} from '@/lib/types';

const defaultEventTypes: { value: EventType | 'all' | 'upcoming' | 'past'; label: string }[] = [
  { value: 'upcoming', label: 'Yaklaşan' },
  { value: 'past', label: 'Geçmiş' },
  { value: 'all', label: 'Tümü' },
  { value: 'summit', label: 'Zirve' },
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
  const { heroTitle, heroSubtitle, sections } = usePageContent('events', {
    title: 'Etkinlikler',
    subtitle: 'Zirve, webinar ve topluluk buluşmaları',
  });
  const highlight = getSection(sections, 'highlight');
  const cmsEventTypes = buildCategoryTabOptions(sections, 'event-tabs');
  const eventTypes = cmsEventTypes.length > 0 ? cmsEventTypes : defaultEventTypes;

  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [loading, setLoading] = useState(true);
  const [tabInitialized, setTabInitialized] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await eventsApi.listPublic();
        setEvents(data);
      } catch (e) {
        setEvents([]);
        setLoadError(
          e instanceof ApiError
            ? e.message || 'İçerik yüklenemedi.'
            : 'İçerik yüklenemedi.'
        );
      } finally {
        setLoading(false);
      }
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

  const upcomingEvents = useMemo(
    () => publicEvents.filter((event) => getEventDisplayStatus(event) === 'upcoming'),
    [publicEvents]
  );

  const highlightedEvents = useMemo(() => {
    return [...upcomingEvents].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [upcomingEvents]);

  useEffect(() => {
    if (loading) return;
    if (!tabInitialized) {
      setActiveTab(upcomingEvents.length > 0 ? 'upcoming' : 'all');
      setTabInitialized(true);
      return;
    }
    if (activeTab === 'upcoming' && upcomingEvents.length === 0) {
      setActiveTab('all');
    }
  }, [loading, tabInitialized, upcomingEvents.length, activeTab]);

  const showHighlight = highlightedEvents.length > 0;
  const displayHighlightedEvents = highlightedEvents.slice(0, 3);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTitle, setDetailTitle] = useState('');
  const [detailText, setDetailText] = useState('');
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyConfig, setApplyConfig] = useState<ApplicationFormConfig | null>(null);

  const canRegisterForEvent = (event: Event) => {
    const displayStatus = getEventDisplayStatus(event);
    return (
      displayStatus !== 'completed' &&
      displayStatus !== 'cancelled' &&
      event.status !== 'archived'
    );
  };

  const openDetail = (event: Event) => {
    setDetailTitle(event.title);
    setDetailText(event.detailDescription || '');
    setDetailOpen(true);
  };

  const openApply = (event: Event) => {
    setApplyConfig({
      sourceType: 'event',
      sourceId: event.id,
      sourceTitle: event.title,
      title: 'Kayıt Ol',
      successMessage: 'Etkinlik kaydınız alındı.',
    });
    setApplyOpen(true);
  };

  const hasAnyEvents = publicEvents.length > 0;

  const scrollToAllEvents = () => {
    document.getElementById('etkinlik-listesi')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-background">
      <PageHero title={heroTitle} subtitle={heroSubtitle} />

      <div className="relative">
        {showHighlight && (
          <section
            id="aktif-etkinlikler"
            className="relative scroll-mt-20 pt-10 md:pt-14 pb-6 md:pb-8"
          >
            <div
              className="absolute inset-0 bg-gradient-to-b from-muted/60 via-muted/30 to-background pointer-events-none"
              aria-hidden
            />
            <div className="container-wide relative">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-12">
                <div className="max-w-3xl">
                  <Badge className="mb-3">{highlight?.title || 'Aktif Etkinlikler'}</Badge>
                  <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-foreground leading-tight">
                    {highlight?.subtitle || 'Yaklaşan etkinliklerimizi keşfedin'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={scrollToAllEvents}
                  className="text-sm font-medium text-primary hover:underline shrink-0 self-start sm:self-auto"
                >
                  Tüm etkinlikleri gör ↓
                </button>
              </div>

              <div className="space-y-6 md:space-y-8">
                {displayHighlightedEvents.map((event) => (
                  <article
                    key={event.id}
                    className="flex flex-col lg:flex-row lg:items-stretch rounded-2xl overflow-hidden border border-border bg-card shadow-md min-h-[220px] lg:min-h-[260px]"
                  >
                    <div className="lg:w-[36%] xl:w-[32%] bg-primary text-primary-foreground px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 flex flex-col justify-center shrink-0">
                      <div className="flex flex-wrap items-center gap-2 mb-5">
                        <Badge className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/25">
                          {eventTypeLabels[event.type]}
                        </Badge>
                        <Badge className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/25">
                          {getEventDisplayStatusLabel(event)}
                        </Badge>
                      </div>
                      <div className="space-y-3 text-sm md:text-base">
                        <div className="flex items-center gap-2.5">
                          <Calendar className="h-5 w-5 shrink-0 opacity-90" />
                          <span>{formatEventDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <MapPin className="h-5 w-5 shrink-0 opacity-90" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 flex flex-col justify-center min-w-0">
                      <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-snug">
                        {event.title}
                      </h3>
                      <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                      <ContentCardActions
                        className="mt-6"
                        size="lg"
                        extraDetail={event.detailDescription}
                        externalLink={event.link}
                        applyLabel="Kayıt Ol"
                        canApply={canRegisterForEvent(event)}
                        onDetail={() => openDetail(event)}
                        onApply={() => openApply(event)}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section
          id="etkinlik-listesi"
          className={`scroll-mt-20 ${showHighlight ? 'pb-16 md:pb-24' : 'section-padding'}`}
        >
          <div className="container-wide">
            <div
              className={
                showHighlight
                  ? 'rounded-2xl border border-border bg-card shadow-sm overflow-hidden'
                  : ''
              }
            >
              <div className={showHighlight ? 'px-6 md:px-10 pt-8 md:pt-10 pb-6 border-b border-border/80 bg-muted/20' : 'mb-8'}>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                  Tüm Etkinlikler
                </h2>
              </div>

              <div className={showHighlight ? 'px-6 md:px-10 py-8 md:py-10' : ''}>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="tabs-scroll mb-8 md:mb-10">
                    <TabsList className="tabs-scroll-list bg-muted/80 p-1.5 md:w-full md:justify-start">
                      {eventTypes.map((type) => (
                        <TabsTrigger
                          key={type.value}
                          value={type.value}
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 sm:px-4 py-2 text-xs sm:text-sm shrink-0"
                        >
                          {type.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  <TabsContent value={activeTab} className="mt-0">
                    {loadError ? (
                      <div className="text-center py-12 text-destructive">{loadError}</div>
                    ) : loading ? (
                      <div className="text-center py-12 text-muted-foreground">Yükleniyor...</div>
                    ) : !hasAnyEvents ? (
                      <ComingSoonEmpty />
                    ) : filteredEvents.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        Bu kategoride etkinlik bulunamadı.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-5 md:gap-6">
                        {filteredEvents.map((event) => (
                          <EventCard
                            key={event.id}
                            event={event}
                            onDetail={() => openDetail(event)}
                            onApply={() => openApply(event)}
                            canRegister={canRegisterForEvent(event)}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ExtraDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={detailTitle}
        description={detailText}
      />
      <ApplicationFormDialog open={applyOpen} onOpenChange={setApplyOpen} config={applyConfig} />
    </div>
  );
}

function EventCard({
  event,
  onDetail,
  onApply,
  canRegister,
}: {
  event: Event;
  onDetail: () => void;
  onApply: () => void;
  canRegister: boolean;
}) {
  const displayStatus = getEventDisplayStatus(event);
  const displayLabel = getEventDisplayStatusLabel(event);
  const isDimmed = displayStatus === 'completed' || displayStatus === 'cancelled';

  return (
    <article
      className={`flex flex-col md:flex-row md:items-start gap-5 md:gap-8 rounded-xl border border-border bg-background p-6 md:p-8 transition-shadow hover:shadow-md ${isDimmed ? 'opacity-85 border-muted-foreground/20' : ''
        }`}
    >
      <div className="md:w-44 lg:w-52 shrink-0 space-y-3">
        <div className="flex flex-wrap gap-2">
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
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-primary/70" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground leading-snug">
          {event.title}
        </h3>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">{event.description}</p>
        <ContentCardActions
          className="mt-4"
          extraDetail={event.detailDescription}
          externalLink={event.link}
          applyLabel="Kayıt Ol"
          canApply={canRegister && !isDimmed}
          onDetail={onDetail}
          onApply={onApply}
        />
      </div>
    </article>
  );
}
