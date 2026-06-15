import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { FOUNDER_CV_DEFAULT } from '@/lib/aboutDefaults';
import { buildDisplayOrderMap, formatSubsectionNumber } from '@/lib/cms/sectionOrder';
import { compareSortOrder } from '@/lib/cms/sortOrder';
import { aboutSectionsApi, type AboutSection } from '@/lib/api/aboutSections';

export default function About() {
  const [activeSection, setActiveSection] = useState('founder');
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = await aboutSectionsApi.listPublic();
        setSections(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('About sections load error:', error);
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    loadSections();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const orderedSections = useMemo(() => {
    const active = sections
      .filter((section) => section.is_active)
      .sort(compareSortOrder);

    if (!active.some((s) => s.section_key === 'founder-cv')) {
      active.push({
        id: 0,
        section_key: FOUNDER_CV_DEFAULT.section_key,
        title: FOUNDER_CV_DEFAULT.title,
        content: FOUNDER_CV_DEFAULT.content,
        items: null,
        sort_order: FOUNDER_CV_DEFAULT.sort_order,
        is_active: true,
      });
      active.sort(compareSortOrder);
    }

    return active;
  }, [sections]);

  const displayOrder = useMemo(
    () => buildDisplayOrderMap(orderedSections, (s) => s.section_key),
    [orderedSections]
  );

  const getDisplayOrder = (sectionKey: string) =>
    displayOrder.get(sectionKey) ?? orderedSections.find((s) => s.section_key === sectionKey)?.sort_order ?? 0;

  const renderParagraphs = (text?: string) => {
    if (!text) return null;

    return text
      .split('\n')
      .filter(Boolean)
      .map((paragraph, index) => (
        <p
          key={index}
          className={cn(
            'text-muted-foreground leading-relaxed',
            index > 0 && 'mt-4'
          )}
        >
          {paragraph}
        </p>
      ));
  };

  const renderMainTitle = (section: AboutSection) => {
    const order = getDisplayOrder(section.section_key);
    return (
      <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
        <span className="text-primary mr-2">{order}.</span>
        {section.title}
      </h2>
    );
  };

  const renderSidebarItem = (section: AboutSection) => {
    const items = section.items ?? [];
    const order = getDisplayOrder(section.section_key);
    const isActive = activeSection === section.section_key;
    const showSubItems = section.section_key === 'what-is-felt' && items.length > 0;

    return (
      <div key={section.section_key}>
        <button
          onClick={() => scrollToSection(section.section_key)}
          className={cn(
            'w-full text-left px-4 py-2.5 rounded-md transition-colors',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <span className="font-heading text-base md:text-lg font-semibold tracking-tight">
            {order}. {section.title}
          </span>
        </button>

        {showSubItems && (
          <div className="ml-4 mt-2 space-y-1">
            {items.map((item, index) => {
              const itemId = `${section.section_key}-item-${index}`;

              return (
                <button
                  key={itemId}
                  onClick={() => scrollToSection(itemId)}
                  className="block w-full text-left rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <span className="font-medium text-primary mr-1">
                    {formatSubsectionNumber(order, index)}
                  </span>
                  {item.title}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const sectionBottomSpacing = (sectionKey: string, next?: AboutSection) => {
    const extraGapBeforeSibling =
      (sectionKey === 'research-areas' && next?.section_key === 'roadmap') ||
      (sectionKey === 'roadmap' && next?.section_key === 'research-areas');
    return extraGapBeforeSibling ? 'mb-24 md:mb-32' : 'mb-16';
  };

  const renderSectionBody = (
    section: AboutSection,
    _prev?: AboutSection,
    next?: AboutSection
  ) => {
    const items = section.items ?? [];
    const order = getDisplayOrder(section.section_key);
    const spacing = sectionBottomSpacing(section.section_key, next);

    switch (section.section_key) {
      case 'founder':
        return (
          <section id="founder" className={cn(spacing, 'scroll-mt-24')}>
            {renderMainTitle(section)}
            <div className="prose prose-lg max-w-none">
              {items.map((item, index) => (
                <div key={index} id={`founder-item-${index}`} className="scroll-mt-24">
                  {item.title && item.title !== section.title && (
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                      {item.title}
                    </h3>
                  )}
                  {renderParagraphs(item.content)}
                </div>
              ))}
            </div>
          </section>
        );

      case 'founder-cv':
        return (
          <section id="founder-cv" className={cn(spacing, 'scroll-mt-24')}>
            {renderMainTitle(section)}
            <div className="p-6 md:p-8 bg-muted rounded-lg">
              <div className="prose prose-lg max-w-none text-muted-foreground text-sm leading-relaxed space-y-4">
                {renderParagraphs(section.content || undefined)}
              </div>
            </div>
          </section>
        );

      case 'what-is-felt':
        return (
          <section id="what-is-felt" className={cn(spacing, 'scroll-mt-24')}>
            {renderMainTitle(section)}
            <div className="space-y-6">
              {items.map((item, index) => (
                <div
                  key={index}
                  id={`what-is-felt-item-${index}`}
                  className="p-6 bg-muted rounded-lg scroll-mt-24"
                >
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2">
                    <span className="text-primary mr-2">
                      {formatSubsectionNumber(order, index)}
                    </span>
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'manifesto':
        return (
          <section id="manifesto" className={cn(spacing, 'scroll-mt-24')}>
            {renderMainTitle(section)}
            {items[0] && (
              <div
                id="manifesto-item-0"
                className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg scroll-mt-24"
              >
                <p className="text-foreground italic text-base leading-relaxed">
                  &ldquo;{items[0].content}&rdquo;
                </p>
              </div>
            )}
            <div className="mt-6 space-y-4 text-muted-foreground">
              {items.slice(1).map((item, index) => (
                <div key={index} id={`manifesto-item-${index + 1}`} className="scroll-mt-24">
                  <p>{item.content}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'values':
        return (
          <section id="values" className={cn(spacing, 'scroll-mt-24')}>
            {renderMainTitle(section)}
            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  id={`values-item-${index}`}
                  className="p-6 border border-border rounded-lg bg-card scroll-mt-24"
                >
                  <h3 className="font-heading text-lg md:text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'roadmap':
        return (
          <section id="roadmap" className={cn(spacing, 'scroll-mt-24')}>
            {renderMainTitle(section)}
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} id={`roadmap-item-${index}`} className="flex gap-4 scroll-mt-24">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {item.title.slice(-2)}
                    </div>
                    {index < items.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="font-heading text-xl md:text-2xl font-bold text-primary block mb-1">
                      {item.title}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'research-areas':
        return (
          <section id="research-areas" className={cn(spacing, 'scroll-mt-24')}>
            {renderMainTitle(section)}
            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  id={`research-areas-item-${index}`}
                  className="p-6 border border-border rounded-lg bg-card scroll-mt-24"
                >
                  <h3 className="font-heading text-lg md:text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div>
        <section className="bg-primary text-primary-foreground py-16 md:py-20">
          <div className="container-wide">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Hakkında</h1>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl">
              FELT'in hikayesi, vizyonu ve geleceğe yönelik stratejik hedefleri
            </p>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-wide">
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container-wide">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Hakkında</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl">
            FELT'in hikayesi, vizyonu ve geleceğe yönelik stratejik hedefleri
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <aside className="lg:w-80 flex-shrink-0">
              <nav className="sticky top-24 space-y-3">
                {orderedSections.map((section) => renderSidebarItem(section))}
              </nav>
            </aside>

            <div className="flex-1 max-w-4xl">
              {orderedSections.map((section, index) =>
                renderSectionBody(
                  section,
                  orderedSections[index - 1],
                  orderedSections[index + 1]
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}