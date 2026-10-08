import { createFileRoute } from "@tanstack/react-router";
import { Cog, Settings2, Disc, CircleStop, Filter, Package, Droplet, Fuel, Droplets, ShieldCheck } from "lucide-react";
import { brand } from "@/config/brand";

const title = "Our Story — Mangu Auto & Hardware Ltd";
const desc = "Since 1990, Mangu Auto has supplied genuine Isuzu parts from Kirinyaga Road, Nairobi. Authorised Isuzu East Africa parts dealer.";

export const Route = createFileRoute("/story")({
  head: () => ({ meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }] }),
  component: Story,
});

const icons = [Cog, Settings2, Disc, CircleStop, Filter, Package, Droplet, Fuel, Droplets];

function Story() {
  const steps = [
    [String(brand.established), "Mangu Auto & Hardware Ltd is established."],
    ["Trusted dealer", `${brand.dealerLine}.`],
    ["Genuine only", "We stock only genuine Isuzu parts. Wide stock means good availability."],
    ["Our promise", "We are committed to meeting and exceeding your expectations."],
    ["Today", `We serve mechanics and fleets from ${brand.addressShort}.`],
  ];
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-4xl font-black sm:text-5xl">Our Story</h1>
      <p className="mt-3 text-lg text-muted-foreground">Genuine Isuzu parts since {brand.established}.</p>

      <ol className="relative mt-10 space-y-8 border-l-4 border-secondary pl-8">
        {steps.map(([h, p], i) => (
          <li key={h} className="animate-fade-up relative" style={{ animationDelay: `${i * 120}ms` }}>
            <span className="absolute -left-[46px] top-1 h-6 w-6 rounded-full border-4 border-card bg-primary" />
            <h2 className="text-2xl font-black">{h}</h2>
            <p className="mt-1 text-lg">{p}</p>
          </li>
        ))}
      </ol>

      <div className="card-surface mt-10 p-6">
        <h2 className="text-2xl font-black">Why genuine parts matter</h2>
        <p className="mt-2">A genuine part protects a mechanic's good name. It also protects a truck owner's money. Fewer breakdowns. Less downtime.</p>
      </div>

      <h2 className="mt-12 text-3xl font-black">What we stock</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {brand.categories.map((c, i) => {
          const I = icons[i % icons.length] ?? Package;
          return (
            <div key={c} className="card-surface flex flex-col gap-2 p-4">
              <I className="h-8 w-8 text-primary" />
              <span className="font-bold">{c}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-5 flex items-center gap-2 rounded-xl bg-accent p-4 font-bold text-accent-foreground">
        <ShieldCheck className="h-6 w-6 shrink-0" /> All parts are genuine Isuzu parts only.
      </p>
    </div>
  );
}
