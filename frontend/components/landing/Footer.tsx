import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "What's inside", href: "/#features" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Live examples", href: "/#live-examples" },
    { label: "Pricing", href: "/pricing" },
  ],
  Explore: [
    { label: "Malayalam invitations", href: "/wedding-invitations/malayalam" },
    { label: "Kerala invitations", href: "/wedding-invitations/kerala" },
    { label: "Hindu e-invites", href: "/wedding-invitations/hindu" },
    {
      label: "Digital vs printed",
      href: "/compare/digital-vs-printed-wedding-invitations",
    },
    { label: "Blog", href: "/blog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

const Footer = () => (
  <footer className="border-t border-border bg-muted/10 py-16 relative z-[2]">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-10">
        <div>
          <Link
            href="/"
            className="font-display text-2xl font-semibold text-gradient-gold"
          >
            Invyto
          </Link>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Invyto is an India-based platform for creating digital wedding
            invitations that you share as a single link on WhatsApp.
          </p>
        </div>
        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group}>
            <h4 className="font-semibold text-foreground text-sm mb-4">
              {group}
            </h4>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-14 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Invyto. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground italic font-display">
          Digital wedding invitations for WhatsApp.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
