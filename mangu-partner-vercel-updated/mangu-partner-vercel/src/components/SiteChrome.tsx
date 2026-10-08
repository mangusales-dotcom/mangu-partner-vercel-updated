import { Link } from "@tanstack/react-router";
import { Home, BookOpen, Phone, Star, MessageCircle, Mail, MapPin, Clock, Globe } from "lucide-react";
import { brand, waLink } from "@/config/brand";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/story", label: "Our Story", icon: BookOpen },
  { to: "/contact", label: "Contact", icon: Phone },
  { to: "/review", label: "Review", icon: Star },
] as const;

export function Logo({ className = "h-11" }: { className?: string }) {
  return <img src="/logo.png" alt={brand.name} width={553} height={351} className={`${className} w-auto`} />;
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
      <div className="roof-bar" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Link to="/" aria-label="Home"><Logo /></Link>
        <nav className="hidden gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-lg px-4 py-2 font-bold text-ink hover:bg-muted" activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <a href={`tel:${brand.phoneTel}`} className="hidden font-bold text-secondary sm:block md:hidden lg:block">{brand.phoneDisplay}</a>
      </div>
    </header>
  );
}

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Main">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link key={to} to={to} activeOptions={{ exact: true }} className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-bold text-muted-foreground"
          activeProps={{ className: "text-primary" }}>
          <Icon className="h-6 w-6" aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function WhatsAppButton() {
  return (
    <a href={waLink()} target="_blank" rel="noopener" aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-success text-primary-foreground shadow-lg transition active:scale-95 md:bottom-6">
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

const SOCIALS: { key: keyof typeof brand.socials; label: string }[] = [
  { key: "website", label: "Website" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "tiktok", label: "TikTok" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "googleBusiness", label: "Google" },
];

export function SocialLinks({ tone = "light" }: { tone?: "light" | "dark" }) {
  const cls = tone === "dark" ? "border-ink-foreground/30 text-ink-foreground" : "border-secondary text-secondary";
  return (
    <div className="flex flex-wrap gap-2">
      {SOCIALS.map((s) => (
        <a key={s.key} href={brand.socials[s.key]} target="_blank" rel="noopener" className={`inline-flex min-h-11 items-center gap-1 rounded-full border-2 px-4 text-sm font-bold ${cls}`}>
          <Globe className="h-4 w-4" aria-hidden /> {s.label}
        </a>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="road-lines mt-16 bg-ink pb-24 text-ink-foreground md:pb-8">
      <div className="roof-bar" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <div className="inline-block rounded-xl bg-card p-2"><Logo className="h-12" /></div>
          <p className="opacity-90">{brand.promise}</p>
          <p className="font-bold">Genuine Isuzu parts since {brand.established}</p>
        </div>
        <ul className="space-y-3">
          <li className="flex gap-2"><MapPin className="h-5 w-5 shrink-0" /> {brand.address}</li>
          <li><a className="flex gap-2 font-bold underline" href={`tel:${brand.phoneTel}`}><Phone className="h-5 w-5" /> {brand.phoneDisplay}</a></li>
          <li><a className="flex gap-2 underline" href={waLink()} target="_blank" rel="noopener"><MessageCircle className="h-5 w-5" /> WhatsApp us</a></li>
          <li><a className="flex gap-2 underline" href={`mailto:${brand.email}`}><Mail className="h-5 w-5" /> {brand.email}</a></li>
          {brand.hours.map((h) => <li key={h.days} className="flex gap-2"><Clock className="h-5 w-5" /> {h.days}: {h.time}</li>)}
        </ul>
        <div className="space-y-4">
          <SocialLinks tone="dark" />
          <Link to="/privacy" className="block underline">Privacy note</Link>
        </div>
      </div>
      <p className="px-4 text-center text-sm opacity-70">© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
    </footer>
  );
}
