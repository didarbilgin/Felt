type PageHeroProps = {
  title: string;
  subtitle?: string;
};

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-20">
      <div className="container-wide">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold break-words">{title}</h1>
        {subtitle ? (
          <p className="mt-4 text-base sm:text-lg text-primary-foreground/80 max-w-2xl break-words">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
