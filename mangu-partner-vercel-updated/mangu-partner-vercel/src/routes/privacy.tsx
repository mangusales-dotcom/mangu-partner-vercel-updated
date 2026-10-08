import { createFileRoute } from "@tanstack/react-router";
import { brand } from "@/config/brand";

const title = "Privacy Note — Mangu Auto Partner Programme";
const desc = "How Mangu Auto collects, uses and protects partner details under the Kenya Data Protection Act 2019.";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }] }),
  component: Privacy,
});

function Privacy() {
  const items = [
    ["Why we collect", "To contact you about parts, oils, offers and rewards. To stock what you need."],
    ["What we collect", "Your name, phone, email, business details and the answers you give."],
    ["Who sees it", `Only ${brand.name} staff. For ads, we share only secure, hashed data with ad platforms.`],
    ["Your rights", "Under the Kenya Data Protection Act 2019, you can see, correct or delete your details."],
    ["How to be removed", `Email ${brand.email} and ask us to remove you. We will do it.`],
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-black">Privacy note</h1>
      <div className="mt-6 space-y-4">
        {items.map(([h, p]) => (
          <div key={h} className="card-surface p-5">
            <h2 className="text-xl font-black">{h}</h2>
            <p className="mt-1">{p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
