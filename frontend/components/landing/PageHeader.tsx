import Link from "next/link";

type Crumb = { href: string; label: string };

export default function PageHeader({
  title,
  lead,
  crumbs,
  center = false,
}: {
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  center?: boolean;
}) {
  return (
    <header className={center ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}>
      {crumbs && crumbs.length > 0 ? (
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
          {crumbs.map((c, i) => (
            <span key={c.href}>
              {i > 0 ? <span className="mx-2 text-muted-foreground/50">/</span> : null}
              <Link href={c.href} className="transition hover:text-foreground">
                {c.label}
              </Link>
            </span>
          ))}
        </p>
      ) : null}

      <h1
        className={`font-display font-light leading-[1.05] tracking-[-0.03em] text-foreground text-balance ${
          crumbs?.length ? "mt-5" : ""
        } text-[clamp(2.35rem,5vw,3.75rem)]`}
      >
        {title}
      </h1>

      <div
        className={`mt-5 h-px w-14 bg-gradient-to-r from-primary/80 to-transparent ${
          center ? "mx-auto" : ""
        }`}
        aria-hidden
      />

      {lead ? (
        <p
          className={`mt-6 text-[17px] font-light leading-[1.7] text-muted-foreground ${
            center ? "mx-auto max-w-xl" : "max-w-2xl"
          }`}
        >
          {lead}
        </p>
      ) : null}
    </header>
  );
}
