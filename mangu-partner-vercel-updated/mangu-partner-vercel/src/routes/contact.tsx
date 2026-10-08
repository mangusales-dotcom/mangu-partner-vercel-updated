import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone, MessageCircle, Mail, Clock, Star } from "lucide-react";
import { brand, waLink } from "@/config/brand";
import { SocialLinks } from "@/components/SiteChrome";

const title = "Contact Mangu Auto — 84 Kirinyaga Road, Nairobi";
const desc = "Call, WhatsApp or visit Mangu Auto & Hardware Ltd for genuine Isuzu parts and oils. Open Mon-Fri 8:00-16:30, Sat 8:00-13:00.";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }] }),
  component: Contact,
});

function Contact() {
  const q = encodeURIComponent(brand.mapsQuery);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-4xl font-black sm:text-5xl">Contact us</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card-surface space-y-4 p-6">
          <p className="flex gap-3 text-lg"><MapPin className="h-6 w-6 shrink-0 text-primary" /> {brand.address}</p>
          <a href={`tel:${brand.phoneTel}`} className="btn-primary w-full"><Phone className="h-5 w-5" /> Call {brand.phoneDisplay}</a>
          <a href={waLink()} target="_blank" rel="noopener" className="btn-secondary w-full"><MessageCircle className="h-5 w-5" /> WhatsApp us</a>
          <a href={`mailto:${brand.email}`} className="flex gap-3 font-bold text-secondary underline"><Mail className="h-6 w-6" /> {brand.email}</a>
          <div>
            {brand.hours.map((h) => <p key={h.days} className="flex gap-3"><Clock className="h-5 w-5 text-muted-foreground" /> {h.days}: {h.time}</p>)}
          </div>
        </div>
        <div className="card-surface overflow-hidden">
          <iframe title="Map to Mangu Auto" loading="lazy" className="h-72 w-full border-0 sm:h-full" src={`https://www.google.com/maps?q=${q}&output=embed`} />
        </div>
      </div>

      <div className="card-surface mt-6 p-6">
        <h2 className="text-2xl font-black">Find us on Google</h2>
        <p className="mt-1 text-muted-foreground">See our location, hours and photos.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={brand.socials.googleBusiness} target="_blank" rel="noopener" className="btn-secondary">Open Google profile</a>
          <Link to="/review" className="btn-primary"><Star className="h-5 w-5" /> Leave us a review</Link>
        </div>
      </div>

      <h2 className="mt-10 text-2xl font-black">Follow us</h2>
      <div className="mt-4"><SocialLinks /></div>
    </div>
  );
}
