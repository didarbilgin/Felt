type PageHeroProps = {
  title: string;
  subtitle?: string;
};

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-20">
      <div className="container-wide">
        <h1 className="font-heading text-4xl md:text-5xl font-bold">{title}</h1>
        {subtitle ? (
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
