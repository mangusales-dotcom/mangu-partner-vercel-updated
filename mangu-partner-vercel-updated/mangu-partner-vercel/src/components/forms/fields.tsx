import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Check } from "lucide-react";
import { brand } from "@/config/brand";

export function Field({ label, error, hint, children, required }: { label: string; error?: string; hint?: string; children: ReactNode; required?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="font-bold text-ink">
        {label} {required && <span className="text-primary">*</span>}
      </div>
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {children}
      {error && <p role="alert" className="font-semibold text-destructive">{error}</p>}
    </div>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; required?: boolean }>(
  function TextInput({ label, error, required, id, ...rest }, ref) {
    const fid = id ?? rest.name;
    return (
      <div className="space-y-2">
        <label htmlFor={fid} className="block font-bold text-ink">
          {label} {required && <span className="text-primary">*</span>}
        </label>
        <input ref={ref} id={fid} className="field-input" aria-invalid={!!error} {...rest} />
        {error && <p role="alert" className="font-semibold text-destructive">{error}</p>}
      </div>
    );
  },
);

export function Chips({ options, value, onChange, multi }: { options: readonly string[]; value: string | string[]; onChange: (v: any) => void; multi?: boolean }) {
  const isOn = (o: string) => (multi ? (value as string[]).includes(o) : value === o);
  const toggle = (o: string) => {
    if (multi) {
      const cur = value as string[];
      onChange(cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o]);
    } else onChange(value === o ? "" : o);
  };
  return (
    <div className="flex flex-wrap gap-2" role={multi ? "group" : "radiogroup"}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className="chip"
          {...(multi ? { "aria-pressed": isOn(o) } : { role: "radio", "aria-checked": isOn(o) })}
          onClick={() => toggle(o)}
        >
          {isOn(o) && <Check className="mr-1 h-4 w-4" aria-hidden />}
          {o}
        </button>
      ))}
    </div>
  );
}

export function Tick({ checked, onChange, children, error }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; error?: string }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-input bg-card p-3">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-6 w-6 shrink-0 accent-secondary" />
        <span className="text-base">{children}</span>
      </label>
      {error && <p role="alert" className="mt-2 font-semibold text-destructive">{error}</p>}
    </div>
  );
}

export function StaffSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Field label="Who registered you?">
      <select className="field-input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose a name</option>
        {brand.staffNames.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
        <option value="I came on my own">I came on my own</option>
      </select>
    </Field>
  );
}

export function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex justify-between text-sm font-bold">
        <span>Step {step} of {total}</span>
        <span className="text-muted-foreground">{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step}>
        <div className="h-full rounded-full bg-secondary transition-all duration-500" style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </div>
  );
}

export const CONSENT_TEXT =
  "I consent to Mangu Auto & Hardware Ltd storing my details, contacting me by call, WhatsApp, SMS or email about parts, oils, offers and rewards, and using my details to show me relevant Mangu Auto advertising (shared with ad platforms only in secure, hashed form). I can ask to be removed any time.";

export const MODELS = [
  "Isuzu NQR", "ELF", "FRR", "FVR", "FTR", "FVZ", "FTS", "NLR", "NMR", "NPS", "NPR", "FSR", "GXZ",
  "D-Max", "MU-X", "EXZ", "TFR", "TFS", "M21", "M27", "M30",
  "Isuzu TX", "Isuzu TWD", "Isuzu TSD", "Buses/Matatus (other models)",
] as const;
export const CONTACT = ["Call", "WhatsApp", "SMS"] as const;
export const TIMES = ["Morning", "Afternoon", "Evening"] as const;
