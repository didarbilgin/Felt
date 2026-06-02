type EcosystemIntroProps = {
  title: string;
  intro: string;
};

/** Splits long intro into lead + body for editorial hierarchy. */
function splitIntro(intro: string): { lead: string; body: string } {
  const trimmed = intro.trim();
  const breakAt = trimmed.search(/[.!?]\s/);
  if (breakAt > 0 && breakAt < 200) {
    return {
      lead: trimmed.slice(0, breakAt + 1),
      body: trimmed.slice(breakAt + 1).trim(),
    };
  }
  const mid = Math.ceil(trimmed.length / 2);
  const space = trimmed.indexOf(' ', mid);
  if (space > 0) {
    return {
      lead: trimmed.slice(0, space),
      body: trimmed.slice(space).trim(),
    };
  }
  return { lead: trimmed, body: '' };
}

export function EcosystemIntro({ title, intro }: EcosystemIntroProps) {
  const { lead, body } = splitIntro(intro);

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-6">
        Araştırma ekosistemi
      </p>
      <div className="grid md:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-start">
        <div className="md:col-span-5 lg:col-span-4">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.12]">
            {title}
          </h2>
        </div>
        <div className="md:col-span-7 lg:col-span-8 md:pt-1">
          <p className="font-heading text-xl md:text-2xl text-foreground leading-snug">{lead}</p>
          {body ? (
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-[1.75]">
              {body}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
