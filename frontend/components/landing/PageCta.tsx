import Link from "next/link";

const proseLink =
  "text-primary underline-offset-4 transition hover:text-foreground hover:underline";

export function PageLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={proseLink}>
      {children}
    </Link>
  );
}

export function PageAside({
  title = "Create yours with Invyto",
  body = "Message us on WhatsApp with your dates, venue and a few photos — we craft a digital wedding invitation you can share as one link.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <aside className="mt-14 border-t border-border pt-10">
      <p className="font-display text-2xl font-light tracking-[-0.02em] text-foreground">
        {title}
      </p>
      <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-muted-foreground">
        {body}
      </p>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/contact" className={`${proseLink} font-medium`}>
          Contact us
        </Link>
        <Link href="/#live-examples" className={`${proseLink} font-medium`}>
          See live examples
        </Link>
      </div>
    </aside>
  );
}

export const articleProse =
  "mt-10 space-y-5 text-[15px] font-light leading-[1.75] text-muted-foreground [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-[1.65rem] [&_h2]:font-light [&_h2]:tracking-[-0.02em] [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_strong]:font-medium [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline";
