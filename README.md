# Ticketer by HIT.DEV

A lightweight event ticketing and QR verification web application built with Next.js, Prisma, PostgreSQL, and Tailwind CSS. It is designed for local business conferences, technology meetups, university workshops, and similar community events.

---

## Live Links and Deliverables

- **Production URL:** [https://ticketer-9lmj-rho.vercel.app/](https://ticketer-9lmj-rho.vercel.app/)
- **Source Code Repository:** [https://github.com/hassanismailtech/Ticketer](https://github.com/hassanismailtech/Ticketer)
- **Demonstration Video:** [https://youtube.com/@hassanismailtech](https://youtube.com/@hassanismailtech)

---

## Project Overview

Ticketer provides a small end-to-end ticketing flow:

1. Visitors land on the homepage and browse three hardcoded event cards sourced from [src/lib/utils.ts](src/lib/utils.ts).
2. Clicking **Register** opens a dynamic event route where the attendee submits `firstName`, `lastName`, and `emailAddress`.
3. The form posts to [src/app/api/register/route.ts](src/app/api/register/route.ts), which validates the payload with `zod`, resolves the matching event from the static event list, and creates a `Ticket` record with Prisma.
4. On success, the app redirects to `/ticket/[ticketId]`, where the attendee details and a client-side SVG QR code are rendered.

The QR payload contains only the `ticketId` UUID string.

---

## Architectural Design and System Scalability

### 1. Serverless Compute Layer

The app uses the Next.js App Router and is deployed on Vercel. The API route at [src/app/api/register/route.ts](src/app/api/register/route.ts) runs as a server-side function, while the page routes are rendered by Next.js as static or server-rendered routes depending on the route.

### 2. Relational Database with Prisma

- **Database Engine:** PostgreSQL.
- **ORM:** Prisma ORM with `@prisma/adapter-pg`.
- **Runtime Connection:** [src/lib/prisma.ts](src/lib/prisma.ts) creates a Prisma Client instance with a PostgreSQL adapter.

The repository currently keeps a fallback PostgreSQL connection string in [prisma.config.ts](prisma.config.ts) and in [prisma/schema.prisma](prisma/schema.prisma) so Prisma Client generation works reliably during install and build.

### 3. Payload-Minimal QR Architecture

The QR code is rendered with `qrcode.react` as an SVG and contains only the `ticketId` UUID. No attendee PII is embedded in the QR payload.

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| Frontend Framework | Next.js 15.1.6 (App Router, React 19) | Routing, page rendering, and API routes |
| Language | TypeScript | Static typing and build-time validation |
| Styling | Tailwind CSS 3.4.17 | Mobile-first light-mode UI |
| Database | PostgreSQL | Persistent ticket storage |
| ORM | Prisma ORM 6.19.3 | Schema definition and database access |
| QR Engine | `qrcode.react` | SVG QR rendering |
| Hosting & CI/CD | Vercel | Builds and deployment |

---

## Database Schema Model

The current Prisma model stores ticket and attendee details directly on the ticket record:

```prisma
model Ticket {
  id            String   @id @default(uuid())
  ticketId      String   @unique
  firstName     String
  lastName      String
  emailAddress  String
  eventId       String
  eventName     String
  eventDate     String
  eventTime     String
  eventLocation String
  createdAt     DateTime @default(now())
}
```

The datasource is configured for PostgreSQL in [prisma/schema.prisma](prisma/schema.prisma).

---

## Repository File Structure

```plaintext
Ticketer/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── register/
│   │   │       └── route.ts
│   │   ├── event/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   └── ticket/
│   │       └── [ticketId]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── EventCard.tsx
│   │   ├── RegistrationForm.tsx
│   │   └── TicketQR.tsx
│   └── lib/
│       ├── prisma.ts
│       └── utils.ts
├── .env.example
├── .eslintrc.json
├── .gitignore
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## Local Setup and Installation

### Prerequisites

- Node.js v18.18.0 or later
- npm or yarn
- A PostgreSQL connection string, such as a Neon database URL

### 1. Clone the Repository

```bash
git clone https://github.com/hassanismailtech/Ticketer.git
cd Ticketer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root for the application runtime and define your PostgreSQL connection string:

```bash
DATABASE_URL="postgresql://username:password@ep-sample-pooler.region.neon.tech/neondb?sslmode=require"
```

### 4. Sync Prisma with the Database

The app includes Prisma generation in `postinstall`, but you can run the commands directly during local development:

```bash
npx prisma generate
npx prisma db push
```

If you prefer migrations, the repository also includes:

```bash
npm run prisma:migrate
```

### 5. Start the Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

If you want Prisma CLI commands to target your Neon or local database instead of the fallback connection, make sure `DATABASE_URL` is set in the shell session where you run them.

---

## Production Deployment Checklist

- Set `DATABASE_URL` in the Vercel project environment variables.
- Keep the repository-level Vercel config in [vercel.json](vercel.json) so the deployment is treated as a Next.js app.
- Confirm the PostgreSQL database is reachable from Vercel.
- `npm install` triggers `prisma generate` through the `postinstall` script, so Prisma Client generation happens during deployment installs.

---

## Notes on Current Behavior

- The homepage event list is static and lives in [src/lib/utils.ts](src/lib/utils.ts).
- There is no separate seed script in the repository.
- The registration form uses local client-side validation and a submit state while the request is in flight.
- The QR code contains only the `ticketId` value.
- A custom 404 page is implemented in [src/app/not-found.tsx](src/app/not-found.tsx).

---

## Author

Developed by HIT.DEV for the 3MTT NextGen Fellowship Capstone Initiative.