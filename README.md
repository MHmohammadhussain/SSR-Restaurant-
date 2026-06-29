# SSR Restaurant

Restaurant website project with two implementations in the same repository:

1. A legacy static multi-page site in the repository root.
2. A modern Next.js + API + MongoDB implementation in this folder (`nextjs-app`).

This README focuses on the Next.js app while also documenting the root static site for clarity.

## Live Website

- Production: [SSR Restaurant — Authentic Andhra Cuisine](https://ssr-restaurant-six.vercel.app/)

Update this URL after each production deployment if your live domain changes.

## Repository Layout

At `d:\SSR Restaurant`:

- `index.html`, `about.html`, `menu.html`, `gallery.html`, `reservations.html`, `delivery.html`, `contact.html`: legacy static pages
- `css/`, `js/`: shared styling and layout injection for legacy pages
- `Gallery Images/`, `gallery/`: image assets for the legacy/static variant
- `restaurant_menu.pdf`: menu PDF asset
- `nextjs-app/`: full-stack Next.js application (current primary app)

At `nextjs-app/`:

- `src/app/*`: App Router pages (`/`, `/about`, `/menu`, `/gallery`, `/reservations`, `/delivery`, `/contact`, `/admin`)
- `src/app/api/*`: REST endpoints for reservations, orders, contacts, and menu items
- `src/lib/db.ts`: MongoDB connection helper
- `src/lib/models/*`: Mongoose schemas
- `src/lib/email.ts`: Resend email helpers
- `src/lib/stripe.ts`: Stripe payment intent helpers
- `scripts/seed-menu.js`: menu seeding script for MongoDB
- `deploy/nginx/ssr-restaurant.conf`: reverse-proxy config example
- `ecosystem.config.cjs`: PM2 process config
- `vercel.json`: Vercel build/runtime config

## Tech Stack (Next.js App)

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4 (plus custom CSS variables)
- MongoDB + Mongoose
- Resend (transactional email)
- Twilio WhatsApp API (internal alerts)
- Stripe (payment intent creation)

## Features

### Public pages

- Home with hero, featured dishes, testimonials, CTA
- About with values/team/statistics content
- Menu with category filter tabs and veg/non-veg badges
- Gallery with lightbox navigation
- Reservations form posting to `/api/reservations`
- Delivery order form posting to `/api/orders`
- Contact form posting to `/api/contacts`

### Admin page

- `/admin` tabbed dashboard for:
  - Reservations list
  - Orders list
  - Contact submissions list
  - Placeholder message for menu management UI

### Backend/API

- Reservation create/list endpoints
- Order create/list endpoints
- Contact create/list endpoints
- Menu item CRUD endpoints

### Email integration

- Reservation confirmation emails
- Order confirmation emails (only when a valid email is provided)
- Contact acknowledgement emails

### WhatsApp integration (internal alerts)

- New order alerts to owner WhatsApp
- New reservation alerts to owner WhatsApp
- New contact form alerts to owner WhatsApp
- Admin smoke-test endpoint: `POST /api/admin/whatsapp-test`

### Menu data tools

- Seed script to populate menu items in MongoDB: `npm run seed:menu`

## API Endpoints

- `POST /api/reservations` create reservation
- `GET /api/reservations` list reservations
- `POST /api/orders` create delivery order
- `GET /api/orders` list orders
- `POST /api/contacts` create contact message
- `GET /api/contacts` list contact messages
- `POST /api/admin/whatsapp-test` send a WhatsApp smoke-test message (admin cookie or token header)
- `GET /api/menu-items` list menu items (optional `?category=` filter)
- `POST /api/menu-items` create menu item
- `PUT /api/menu-items/[id]` update menu item
- `DELETE /api/menu-items/[id]` delete menu item

## Data Models

- Reservation: guest details, date/time, guests, occasion, special requests, status
- Order: customer details, address, order description, payment method, amount, Stripe payment id, status
- Contact: sender details, subject, message, status
- MenuItem: emoji, name, description, price, category, vegetarian flag, availability

## Prerequisites

- Node.js 20+
- npm
- MongoDB Atlas (or compatible MongoDB instance)
- Optional: Resend account
- Optional: Stripe account

## Environment Variables

Copy `.env.example` to `.env.local` and set real values.

Required for app startup:

- `MONGODB_URI`

Used by features:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `ORDER_NOTIFICATION_WHATSAPP_TO`
- `TWILIO_ORDER_CONTENT_SID` (optional)
- `TWILIO_RESERVATION_CONTENT_SID` (optional)
- `TWILIO_CONTACT_CONTENT_SID` (optional)
- `TWILIO_TEST_CONTENT_SID` (optional)
- `WHATSAPP_TEST_TOKEN` (optional, for calling WhatsApp test endpoint without admin UI cookie)
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SITE_URL`

Notes:

- If `RESEND_API_KEY` is missing/invalid, the app still works but skips sending emails.
- If Twilio WhatsApp vars are missing, form/order/reservation creation still succeeds and only email notifications are sent.
- If Twilio Content SID vars are provided, WhatsApp notifications use template messages (`ContentSid` + `ContentVariables`).
- If Twilio Content SID vars are not provided, WhatsApp notifications use plain text (`Body`) as fallback.
- Twilio sandbox recipients must join the sandbox every 72 hours (`join <sandbox-name>`) for WhatsApp delivery.
- Stripe is only used when `paymentMethod === credit_card`.

## Production Notification Checklist

Use this checklist when setting up or troubleshooting production notifications.

1. Configure Vercel Production env vars:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `ORDER_NOTIFICATION_EMAIL`
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_WHATSAPP_FROM`
  - `ORDER_NOTIFICATION_WHATSAPP_TO`
  - `TWILIO_ORDER_CONTENT_SID` (optional)
  - `TWILIO_RESERVATION_CONTENT_SID` (optional)
  - `TWILIO_CONTACT_CONTENT_SID` (optional)
  - `TWILIO_TEST_CONTENT_SID` (optional)

2. Redeploy after env changes:
  - `npx vercel --prod --yes`

3. Validate order notifications:
  - Submit `POST /api/orders`
  - Confirm email log: `notification:restaurant-order-notification sent`
  - Confirm WhatsApp log: `notification:restaurant-order-whatsapp sent`

4. Validate reservation notifications:
  - Submit `POST /api/reservations`
  - Confirm email log: `notification:restaurant-reservation-notification sent`
  - Confirm WhatsApp log: `notification:restaurant-reservation-whatsapp sent`

5. Validate contact notifications:
  - Submit `POST /api/contacts` with valid subject (`general`, `catering`, `events`, `feedback`)
  - Confirm email log: `notification:restaurant-contact-notification sent`
  - Confirm WhatsApp log: `notification:restaurant-contact-whatsapp sent`

6. Validate admin smoke endpoint:
  - Call `POST /api/admin/whatsapp-test` (admin cookie or `x-whatsapp-test-token`)
  - Confirm log: `notification:restaurant-whatsapp-test sent`

7. Twilio Sandbox checks (trial accounts):
  - Join sandbox from recipient phone (`join <sandbox-name>`)
  - Rejoin every 72 hours
  - Ensure recipient has not sent `stop`

## Local Development

From `nextjs-app`:

```bash
npm install
```

Create env file:

```bash
cp .env.example .env.local
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env.local
```

Start dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful Scripts

- `npm run dev` start dev server
- `npm run build` production build
- `npm run start` start production server
- `npm run lint` run ESLint
- `npm run seed:menu` seed menu collection in MongoDB

## Deployment

### Vercel

`vercel.json` is already configured:

- install: `npm install`
- build: `npm run build`
- dev: `npm run dev`

Set all required environment variables in Vercel project settings.

If you add or change Twilio variables in Vercel, redeploy once so the new values are applied to production functions.

### VPS/VM (Node + PM2 + Nginx)

- PM2 config: `ecosystem.config.cjs`
- Nginx reverse proxy sample: `deploy/nginx/ssr-restaurant.conf`

Typical flow:

1. `npm install`
2. `npm run build`
3. `pm2 start ecosystem.config.cjs`
4. Configure Nginx with provided sample and reload Nginx

## Legacy Static Site (Root Folder)

The root-level HTML/CSS/JS version is still present and can be opened directly in browser (for simple hosting or reference).

Characteristics:

- No database
- No backend/API persistence
- Front-end form submissions are simulated
- Shared navbar/footer injected by `js/layout.js`

## Current Implementation Notes

The following are important behaviors from the current codebase:

- The `/admin` page is currently open and does not enforce authentication.
- Order amount in `POST /api/orders` is currently estimated using a random value (`300` to `800`) rather than line-item totals.
- `POST /api/orders` currently returns a placeholder `clientSecret` string when a card payment intent is created.
- Some static copy differs between legacy pages and Next.js pages (e.g., location wording); this is content-level and can be unified later.

## Recommended Next Improvements

1. Add real admin authentication/authorization using `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and JWT.
2. Replace random order amount with structured cart items + deterministic total calculation.
3. Return actual Stripe `client_secret` and complete client-side payment confirmation flow.
4. Add endpoint protection and rate limiting for public form APIs.
5. Add tests for API routes and form submission paths.

## License

No license file is currently present in this repository. Add one if you plan to distribute this project publicly.
