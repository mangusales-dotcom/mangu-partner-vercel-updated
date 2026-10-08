import { useState, type ReactNode } from "react";
import { useForm, Controller, type Control, type FieldValues, type Path, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";
import { fleetSchema, mechanicSchema, normalizeKenyanPhone, type FleetValues, type MechanicValues } from "@/lib/validation";
import { getUtm, nairobiISO, setThanks, submitPayload, uuid } from "@/lib/submit";
import { Chips, CONSENT_TEXT, CONTACT, Field, MODELS, Progress, StaffSelect, TextInput, Tick, TIMES } from "./fields";

function ChipCtl<T extends FieldValues>({ control, name, options, multi }: { control: Control<T>; name: Path<T>; options: readonly string[]; multi?: boolean }) {
  return <Controller control={control} name={name} render={({ field }) => <Chips options={options} value={field.value} onChange={field.onChange} multi={multi} />} />;
}
function TickCtl<T extends FieldValues>({ control, name, children }: { control: Control<T>; name: Path<T>; children: ReactNode }) {
  return (
    <Controller control={control} name={name} render={({ field, fieldState }) => (
      <Tick checked={!!field.value} onChange={field.onChange} error={fieldState.error?.message}>{children}</Tick>
    )} />
  );
}
function StaffCtl<T extends FieldValues>({ control, name }: { control: Control<T>; name: Path<T> }) {
  return <Controller control={control} name={name} render={({ field }) => <StaffSelect value={field.value} onChange={field.onChange} />} />;
}
function Honeypot<T extends FieldValues>({ form }: { form: UseFormReturn<T> }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>Website<input tabIndex={-1} autoComplete="off" {...form.register("website" as Path<T>)} /></label>
    </div>
  );
}

