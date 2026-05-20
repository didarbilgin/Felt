import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/mock-api';

type AboutItem = {
  number?: string;
  title: string;
  content: string;
};

type AboutSection = {
  id: number;
  section_key: string;
  title: string;
  content?: string | null;
  items?: AboutItem[] | null;
  sort_order: number;
  is_active: boolean;
};

const getNumberValue = (value?: string) => {
  if (!value) return Number.MAX_SAFE_INTEGER;

  return Number(
    value
      .split('.')
      .map((part) => part.padStart(3, '0'))
      .join('')
  );
};

const sortItemsByNumber = (items?: AboutItem[] | null) => {
  return [...(items || [])].sort(
    (a, b) => getNumberValue(a.number) - getNumberValue(b.number)
  );
};

export default function About() {
  const [activeSection, setActiveSection] = useState('founder');
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSections = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/about-sections`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setSections(data);
        } else if (Array.isArray(data.items)) {
          setSections(data.items);
        } else {
          setSections([]);
        }
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

  const activeSections = sections
    .filter((section) => section.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  const getSection = (key: string) =>
    activeSections.find((section) => section.section_key === key);

  const founder = getSection('founder');
  const whatIsFelt = getSection('what-is-felt');
  const manifesto = getSection('manifesto');
  const values = getSection('values');
  const roadmap = getSection('roadmap');
  const researchAreas = getSection('research-areas');

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

  const renderMainTitle = (section: AboutSection) => (
    <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
      <span className="text-primary mr-2">{section.sort_order}.</span>
      {section.title}
    </h2>
  );

  const showSidebarSubNumber = (sectionKey: string) =>
    sectionKey === 'what-is-felt';

  const renderSidebarItem = (section: AboutSection) => {
    const items = sortItemsByNumber(section.items);
    const isActive = activeSection === section.section_key;

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
            {section.sort_order}. {section.title}
          </span>
        </button>

        {section.section_key === 'what-is-felt' && items.length > 0 && (
          <div className="ml-4 mt-2 space-y-1">
            {items.map((item, index) => {
              const itemId = `${section.section_key}-item-${index}`;

              return (
                <button
                  key={itemId}
                  onClick={() => scrollToSection(itemId)}
                  className="block w-full text-left rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {showSidebarSubNumber(section.section_key) &&
                    item.number && (
                      <span className="font-medium text-primary mr-1">
                        {item.number}
                      </span>
                    )}
                  {item.title}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <section className="bg-primary text-primary-foreground py-16 md:py-20">
          <div className="container-wide">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">
              Hakkında
            </h1>
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
      {/* Page Header */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container-wide">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">
            Hakkında
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl">
            FELT'in hikayesi, vizyonu ve geleceğe yönelik stratejik hedefleri
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Sidebar Navigation */}
            <aside className="lg:w-80 flex-shrink-0">
              <nav className="sticky top-24 space-y-3">
                {activeSections.map((section) => renderSidebarItem(section))}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
              {/* Founder's Message */}
              {founder && (
                <section id="founder" className="mb-16 scroll-mt-24">
                  {renderMainTitle(founder)}

                  <div className="prose prose-lg max-w-none">
                    {sortItemsByNumber(founder.items).map((item, index) => (
                      <div
                        key={index}
                        id={`founder-item-${index}`}
                        className="scroll-mt-24"
                      >
                        {item.title && item.title !== founder.title && (
                          <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                            {item.title}
                          </h3>
                        )}

                        {renderParagraphs(item.content)}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* What is FELT */}
              {whatIsFelt && (
                <section id="what-is-felt" className="mb-16 scroll-mt-24">
                  {renderMainTitle(whatIsFelt)}

                  <div className="space-y-6">
                    {sortItemsByNumber(whatIsFelt.items).map((item, index) => (
                      <div
                        key={index}
                        id={`what-is-felt-item-${index}`}
                        className="p-6 bg-muted rounded-lg scroll-mt-24"
                      >
                        <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2">
                          {item.title}
                        </h3>

                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Manifesto */}
              {manifesto && (
                <section id="manifesto" className="mb-16 scroll-mt-24">
                  {renderMainTitle(manifesto)}

                  {sortItemsByNumber(manifesto.items)[0] && (
                    <div
                      id="manifesto-item-0"
                      className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg scroll-mt-24"
                    >
                      <p className="text-foreground italic text-base leading-relaxed">
                        "{sortItemsByNumber(manifesto.items)[0].content}"
                      </p>
                    </div>
                  )}

                  <div className="mt-6 space-y-4 text-muted-foreground">
                    {sortItemsByNumber(manifesto.items)
                      .slice(1)
                      .map((item, index) => (
                        <div
                          key={index}
                          id={`manifesto-item-${index + 1}`}
                          className="scroll-mt-24"
                        >
                          <p>{item.content}</p>
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {/* Values */}
              {values && (
                <section id="values" className="mb-16 scroll-mt-24">
                  {renderMainTitle(values)}

                  <div className="grid sm:grid-cols-2 gap-4">
                    {sortItemsByNumber(values.items).map((item, index) => (
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
              )}

              {/* Roadmap */}
              {roadmap && (
                <section id="roadmap" className="mb-16 scroll-mt-24">
                  {renderMainTitle(roadmap)}

                  <div className="space-y-4">
                    {sortItemsByNumber(roadmap.items).map((item, index) => (
                      <div
                        key={index}
                        id={`roadmap-item-${index}`}
                        className="flex gap-4 scroll-mt-24"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {item.title.slice(-2)}
                          </div>

                          {index < sortItemsByNumber(roadmap.items).length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-2" />
                          )}
                        </div>

                        <div className="pb-8">
                          <span className="font-heading text-xl md:text-2xl font-bold text-primary block mb-1">
                            {item.title}
                          </span>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Research Areas */}
              {researchAreas && (
                <section id="research-areas" className="scroll-mt-24">
                  {renderMainTitle(researchAreas)}

                  <div className="grid sm:grid-cols-2 gap-4">
                    {sortItemsByNumber(researchAreas.items).map((item, index) => (
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
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}