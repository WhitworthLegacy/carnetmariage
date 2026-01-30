import Link from "next/link";

const footerSections = [
  {
    title: "Produit",
    links: [
      { href: "/#fonctionnalites", label: "Fonctionnalités" },
      { href: "/tarifs", label: "Tarifs" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/#faq", label: "FAQ" },
      { href: "/contact", label: "Aide" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/mentions-legales#confidentialite", label: "Confidentialité" },
      { href: "/mentions-legales#cgv", label: "CGV" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-xl text-ink tracking-tight">
                Carnet<span className="text-pink-dark">Mariage</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">Organise ton mariage en douceur.</p>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-ink mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-brand-border">
          <p className="text-xs text-muted-light text-center">
            &copy; 2026 CarnetMariage. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
