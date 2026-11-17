import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Live examples", href: "/#live-examples" },
    { label: "What's inside", href: "/#features" },
    { label: "How it works", href: "/#how-it-works" },
  ],
  Explore: [
    { label: "Wedding invitations", href: "/wedding-invitations" },
    { label: "Malayalam invitations", href: "/wedding-invitations/malayalam" },
    { label: "Kerala invitations", href: "/wedding-invitations/kerala" },
    { label: "Hindu e-invites", href: "/wedding-invitations/hindu" },
    {
      label: "Digital vs printed",
      href: "/compare/digital-vs-printed-wedding-invitations",
    },
    { label: "Blog", href: "/blog" },
  ],
  Guides: [
    {
      label: "How to make a digital invite",
      href: "/blog/how-to-make-a-digital-wedding-invitation-on-phone",
    },
    {
      label: "WhatsApp message format",
      href: "/blog/whatsapp-wedding-invitation-message-format",
    },
    {
      label: "When to send the invite",
      href: "/blog/when-to-send-digital-wedding-invitation-whatsapp",
    },
    {
      label: "Broadcast vs group",
      href: "/blog/whatsapp-broadcast-vs-group-wedding-invite",
    },
    {
      label: "Malayalam wording",
      href: "/blog/malayalam-wedding-invitation-wording",
    },
    {
      label: "Digital invite for elders",
      href: "/blog/is-digital-wedding-invitation-ok-for-elders",
    },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Sitemap", href: "/sitemap.xml" },
    { label: "llms.txt", href: "/llms.txt" },
  ],
};

const Footer = () => (
  <footer className="relative z-[2] border-t border-border/70 bg-background/40 py-16 backdrop-blur-sm">
    <div className="container mx-auto px-6">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-10">
        <div className="lg:col-span-1">
          <Link
            href="/"
            className="font-display text-[1.75rem] font-light tracking-[-0.03em] text-foreground"
          >
            Invyto
          </Link>
          <div
            className="mt-4 h-px w-12 bg-gradient-to-r from-primary/70 to-transparent"
            aria-hidden
          />
          <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-muted-foreground">
            Digital wedding invitations for India — one WhatsApp link with
            dates, venue map, timings and your story.
          </p>
        </div>
        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group}>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-primary/90">
              {group}
            </p>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/70 pt-6 md:flex-row">
        <p className="text-xs font-light text-muted-foreground">
          © {new Date().getFullYear()} Invyto. All rights reserved.
        </p>
        <p className="font-display text-xs italic text-muted-foreground">
          Digital wedding invitations for WhatsApp.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
