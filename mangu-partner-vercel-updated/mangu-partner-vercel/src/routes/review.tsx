import { createFileRoute } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { Star, MousePointerClick, LogIn, PenLine } from "lucide-react";
import { brand } from "@/config/brand";

const title = "Review Mangu Auto on Google";
const desc = "Will you help us grow with your honest review? Your words help other mechanics trust Mangu Auto.";

export const Route = createFileRoute("/review")({
  head: () => ({ meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }] }),
  component: Review,
});

function Review() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-center">
      <div className="mb-6 flex justify-center gap-2" aria-label="Five stars">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="animate-pop h-11 w-11 fill-primary text-primary" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
      <h1 className="text-3xl font-black sm:text-5xl">Will you help us grow with your honest review?</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg">
        Your words help other mechanics trust Mangu Auto. They help us serve you better. If we have served you well, we would be grateful for 5 stars.
      </p>
      <a href={brand.googleReview} target="_blank" rel="noopener" className="btn-primary mt-8 w-full text-xl sm:w-auto sm:px-10" style={{ minHeight: 68 }}>
        <Star className="h-6 w-6" /> Rate us on Google
      </a>

      <ol className="mt-10 grid gap-3 text-left sm:grid-cols-2">
        {[
          [MousePointerClick, "Tap the button"],
          [LogIn, "Sign in to Google if asked"],
          [Star, "Tap the stars"],
          [PenLine, "Write one short line (optional) and tap Post"],
        ].map(([I, t], i) => {
          const Icon = I as typeof Star;
          return (
            <li key={i} className="card-surface flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary font-black text-secondary-foreground">{i + 1}</span>
              <Icon className="h-6 w-6 shrink-0 text-secondary" />
              <span className="font-semibold">{t as string}</span>
            </li>
          );
        })}
      </ol>

      <div className="card-surface mx-auto mt-10 inline-block p-6">
        <QRCodeSVG value={brand.googleReview} size={200} level="H" marginSize={2} title="QR code for Google review" />
        <p className="mt-3 font-bold">Scan from another phone</p>
      </div>

      <p className="mt-8">
        <a href={brand.socials.googleBusiness} target="_blank" rel="noopener" className="font-bold text-secondary underline">Find us on Google</a>
      </p>
      <p className="mt-4 text-muted-foreground">Having trouble? Ask any Mangu Auto team member to help you.</p>
    </div>
  );
}
