# Mangu Auto Partner Programme

Mobile-first activation site for Mangu Auto & Hardware Ltd (Machakos Country Bus Station, 15–16 Oct 2026).

## Stack
Built on Lovable's TanStack Start + React + TypeScript + Tailwind v4 (config in `src/styles.css`), react-hook-form + zod, qrcode.react, lucide-react. File-based routes in `src/routes/` (`/`, `/story`, `/contact`, `/review`, `/thanks`, `/privacy`) all work on refresh.

## Setup
```
bun install
cp .env.example .env
bun run dev
```

## Edit brand text
Everything (address, phone, hours, socials, review link, reward threshold/period, staff names, activation dates) lives in `src/config/brand.ts`.

## Form endpoint
`VITE_SHEET_ENDPOINT` (in `.env`) = your Google Apps Script web app URL. Submissions POST with `mode: "no-cors"`, `Content-Type: text/plain;charset=utf-8`, JSON body. Payloads use exactly the keys from Section 6 of the brief. They are queued in localStorage (`mangu_pending`) and retried on page load and on the `online` event.

## Test the form
1. Choose Mechanic, fill all 3 steps, send → `/thanks`, row appears in "Mechanics".
2. Repeat with Fleet → "Fleets".
3. Turn on airplane mode, submit → "Saved on your phone" note. Turn data on → row arrives once.

## Deploy
- **Lovable:** click Publish.
- **Vercel:** import the GitHub repo. `vercel.json` already sets the install and build commands (`NITRO_PRESET=vercel`). Add the env variable `VITE_SHEET_ENDPOINT` (it is also read from `.env` at build time).
- The Google Apps Script (`apps-script/Code.gs`) is deployed separately by the owner from the Google Sheet.

## Assumptions
- Fleet owners follow the same KES 100,000 monthly reward rule.
- Fleet "landmark" has no sheet column, so it is appended to `yardLocation` in brackets.
- Fleet "Other parts" text boxes are appended to the `partsReplacedOften` / `savingParts` arrays.
- Mechanic oil type (diesel/petrol) is captured inside the `oilBrand` text.
- `submittedAt` uses Nairobi time (+03:00).
- Fonts: system fonts only (fast on weak data).

## Missing items / TODO
- Story page: more detail (milestones, photos of the shop) would help.
- Exact reward item and voucher value (to be announced by Mangu Auto).