function useWizard<T extends FieldValues>(form: UseFormReturn<T>, steps: Path<T>[][], anchor: string) {
  const [step, setStep] = useState(1);
  const go = (n: number) => {
    setStep(n);
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const next = async () => {
    const ok = await form.trigger(steps[step - 1]);
    if (ok) go(step + 1);
  };
  return { step, next, back: () => go(step - 1) };
}

function Nav({ step, total, onBack, onNext, sending }: { step: number; total: number; onBack: () => void; onNext: () => void; sending: boolean }) {
  return (
    <div className="mt-8 grid grid-cols-[auto_1fr] gap-3">
      {step > 1 ? (
        <button type="button" className="btn-secondary" onClick={onBack} disabled={sending}><ArrowLeft className="h-5 w-5" /> Back</button>
      ) : <span />}
      {step < total ? (
        <button type="button" className="btn-primary" onClick={onNext}>Next <ArrowRight className="h-5 w-5" /></button>
      ) : (
        <button type="submit" className="btn-primary" disabled={sending}>
          {sending ? <><Loader2 className="h-5 w-5 animate-spin" /> Sending...</> : <>Send my details <Send className="h-5 w-5" /></>}
        </button>
      )}
    </div>
  );
}

function ConsentBlock<T extends FieldValues>({ control, marketing, setMarketing }: { control: Control<T>; marketing: boolean; setMarketing: (v: boolean) => void }) {
  return (
    <div className="space-y-3">
      <p className="rounded-xl bg-muted p-4 text-sm">{CONSENT_TEXT}</p>
      <TickCtl control={control} name={"consent" as Path<T>}>
        I consent to Mangu collecting and using my data as described above. <span className="font-bold text-primary">(required)</span>
      </TickCtl>
      <Tick checked={marketing} onChange={setMarketing}>
        I consent to receive marketing messages (SMS, WhatsApp, email, calls) from Mangu. <span className="text-muted-foreground">(optional)</span>
      </Tick>
      <p className="text-sm text-muted-foreground">
        <a href="/data-privacy" target="_blank" rel="noopener" className="font-semibold text-secondary underline">Read more</a> about how we use your data and your rights under the Kenya Data Protection Act, 2019.
      </p>
    </div>
  );
}

const meta = () => ({ submittedAt: nairobiISO(), device: navigator.userAgent, utm: (() => { const u = getUtm(); return Object.keys(u).length ? JSON.stringify(u) : ""; })(), submissionId: uuid() });

/* ---------------- MECHANIC ---------------- */
const HARD_PARTS = ["Clutch plates", "Brake pads", "Filters", "Engine parts", "Gearbox / transmission", "Suspension", "Electrical", "Injectors / fuel system", "Gaskets and seals", "Body parts", "Other"];

export function MechanicForm() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const form = useForm<MechanicValues>({
    resolver: zodResolver(mechanicSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "", phone: "", onWhatsapp: true, email: "", garageName: "", selfEmployed: false, garageLocation: "", landmark: "",
      usuallyFound: "", yearsExperience: "", vehicles: [], otherModels: "", vehiclesPerMonth: "", hardParts: [], partDetails: "",
      buysFrom: [], biggestProblem: "", monthlySpend: "", oilBrand: "", oilLitres: "", wantsDelivery: "", contactMethod: "", bestTime: "",
      registeredBy: "", consent: false as unknown as true, website: "",
    },
  });
  const { register, control, formState: { errors } } = form;
  const w = useWizard(form, [["fullName", "phone", "email"], ["garageName", "garageLocation"]], "mechanic-form");

  const onSubmit = async (v: MechanicValues) => {
    if (sending) return;
    setSending(true);
    const payload = {
      registrantType: "mechanic" as const, ...meta(),
      fullName: v.fullName, phone: normalizeKenyanPhone(v.phone)!, onWhatsapp: v.onWhatsapp, email: v.email,
      garageName: v.garageName, selfEmployed: v.selfEmployed, garageLocation: v.garageLocation, landmark: v.landmark,
      usuallyFound: v.usuallyFound, yearsExperience: v.yearsExperience, vehicles: v.vehicles, otherModels: v.otherModels,
      vehiclesPerMonth: v.vehiclesPerMonth, hardParts: v.hardParts, partDetails: v.partDetails, buysFrom: v.buysFrom,
      biggestProblem: v.biggestProblem, monthlySpend: v.monthlySpend, oilBrand: v.oilBrand, oilLitres: v.oilLitres,
      wantsDelivery: v.wantsDelivery, contactMethod: v.contactMethod, bestTime: v.bestTime, registeredBy: v.registeredBy,
      consent: v.consent, marketingOptIn: marketing, website: v.website ?? "",
    };
    try {
      const sent = await submitPayload(payload);
      setThanks({ firstName: (v.fullName.trim().split(/\s+/)[0] ?? v.fullName.trim()), type: "mechanic", offline: !sent });
      navigate({ to: "/thanks" });
    } finally {
      setSending(false);
    }
  };

  return (
    <form id="mechanic-form" onSubmit={form.handleSubmit(onSubmit)} noValidate className="relative scroll-mt-24 card-surface p-5 sm:p-8">
      <Honeypot form={form} />
      <h3 className="mb-1 text-2xl font-black">Mechanic registration</h3>
      <p className="mb-5 text-muted-foreground">About 2 minutes. Fields with <span className="text-primary">*</span> are needed.</p>
      <Progress step={w.step} total={3} />

      {w.step === 1 && (
        <div className="space-y-5 animate-fade-up">
          <h4 className="text-xl font-extrabold">About you</h4>
          <TextInput label="Full name" required autoComplete="name" {...register("fullName")} error={errors.fullName?.message} />
          <TextInput label="Phone number" required type="tel" inputMode="tel" autoComplete="tel" placeholder="0712 345 678" {...register("phone")} error={errors.phone?.message} />
          <TickCtl control={control} name="onWhatsapp">This number is on WhatsApp</TickCtl>
          <TextInput label="Email (optional)" type="email" inputMode="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
        </div>
      )}

      {w.step === 2 && (
        <div className="space-y-5 animate-fade-up">
          <h4 className="text-xl font-extrabold">Your garage</h4>
          <TextInput label="Garage / workshop name" required {...register("garageName")} error={errors.garageName?.message} />
          <TickCtl control={control} name="selfEmployed">I work for myself / mobile mechanic</TickCtl>
          <TextInput label="Garage location: town or area" required {...register("garageLocation")} error={errors.garageLocation?.message} />
          <TextInput label="Nearest landmark or street (optional)" {...register("landmark")} />
          <Field label="Where can we usually find you?"><ChipCtl control={control} name="usuallyFound" options={["At my garage", "Roadside / mobile", "Bus station area", "Other"]} /></Field>
          <Field label="Years as a mechanic"><ChipCtl control={control} name="yearsExperience" options={["Under 2", "2-5", "6-10", "Over 10"]} /></Field>
          <Field label="Vehicles you work on" hint="Tap all that apply."><ChipCtl control={control} name="vehicles" options={MODELS} multi /></Field>
          <TextInput label="Other models or brands not listed above" placeholder="Type them here" {...register("otherModels")} />
          <Field label="How many vehicles do you service in a month?"><ChipCtl control={control} name="vehiclesPerMonth" options={["1-5", "6-15", "16-30", "Over 30"]} /></Field>
        </div>
      )}

      {w.step === 3 && (
        <div className="space-y-5 animate-fade-up">
          <h4 className="text-xl font-extrabold">Parts and needs</h4>
          <Field label="Isuzu parts you find DIFFICULT to find" required hint="Tap all that apply." error={errors.hardParts?.message}>
            <ChipCtl control={control} name="hardParts" options={HARD_PARTS} multi />
          </Field>
          <TextInput label="Tell us the exact part or model" {...register("partDetails")} />
          <Field label="Where do you buy parts now?"><ChipCtl control={control} name="buysFrom" options={["Dealer in Nairobi", "Shop in my town", "Online", "Used / second-hand", "Other"]} multi /></Field>
          <Field label="Biggest problem when buying parts"><ChipCtl control={control} name="biggestProblem" options={["Fake parts", "High price", "Part not available", "Slow delivery", "Wrong part supplied", "No credit", "Other"]} /></Field>
          <Field label="Roughly how much do you spend on parts each month?"><ChipCtl control={control} name="monthlySpend" options={["Under KES 20,000", "20,000-50,000", "50,000-100,000", "Over 100,000"]} /></Field>
          <TextInput label="Which engine oil do you use most? (brand, diesel or petrol)" {...register("oilBrand")} />
          <Field label="How many litres a month?"><ChipCtl control={control} name="oilLitres" options={["Under 20L", "20-50L", "50-100L", "Over 100L"]} /></Field>
          <Field label="Would you like parts delivered to your garage or upcountry?"><ChipCtl control={control} name="wantsDelivery" options={["Yes", "No", "Maybe"]} /></Field>
          <Field label="Best way to reach you"><ChipCtl control={control} name="contactMethod" options={CONTACT} /></Field>
          <Field label="Best time"><ChipCtl control={control} name="bestTime" options={TIMES} /></Field>
          <StaffCtl control={control} name="registeredBy" />
          <ConsentBlock control={control} marketing={marketing} setMarketing={setMarketing} />
        </div>
      )}
      <Nav step={w.step} total={3} onBack={w.back} onNext={w.next} sending={sending} />
    </form>
  );
}

