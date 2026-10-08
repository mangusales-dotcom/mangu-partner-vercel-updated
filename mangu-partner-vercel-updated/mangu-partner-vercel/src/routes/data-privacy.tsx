import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck } from "lucide-react";
import { brand } from "@/config/brand";
import { CONSENT_TEXT } from "@/components/forms/fields";

const title = "Data Privacy Details — Mangu Auto Partner Programme";
const desc =
  "How Mangu Auto & Hardware Ltd collects, uses, keeps and protects your details under the Kenya Data Protection Act, 2019. We are a registered Data Controller.";

export const Route = createFileRoute("/data-privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
    ],
  }),
  component: DataPrivacy,
});

/** Blurred on purpose. The characters underneath are dummy values, not the real numbers. */
function Blurred({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden className={`inline-block select-none ${className}`} style={{ filter: "blur(6px)" }}>
      {children}
    </span>
  );
}

function Certificate() {
  return (
    <figure className="mx-auto max-w-xl" aria-label="Certificate of Registration as a Data Controller">
      <div className="bg-black p-1.5">
        <div className="bg-[#d40000] p-1">
          <div className="bg-[#0a8a2f] p-1">
            <div className="bg-white px-5 py-8 text-center sm:px-10">
              <div className="flex items-center justify-between gap-3 text-left">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Republic of Kenya</p>
                  <p className="text-sm font-black uppercase leading-tight text-slate-700">
                    Office of the Data
                    <br />
                    Protection Commissioner
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-700">
                  Serial No.: <Blurred>00000</Blurred>
                </p>
              </div>

              <h3 className="mt-8 text-xl font-black uppercase tracking-wide text-slate-800 sm:text-2xl">Certificate of Registration</h3>

              <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold uppercase tracking-widest text-white">
                Registered
              </div>

              <p className="mt-8 text-lg text-slate-600">This certificate is awarded to</p>
              <p className="mt-2 text-2xl font-black uppercase leading-tight text-slate-700 sm:text-3xl">
                Mangu Auto and
                <br />
                Hardware Limited
              </p>
              <p className="mt-4 text-lg text-slate-600">Identification</p>
              <p className="text-lg text-slate-600">
                <Blurred>000-0000-0X00</Blurred> as a
              </p>
              <p className="mt-2 text-3xl font-black text-slate-700">Data Controller</p>
              <p className="mt-2 text-sm text-slate-500">for a period of two (2) years starting from the date indicated below.</p>

              <div className="mt-8 flex items-end justify-between gap-4">
                <div className="text-left">
                  <Blurred>
                    <svg viewBox="0 0 120 40" className="h-10 w-28" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round">
                      <path d="M4 28c10-24 14-24 10-4s8 6 14-8-2 18 10 4 8-10 12-4 10 6 18-6 8 2 14 0" />
                    </svg>
                  </Blurred>
                  <p className="border-t border-slate-400 pt-1 text-xs font-semibold text-slate-600">Data Commissioner</p>
                </div>
                <Blurred>
                  <QRCodeSVG value="REDACTED-SAMPLE-NOT-REAL" size={84} />
                </Blurred>
              </div>

              <p className="mt-6 text-sm text-slate-600">Place of Issuance: Kenya. Certificate valid from 19th January 2026 to 19th January 2028.</p>
              <p className="mt-2 text-xs font-bold text-slate-500">*NOTE: This is an online generated certificate</p>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm text-muted-foreground">
        Our registration certificate. The serial number, identification number, signature and QR code are hidden to protect them from misuse.
      </figcaption>
    </figure>
  );
}

