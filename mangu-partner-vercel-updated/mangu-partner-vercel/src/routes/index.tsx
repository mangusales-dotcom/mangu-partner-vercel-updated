import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wrench, Truck, ShieldCheck, Award, CalendarClock, Gift, Repeat, Target, Search, Droplet, Cog, CheckCircle2, UserPlus, ShoppingCart, TrendingUp } from "lucide-react";
import { brand, formatKES } from "@/config/brand";
import { Logo } from "@/components/SiteChrome";
import { MechanicForm, FleetForm } from "@/components/forms/Wizards";

const title = "Mangu Auto Partner Programme";
const desc = "Mechanics and fleet owners: join the Mangu Auto Partner Programme. Genuine Isuzu parts since 1990, and monthly partner rewards.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
    ],
  }),
  component: Home,
});

type Kind = "mechanic" | "fleet" | null;

function Home() {
  const [kind, setKind] = useState<Kind>(null);
  const choose = (k: Exclude<Kind, null>) => {
    setKind(k);
    setTimeout(() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }), 50);
  };
  const r = brand.reward;

  return (
    <>
      {/* HERO */}
      <section className="road-lines relative overflow-hidden bg-ink text-ink-foreground">
        <Cog aria-hidden className="animate-spin-slow pointer-events-none absolute -right-16 -top-16 h-72 w-72 text-ink-foreground/10" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-20">
          <div className="animate-fade-up mb-6 inline-block rounded-2xl bg-card p-3"><Logo className="h-14 sm:h-16" /></div>
          <p className="animate-fade-up mb-3 inline-block rounded-full bg-primary px-3 py-1 text-sm font-bold">
            {brand.activation.dates} · {brand.activation.venue}
          </p>
          <h1 className="animate-fade-up max-w-3xl text-4xl font-black text-ink-foreground sm:text-6xl">
            Welcome, Partner. <span className="text-primary">Let us grow together.</span>
          </h1>
          <p className="animate-fade-up mt-4 max-w-xl text-lg opacity-90 sm:text-xl">
            Join the {brand.programme}. {brand.tagline}
          </p>
          <a href="#who" className="btn-primary animate-fade-up mt-8 w-full sm:w-auto">Join in 2 minutes</a>
        </div>
        <div className="roof-bar" />
      </section>

      {/* CHOOSER */}
      <section id="who" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10">
        <h2 className="mb-5 text-3xl font-black">Who are you?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            ["mechanic", Wrench, "I am a MECHANIC"],
            ["fleet", Truck, "I run a FLEET / TRANSPORT BUSINESS"],
          ] as const).map(([k, Icon, label]) => (
            <button key={k} type="button" onClick={() => choose(k)} aria-pressed={kind === k}
              className={`card-surface flex min-h-28 items-center gap-4 p-5 text-left transition active:scale-[.98] ${kind === k ? "ring-4 ring-primary" : ""}`}>
              <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${kind === k ? "bg-primary text-primary-foreground" : "bg-accent text-secondary"}`}>
                <Icon className="h-9 w-9" />
              </span>
              <span className="font-display text-xl font-black text-ink">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* WHAT */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="card-surface p-6">
          <h2 className="mb-3 text-2xl font-black">What is this activation?</h2>
          <p className="max-w-2xl">We are here to meet mechanics and fleet owners. We want to hear what you need. Then we can stock the right Isuzu parts and diesel oils for you.</p>
        </div>
      </section>

      {/* REWARDS */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="overflow-hidden rounded-3xl bg-secondary text-secondary-foreground">
          <div className="roof-bar" />
          <div className="p-6 sm:p-10">
            <p className="mb-2 font-bold uppercase tracking-wider opacity-90">Monthly Partner Rewards</p>
            <h2 className="text-3xl font-black text-secondary-foreground sm:text-5xl">Reach {formatKES(r.threshold)} a {r.periodWord}. Get rewarded.</h2>
            <p className="mt-4 max-w-2xl text-lg">Every {r.periodWord}, partners whose purchases reach {formatKES(r.threshold)} qualify. The reward is {r.options}. {r.announceNote}</p>
            <p className="mt-3 max-w-2xl text-lg font-bold">{r.example}</p>

            <div className="mt-8 rounded-2xl bg-card p-5 text-card-foreground">
              <div className="mb-2 flex justify-between text-sm font-bold"><span>Example</span><span>{formatKES(r.threshold)}</span></div>
              <div className="relative h-6 overflow-hidden rounded-full bg-muted">
                <div className="animate-fill h-full w-[78%] rounded-full" style={{ background: "var(--gradient-roof)" }} />
              </div>
              <div className="mt-3 flex justify-between text-sm font-semibold text-muted-foreground">
                <span className="flex items-center gap-1"><Cog className="h-4 w-4" /> Clutch</span>
                <span className="flex items-center gap-1"><Droplet className="h-4 w-4" /> Oils</span>
                <span className="flex items-center gap-1 text-primary"><Gift className="h-4 w-4" /> Reward</span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                [Target, `Reach ${formatKES(r.threshold)} in a ${r.periodWord}`, "Buy genuine parts and oils from Mangu Auto."],
                [Gift, "Choose your reward", "Merchandise, or a kickback voucher / gift card."],
                [Repeat, "Repeat every month", "Rewards reset monthly. Start again each month."],
              ].map(([Icon, h, p], i) => {
                const I = Icon as typeof Target;
                return (
                  <div key={i} className="animate-fade-up rounded-2xl bg-card p-5 text-card-foreground" style={{ animationDelay: `${i * 150}ms` }}>
                    <I className="mb-3 h-9 w-9 text-primary" />
                    <h3 className="text-lg font-black">{h as string}</h3>
                    <p className="mt-1 text-muted-foreground">{p as string}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 font-bold">{r.fleetLine}</p>
            <p className="mt-2 text-sm opacity-90">{r.smallPrint}</p>
          </div>
        </div>

        <div className="card-surface mt-6 flex items-start gap-4 p-6">
          <Search className="h-10 w-10 shrink-0 text-primary" />
          <div>
            <h3 className="text-xl font-black">Priority help finding hard-to-get Isuzu parts</h3>
            <p className="mt-1 text-muted-foreground">Partners get our help first when a part is hard to find.</p>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <h2 className="mb-5 text-3xl font-black">How it works</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            [UserPlus, "Register", "Fill the short form below."],
            [ShoppingCart, "Buy genuine parts and oil", "Genuine Isuzu parts and diesel oil from Mangu Auto. For Isuzu trucks and other models."],
            [TrendingUp, "Earn rewards", "We grow together. Fleets get the same partnership."],
          ].map(([Icon, h, p], i) => {
            const I = Icon as typeof UserPlus;
            return (
              <li key={i} className="card-surface p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-black text-primary-foreground">{i + 1}</span>
                  <I className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-lg font-black">{h as string}</h3>
                <p className="mt-1 text-muted-foreground">{p as string}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* FORMS */}
      <section id="register" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-10">
        <h2 className="mb-2 text-3xl font-black">Register as a partner</h2>
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1.5" role="tablist">
          {(["mechanic", "fleet"] as const).map((k) => (
            <button key={k} role="tab" aria-selected={kind === k} onClick={() => setKind(k)}
              className={`min-h-12 rounded-xl font-bold ${kind === k ? "bg-card text-primary shadow" : "text-muted-foreground"}`}>
              {k === "mechanic" ? "Mechanic" : "Fleet / Transport"}
            </button>
          ))}
        </div>
        {kind === null && <p className="card-surface p-6 text-center font-semibold">Please choose Mechanic or Fleet above to start.</p>}
        <div hidden={kind !== "mechanic"}><MechanicForm /></div>
        <div hidden={kind !== "fleet"}><FleetForm /></div>
      </section>

      {/* OFFER + TRUST */}
      <section className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {["Genuine Isuzu parts", "Petrol engine oils", "Diesel engine oils for all vehicles"].map((t) => (
            <div key={t} className="flex items-center gap-3 rounded-2xl bg-primary p-4 font-bold text-primary-foreground"><Droplet className="h-6 w-6 shrink-0" /> {t}</div>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[[ShieldCheck, "Genuine Isuzu parts only"], [Award, brand.dealerLine], [CalendarClock, `Since ${brand.established}`]].map(([I, t]) => {
            const Icon = I as typeof ShieldCheck;
            return <div key={t as string} className="card-surface flex items-center gap-3 p-4 font-bold"><Icon className="h-6 w-6 shrink-0 text-secondary" /> {t as string}</div>;
          })}
        </div>
        <p className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4" /> {brand.address}</p>
      </section>
    </>
  );
}
