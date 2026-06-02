type HomeManifestoProps = {
  quote: string;
  subtitle?: string | null;
};

export function HomeManifesto({ quote, subtitle }: HomeManifestoProps) {
  const text = quote.replace(/^[“"']|[”"']$/g, '').trim();

  return (
    <section aria-label="Manifesto" className="relative border-y border-border/70 overflow-hidden">
      <div className="absolute inset-0 bg-primary/[0.04]" aria-hidden />
      <div className="container-wide relative py-14 md:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Manifesto
            </p>
            <div className="mt-6 hidden lg:block h-px w-14 bg-border" aria-hidden />
          </div>
          <div className="lg:col-span-8">
            <blockquote className="font-heading text-2xl md:text-[1.85rem] lg:text-[2rem] font-bold text-foreground leading-[1.25] tracking-tight">
              &ldquo;{text}&rdquo;
            </blockquote>
            {subtitle ? (
              <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