function DataPrivacy() {
  const sections: [string, ReactNode][] = [
    [
      "1. Who we are",
      <p key="a">
        {brand.name} ("Mangu Auto", "we", "us") runs the {brand.programme}. We are a registered Data Controller with the Office of the Data Protection Commissioner (ODPC) in Kenya. We
        decide why and how your details are used, and we are responsible for looking after them.
      </p>,
    ],
    [
      "2. What details we collect",
      <p key="b">
        The details you type into our registration form: your name, phone number, email (if you give one), whether your number is on WhatsApp, your business or garage name and location,
        the vehicles you work on or run, the parts and oils you buy, how and when you like to be contacted, and who registered you. We also record the time you sent the form and basic
        device information, such as the type of phone or browser, so we can keep the form working properly and avoid duplicates.
      </p>,
    ],
    [
      "3. Why we use your details",
      <ul key="c" className="list-disc space-y-1 pl-5">
        <li>To register you in the Partner Programme and keep our records.</li>
        <li>To stock the genuine Isuzu parts and oils you actually need.</li>
        <li>To contact you by call, WhatsApp, SMS or email about parts, oils, offers and rewards.</li>
        <li>To check qualifying purchases and give rewards.</li>
        <li>To show you relevant Mangu Auto advertising. For this we share only secure, hashed (scrambled) details with ad platforms, never your plain name or number.</li>
      </ul>,
    ],
    [
      "4. Our legal basis: your consent",
      <p key="d">
        We use your details because you consented to it when you ticked the consent box on the form. Consenting to receive marketing messages is a separate, optional tick. You can register
        without ticking it.
      </p>,
    ],
    [
      "5. Who can see your details",
      <p key="e">
        Only Mangu Auto staff who need them for the reasons above. We do not sell your details. We store them in secure online tools (including Google Sheets), which may keep data on
        servers outside Kenya. We use reasonable security measures to protect your details from loss, misuse or unauthorised access.
      </p>,
    ],
    [
      "6. How long we keep your details",
      <p key="f">
        We keep your details for a long time, for as long as you remain a Mangu Auto partner or customer, so that we can keep serving you and honour your rewards. If you want your
        details deleted, just ask us at any time and we will remove them.
      </p>,
    ],
    [
      "7. Your rights under the Data Protection Act, 2019",
      <>
        <p>The Kenya Data Protection Act, 2019 gives you the right to:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Know how your details are being used.</li>
          <li>See the details we hold about you.</li>
          <li>Ask us to correct details that are wrong or out of date.</li>
          <li>Ask us to delete your details.</li>
          <li>Object to your details being used for marketing.</li>
          <li>Withdraw your consent at any time. This will not affect what we did before you withdrew.</li>
        </ul>
      </>,
    ],
    [
      "8. How to contact us or be removed",
      <p key="h">
        Email <a className="font-semibold text-secondary underline" href={`mailto:${brand.email}`}>{brand.email}</a>, call{" "}
        <a className="font-semibold text-secondary underline" href={`tel:${brand.phoneTel}`}>{brand.phoneDisplay}</a>, or WhatsApp us on that number. Tell us your name and phone number
        and what you would like us to do. If you are not happy with how we handle your details, you also have the right to complain to the Office of the Data Protection Commissioner
        (odpc.go.ke).
      </p>,
    ],
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-black">Data privacy details</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        How {brand.shortName} looks after your details, in plain words, under the Kenya Data Protection Act, 2019.
      </p>

      <div className="mt-8 space-y-4">
        {sections.map(([h, body]) => (
          <section key={h} className="card-surface p-5">
            <h2 className="text-xl font-black">{h}</h2>
            <div className="mt-2 space-y-2">{body}</div>
          </section>
        ))}
      </div>

      <section className="card-surface mt-4 p-5">
        <h2 className="text-xl font-black">9. What you consent to when you tick the form</h2>
        <p className="mt-2 rounded-xl bg-muted p-4 text-sm">{CONSENT_TEXT}</p>
        <ul className="mt-3 space-y-2">
          <li>
            <strong>Required:</strong> "I consent to Mangu collecting and using my data as described above." By ticking this you confirm that you have read this page and consent to us using your
            details as explained here. We cannot register you without it.
          </li>
          <li>
            <strong>Optional:</strong> "I consent to receive marketing messages (SMS, WhatsApp, email, calls) from Mangu."
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-2xl font-black">
          <ShieldCheck className="h-7 w-7 text-primary" /> We are a registered Data Controller
        </h2>
        <p className="mt-2 text-muted-foreground">
          {brand.name} is registered with the Office of the Data Protection Commissioner of Kenya. We follow the law on how personal data must be handled.
        </p>
        <div className="mt-6">
          <Certificate />
        </div>
      </section>
    </div>
  );
}
