// All brand text and settings live here. Edit this file to change the site.
export const brand = {
  name: "Mangu Auto & Hardware Ltd",
  shortName: "Mangu Auto",
  programme: "Mangu Auto Partner Programme",
  tagline: "Genuine Isuzu parts, trusted since 1990.",
  promise: "Genuine Isuzu parts only. Committed to meeting and exceeding your expectations.",
  established: 1990,
  dealerLine: "Authorised Isuzu East Africa parts dealer",
  address: "84 Kirinyaga Road, CBD, Nairobi",
  addressShort: "84 Kirinyaga Road, Nairobi",
  mapsQuery: "Mangu Auto & Hardware Ltd, 84 Kirinyaga Road, Nairobi",
  phoneDisplay: "+254 707 349 904",
  phoneTel: "+254707349904",
  whatsappNumber: "254707349904",
  whatsappMessage: "Hello Mangu Auto, I am a mechanic and I registered at the activation.",
  email: "sales@manguauto.com",
  hours: [
    { days: "Mon - Fri", time: "8:00 - 16:30" },
    { days: "Saturday", time: "8:00 - 13:00" },
  ],
  socials: {
    website: "https://www.manguauto.com/",
    instagram: "https://www.instagram.com/manguauto/",
    linkedin: "https://ke.linkedin.com/company/mangu-auto-&-hardware-ltd.",
    facebook: "https://www.facebook.com/manguauto/",
    tiktok: "https://www.tiktok.com/@manguauto.hardware",
    whatsapp: "https://wa.me/254707349904",
    googleBusiness: "https://share.google/meiBs3o9DwB7khyOd",
  },
  googleReview: "https://g.page/r/CYnZOedcnOpUEBM/review",
  reward: {
    threshold: 100000,
    currency: "KES",
    period: "monthly",
    periodWord: "month",
    options: "a Mangu Auto merchandise give-away OR a kickback voucher / gift card",
    announceNote: "The exact item and voucher value are announced by Mangu Auto.",
    example: "KES 100,000 is very possible. For example, two clutch sets plus some oils can get you there.",
    smallPrint: "Qualifying sales are confirmed from Mangu Auto records. Rewards are given monthly.",
    fleetLine: "Fleet owners qualify too.",
  },
  staffNames: ["Humphrey", "Joan", "Irene", "Emma", "Mary", "Naomi", "Shadrack", "Marion", "Elvin"],
  activation: {
    name: "Mangu Auto Partner Activation",
    dates: "15 and 16 October 2026",
    venue: "Machakos Country Bus Station, Nairobi",
  },
  categories: [
    "Engine parts",
    "Transmission",
    "Clutch plates",
    "Brake pads and disks",
    "Filters (oil, air, fuel)",
    "Service kits",
    "Oils and lubricants",
    "Petrol engine oils",
    "Diesel engine oils for all vehicles",
  ],
} as const;

export const waLink = (msg: string = brand.whatsappMessage) =>
  `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(msg)}`;

export const formatKES = (n: number) => `${brand.reward.currency} ${n.toLocaleString("en-KE")}`;
