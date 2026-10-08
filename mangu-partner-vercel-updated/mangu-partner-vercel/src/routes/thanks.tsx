import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageCircle, Home, Phone, MapPin, WifiOff } from "lucide-react";
import { brand, waLink } from "@/config/brand";
import { getThanks, type ThanksState } from "@/lib/submit";

export const Route = createFileRoute("/thanks")({
  head: () => ({
    meta: [
      { title: "Welcome, Partner — Mangu Auto" },
      { name: "description", content: "Thank you for joining the Mangu Auto Partner Programme." },
      { property: "og:title", content: "Welcome, Partner — Mangu Auto" },
      { property: "og:description", content: "Thank you for joining the Mangu Auto Partner Programme." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Thanks,
});

const CONFETTI_COLORS = ["var(--primary)", "var(--secondary)", "var(--brand-sky)", "var(--ink)"];

function Confetti() {
  const [show, setShow] = useState(true);
  useEffect(() => { const t = setTimeout(() => setShow(false), 2600); return () => clearTimeout(t); }, []);
  if (!show) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <span key={i} className="absolute top-0 block h-3 w-2 rounded-sm"
          style={{ left: `${(i * 37) % 100}%`, background: CONFETTI_COLORS[i % 4], animation: `confetti-fall ${1.6 + (i % 5) * 0.2}s ease-in ${(i % 8) * 0.06}s both` }} />
      ))}
    </div>
  );
}

function Handshake() {
  return (
    <svg viewBox="0 0 200 120" className="mx-auto h-36 w-auto" fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path className="animate-draw" stroke="var(--primary)" d="M10 50 L50 40 L80 55 L100 50 M50 40 L70 75 Q78 85 88 78 L120 60" />
      <path className="animate-draw" stroke="var(--secondary)" style={{ animationDelay: ".3s" }} d="M190 50 L150 40 L115 45 L95 62 Q90 72 100 74 L125 62 M150 40 L135 85 Q128 95 118 88 L100 76 M128 92 Q120 102 110 96" />
    </svg>
  );
}

function Thanks() {
  const navigate = useNavigate();
  const [s, setS] = useState<ThanksState | null | undefined>(undefined);
  useEffect(() => {
    const v = getThanks();
    if (!v) navigate({ to: "/", replace: true });
    else setS(v);
  }, [navigate]);
  if (!s) return <div className="min-h-[70vh]" />;

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col justify-center px-4 py-10 text-center">
      <Confetti />
      <Handshake />
      <h1 className="animate-fade-up mt-6 text-3xl font-black sm:text-5xl">
        {s.type === "fleet"
          ? <>Thank you, {s.firstName}. {s.company} is now a Mangu Auto Fleet Partner.</>
          : <>Thank you, {s.firstName}. You are now a Mangu Auto partner.</>}
      </h1>
      <p className="animate-fade-up mt-5 text-lg">
        We are two partners who need each other. You keep trucks moving, we keep you stocked with genuine Isuzu parts. We look forward to doing business with you.
      </p>
      {s.offline && (
        <p className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-accent p-3 font-bold text-accent-foreground">
          <WifiOff className="h-5 w-5" /> Saved on your phone. It will send when you are online.
        </p>
      )}
      <div className="card-surface mt-8 space-y-3 p-5 text-left">
        <h2 className="text-xl font-black">Next steps</h2>
        <p className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-primary" /> We will contact you soon.</p>
        <p className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-primary" /> Visit us at {brand.addressShort}.</p>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a href={waLink()} target="_blank" rel="noopener" className="btn-primary"><MessageCircle className="h-5 w-5" /> WhatsApp us</a>
        <Link to="/" className="btn-secondary"><Home className="h-5 w-5" /> Back to home</Link>
      </div>
      <Link to="/review" className="mt-6 font-semibold text-secondary underline">If you have a minute, please review us on Google</Link>
    </div>
  );
}
