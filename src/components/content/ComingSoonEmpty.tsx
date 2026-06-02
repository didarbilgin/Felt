type ComingSoonEmptyProps = {
  message?: string;
};

export function ComingSoonEmpty({ message = 'Yakında...' }: ComingSoonEmptyProps) {
  return (
    <div className="text-center py-16 md:py-24">
      <p className="font-heading text-2xl md:text-3xl text-muted-foreground">{message}</p>
    </div>
  );
}
