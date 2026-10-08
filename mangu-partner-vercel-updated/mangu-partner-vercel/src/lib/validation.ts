import { z } from "zod";

/** Accepts 07xx, 01xx, 7xx, 1xx, 2547xx, +2547xx, +2541xx. Returns +254XXXXXXXXX or null. */
export function normalizeKenyanPhone(input: string): string | null {
  const d = (input || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  let rest: string | null = null;
  if (/^254[17]\d{8}$/.test(d)) rest = d.slice(3);
  else if (/^0[17]\d{8}$/.test(d)) rest = d.slice(1);
  else if (/^[17]\d{8}$/.test(d)) rest = d;
  return rest ? `+254${rest}` : null;
}

const phone = z
  .string()
  .trim()
  .refine((v) => normalizeKenyanPhone(v) !== null, "Please enter a Kenyan number, like 0712 345 678.");
const optionalPhone = z
  .string()
  .trim()
  .refine((v) => v === "" || normalizeKenyanPhone(v) !== null, "Please check this number.");
const name = z.string().trim().min(2, "Please write your name.").max(100);
const email = z.string().trim().max(255).refine((v) => v === "" || z.string().email().safeParse(v).success, "Please check your email.");
const text = (max = 200) => z.string().trim().max(max);
const arr = z.array(z.string());
const consent = z.literal(true, { errorMap: () => ({ message: "Please tick to consent before you send." }) });

export const mechanicSchema = z.object({
  fullName: name,
  phone,
  onWhatsapp: z.boolean(),
  email,
  garageName: z.string().trim().min(2, "Please write your garage name.").max(120),
  selfEmployed: z.boolean(),
  garageLocation: z.string().trim().min(2, "Please write your town or area.").max(120),
  landmark: text(),
  usuallyFound: text(),
  yearsExperience: text(),
  vehicles: arr,
  otherModels: text(),
  vehiclesPerMonth: text(),
  hardParts: arr.min(1, "Please tap at least one part."),
  partDetails: text(500),
  buysFrom: arr,
  biggestProblem: text(),
  monthlySpend: text(),
  oilBrand: text(),
  oilLitres: text(),
  wantsDelivery: text(),
  contactMethod: text(),
  bestTime: text(),
  registeredBy: text(),
  consent,
  website: z.string().max(0).optional().or(z.literal("")),
});

export const fleetSchema = z.object({
  fullName: name,
  phone,
  onWhatsapp: z.boolean(),
  email,
  companyName: z.string().trim().min(2, "Please write your company name.").max(150),
  roleInCompany: text(),
  businessType: text(),
  yardLocation: z.string().trim().min(2, "Please write your town or area.").max(120),
  landmark: text(),
  fleetSize: z.string().min(1, "Please choose your fleet size."),
  vehicleModels: arr,
  otherModels: text(),
  vehicleAge: text(),
  operations: text(),
  maintenanceBy: text(),
  mechanicName: text(),
  mechanicPhone: optionalPhone,
  garageLocation: text(),
  partsBoughtFrom: arr,
  partsReplacedOften: arr,
  partsReplacedOftenOther: text(300),
  savingParts: arr,
  savingPartsOther: text(300),
  biggestProblem: text(),
  paymentTerms: text(),
  monthlyPartsSpend: text(),
  oilType: text(),
  oilBrand: text(),
  oilBoughtFrom: arr,
  oilQuantity: text(),
  packSize: text(),
  wantsQuote: text(),
  wantsDelivery: text(),
  contactMethod: text(),
  bestTime: text(),
  registeredBy: text(),
  consent,
  website: z.string().max(0).optional().or(z.literal("")),
});

export type MechanicValues = z.infer<typeof mechanicSchema>;
export type FleetValues = z.infer<typeof fleetSchema>;
