const footerLinks = {
  Product: ["Features", "Pricing", "Templates", "API"],
  Company: ["About", "Blog", "Careers", "Press"],
  Support: ["Help Center", "Contact", "Privacy", "Terms"],
};

const Footer = () => (
  <footer className="border-t border-border bg-muted/10 py-16 relative z-[2]">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-10">
        <div>
          <span className="font-display text-2xl font-semibold text-gradient-gold">Invyto</span>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Beautiful digital invitations and AI-powered photo delivery for modern celebrations.
          </p>
          <div className="mt-6 flex gap-4">
            {["X", "In", "Ig"].map((s) => (
              <div
                key={s}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group}>
            <h4 className="font-semibold text-foreground text-sm mb-4">{group}</h4>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-14 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">© 2025 Invyto. All rights reserved.</p>
        <p className="text-xs text-muted-foreground italic font-display">Celebrate beautifully.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