/* ---------------- FLEET ---------------- */
const FLEET_PARTS = ["Clutch plates", "Brake pads", "Filters", "Tyres and wheel parts", "Suspension", "Injectors / fuel system", "Electrical", "Gaskets and seals", "Engine parts", "Gearbox parts", "Other"];

export function FleetForm() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const form = useForm<FleetValues>({
    resolver: zodResolver(fleetSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "", phone: "", onWhatsapp: true, email: "", companyName: "", roleInCompany: "", businessType: "", yardLocation: "", landmark: "",
      fleetSize: "", vehicleModels: [], otherModels: "", vehicleAge: "", operations: "", maintenanceBy: "", mechanicName: "", mechanicPhone: "",
      garageLocation: "", partsBoughtFrom: [], partsReplacedOften: [], partsReplacedOftenOther: "", savingParts: [], savingPartsOther: "",
      biggestProblem: "", paymentTerms: "", monthlyPartsSpend: "", oilType: "", oilBrand: "", oilBoughtFrom: [], oilQuantity: "", packSize: "",
      wantsQuote: "", wantsDelivery: "", contactMethod: "", bestTime: "", registeredBy: "", consent: false as unknown as true, website: "",
    },
  });
  const { register, control, watch, formState: { errors } } = form;
  const w = useWizard(form, [["fullName", "phone", "email", "companyName", "yardLocation"], ["fleetSize"], ["mechanicPhone"]], "fleet-form");
  const company = watch("companyName");

  const onSubmit = async (v: FleetValues) => {
    if (sending) return;
    setSending(true);
    const withOther = (a: string[], t: string) => (t.trim() ? [...a, t.trim()] : a);
    const payload = {
      registrantType: "fleet" as const, ...meta(),
      fullName: v.fullName, phone: normalizeKenyanPhone(v.phone)!, onWhatsapp: v.onWhatsapp, email: v.email,
      companyName: v.companyName, roleInCompany: v.roleInCompany, businessType: v.businessType,
      yardLocation: v.landmark.trim() ? `${v.yardLocation} (${v.landmark.trim()})` : v.yardLocation,
      fleetSize: v.fleetSize, vehicleModels: v.vehicleModels, otherModels: v.otherModels, vehicleAge: v.vehicleAge, operations: v.operations,
      maintenanceBy: v.maintenanceBy, mechanicName: v.mechanicName,
      mechanicPhone: v.mechanicPhone ? normalizeKenyanPhone(v.mechanicPhone) ?? v.mechanicPhone : "",
      garageLocation: v.garageLocation, partsBoughtFrom: v.partsBoughtFrom,
      partsReplacedOften: withOther(v.partsReplacedOften, v.partsReplacedOftenOther),
      savingParts: withOther(v.savingParts, v.savingPartsOther),
      biggestProblem: v.biggestProblem, paymentTerms: v.paymentTerms, monthlyPartsSpend: v.monthlyPartsSpend, oilType: v.oilType,
      oilBrand: v.oilBrand, oilBoughtFrom: v.oilBoughtFrom, oilQuantity: v.oilQuantity, packSize: v.packSize, wantsQuote: v.wantsQuote,
      wantsDelivery: v.wantsDelivery, contactMethod: v.contactMethod, bestTime: v.bestTime, registeredBy: v.registeredBy,
      consent: v.consent, marketingOptIn: marketing, website: v.website ?? "",
    };
    try {
      const sent = await submitPayload(payload);
      setThanks({ firstName: (v.fullName.trim().split(/\s+/)[0] ?? v.fullName.trim()), company: v.companyName.trim(), type: "fleet", offline: !sent });
      navigate({ to: "/thanks" });
    } finally {
      setSending(false);
    }
  };

  return (
    <form id="fleet-form" onSubmit={form.handleSubmit(onSubmit)} noValidate className="relative scroll-mt-24 card-surface p-5 sm:p-8">
      <Honeypot form={form} />
      <h3 className="mb-1 text-2xl font-black">Fleet Partner registration</h3>
      <p className="mb-5 text-muted-foreground">Tell us about your fleet so we can stock the right genuine Isuzu parts and oils for you, at good prices.</p>
      <Progress step={w.step} total={4} />

      {w.step === 1 && (
        <div className="space-y-5 animate-fade-up">
          <h4 className="text-xl font-extrabold">About you and your business</h4>
          <TextInput label="Full name" required autoComplete="name" {...register("fullName")} error={errors.fullName?.message} />
          <TextInput label="Phone number" required type="tel" inputMode="tel" autoComplete="tel" placeholder="0712 345 678" {...register("phone")} error={errors.phone?.message} />
          <TickCtl control={control} name="onWhatsapp">This number is on WhatsApp</TickCtl>
          <TextInput label="Email (optional)" type="email" inputMode="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
          <TextInput label="Company / business name" required autoComplete="organization" {...register("companyName")} error={errors.companyName?.message} />
          <Field label="Your role"><ChipCtl control={control} name="roleInCompany" options={["Owner", "Fleet manager", "Transport manager", "Procurement / buyer", "Other"]} /></Field>
          <Field label="Type of business"><ChipCtl control={control} name="businessType" options={["Cargo / haulage", "Passenger / buses / matatus", "Construction", "Farming / agriculture", "Distribution / delivery", "Other"]} /></Field>
          <TextInput label="Where is your yard or office? Town / area" required {...register("yardLocation")} error={errors.yardLocation?.message} />
          <TextInput label="Landmark (optional)" {...register("landmark")} />
        </div>
      )}

      {w.step === 2 && (
        <div className="space-y-5 animate-fade-up">
          <h4 className="text-xl font-extrabold">Your fleet</h4>
          <Field label="How many vehicles are in your fleet?" required error={errors.fleetSize?.message}>
            <ChipCtl control={control} name="fleetSize" options={["1-3", "4-10", "11-30", "31-100", "Over 100"]} />
          </Field>
          <Field label="Models you run" hint="Tap all that apply."><ChipCtl control={control} name="vehicleModels" options={MODELS} multi /></Field>
          <TextInput label="Other models or brands not listed above" placeholder="Type them here" {...register("otherModels")} />
          <Field label="Average age of your vehicles"><ChipCtl control={control} name="vehicleAge" options={["Under 3 years", "3-7", "8-12", "Over 12"]} /></Field>
          <Field label="What work do your vehicles do?"><ChipCtl control={control} name="operations" options={["Long distance", "Local / city", "Construction sites", "Mixed"]} /></Field>
        </div>
      )}

      {w.step === 3 && (
        <div className="space-y-5 animate-fade-up">
          <h4 className="text-xl font-extrabold">Parts and servicing</h4>
          <Field label="Who services your vehicles?"><ChipCtl control={control} name="maintenanceBy" options={["Our own workshop", "An outside garage", "Mixed"]} /></Field>
          <TextInput label="Name of the mechanic or garage" {...register("mechanicName")} />
          <TextInput label="Their phone (optional)" type="tel" inputMode="tel" {...register("mechanicPhone")} error={errors.mechanicPhone?.message} />
          <TextInput label="Garage location (town / area)" {...register("garageLocation")} />
          <Field label="Where do you buy parts for your fleet now?"><ChipCtl control={control} name="partsBoughtFrom" options={["Dealer in Nairobi", "Shop in my town", "Online", "Used / second-hand", "Our mechanic buys them", "Other"]} multi /></Field>
          <Field label="Parts you replace OFTEN"><ChipCtl control={control} name="partsReplacedOften" options={FLEET_PARTS} multi /></Field>
          <TextInput label="Other parts you replace often" {...register("partsReplacedOftenOther")} />
          <Field label="Which parts, at a good price, would help you save the most?"><ChipCtl control={control} name="savingParts" options={FLEET_PARTS} multi /></Field>
          <TextInput label="Tell us the part or model" {...register("savingPartsOther")} />
          <Field label="Biggest problem with parts today"><ChipCtl control={control} name="biggestProblem" options={["Fake parts", "High price", "Part not available", "Slow delivery", "Wrong part supplied", "Vehicle downtime", "No credit", "Other"]} /></Field>
          <Field label="How do you pay suppliers?"><ChipCtl control={control} name="paymentTerms" options={["Cash / M-Pesa", "Bank transfer", "Credit account 30+ days", "LPO / invoice", "Mixed"]} /></Field>
          <Field label="Roughly how much does the fleet spend on parts each month?"><ChipCtl control={control} name="monthlyPartsSpend" options={["Under KES 50,000", "50,000-150,000", "150,000-500,000", "Over 500,000"]} /></Field>
        </div>
      )}

      {w.step === 4 && (
        <div className="space-y-5 animate-fade-up">
          <h4 className="text-xl font-extrabold">Oils and follow-up</h4>
          <Field label="Which oil does your fleet use?"><ChipCtl control={control} name="oilType" options={["Diesel engine oil", "Petrol engine oil", "Both"]} /></Field>
          <TextInput label="Oil brand" {...register("oilBrand")} />
          <Field label="Where do you buy oil now?"><ChipCtl control={control} name="oilBoughtFrom" options={["Fuel station", "Dealer", "Wholesaler", "Online", "Our mechanic buys", "Other"]} multi /></Field>
          <Field label="Roughly how much oil do you buy per month?"><ChipCtl control={control} name="oilQuantity" options={["Under 50 L", "50-200 L", "200-500 L", "Over 500 L"]} /></Field>
          <Field label="Usual pack size"><ChipCtl control={control} name="packSize" options={["5L", "20L", "208L drum", "Mixed"]} /></Field>
          <Field label="Would you like a quotation on your most-used parts and oils?"><ChipCtl control={control} name="wantsQuote" options={["Yes on WhatsApp", "Yes by email", "Not now"]} /></Field>
          <Field label="Would you like parts and oil delivered to your yard?"><ChipCtl control={control} name="wantsDelivery" options={["Yes", "No", "Maybe"]} /></Field>
          <Field label="Best way to reach you"><ChipCtl control={control} name="contactMethod" options={[...CONTACT, "Email"]} /></Field>
          <Field label="Best time"><ChipCtl control={control} name="bestTime" options={TIMES} /></Field>
          <StaffCtl control={control} name="registeredBy" />
          <ConsentBlock control={control} marketing={marketing} setMarketing={setMarketing} />
          <p className="rounded-xl bg-accent p-4 font-bold text-accent-foreground">
            You are registering {company?.trim() || "your company"} as a Fleet Partner.
          </p>
        </div>
      )}
      <Nav step={w.step} total={4} onBack={w.back} onNext={w.next} sending={sending} />
    </form>
  );
}
