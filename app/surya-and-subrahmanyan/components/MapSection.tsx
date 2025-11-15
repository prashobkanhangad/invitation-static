const mapLink = "https://maps.app.goo.gl/JY2NPgnmfwb9epda7?g_st=ipc";
const embedUrl = "https://www.google.com/maps?q=Sreeprabha+Auditorium+Payyannur&output=embed";

export const MapSection = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-muted/40 to-background">
      <div className="max-w-5xl mx-auto space-y-8 text-center">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-primary">Venue</p>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">Sreeprabha Auditorium</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Payyannur, Kerala · Tap below to open directions
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl shadow-2xl border border-border/40">
          <iframe
            title="Sreeprabha Auditorium Location"
            src={embedUrl}
            width="100%"
            height="420"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>

        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
        >
          Open in Google Maps
        </a>
      </div>
    </section>
  );
};
