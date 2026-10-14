# TICKETER by HIT.DEV

Lightweight event discovery, registration, secure QR tickets, and role-aware venue operations for modern events.

Ticketer is built with **Next.js 15 App Router**, **React 19**, **TypeScript**, **Prisma**, **PostgreSQL on Neon**, **Auth.js**, and **Tailwind CSS**. The public experience is attendee-first: discover an event, choose a pass, register, and keep the resulting QR ticket in an account. Staff tools are separated behind authenticated roles.

## Product Flows

### Attendee

1. Browse featured and upcoming events at `/`.
2. Open an event at `/event/[id]`.
3. Choose a tier and register.
4. View the secure pass at `/ticket/[ticketId]`.
5. Sign in at `/login` or create an account at `/signup`.
6. View account-linked tickets at `/account`.

Registration remains available to guests. When an attendee is signed in, the ticket is associated with their account and appears in `/account`.

### Organizer

Organizers and administrators access the operations workspace at `/admin`. The workspace includes attendee manifests, attendance KPIs, status controls, and CSV export.

### Gatekeeper

Gatekeepers access `/scanner` to verify QR passes using a camera or manual payload entry. The scanner provides admission results, duplicate-entry detection, haptic feedback, audio feedback, and a recent audit stream.

Anonymous visitors do not see staff destinations in the public navigation. `/admin` and `/scanner` are server-protected and redirect unauthenticated or unauthorized users.

## Routes

| Route | Purpose | Access |
| :--- | :--- | :--- |
| `/` | Featured event discovery and event calendar | Public |
| `/event/[id]` | Event details, tiers, and registration | Public |
| `/ticket/[ticketId]` | Digital QR ticket pass | Public ticket link |
| `/login` | Password, Google, and email-link sign in | Public |
| `/signup` | Password account creation | Public |
| `/account` | Signed-in attendee tickets | Authenticated |
| `/admin` | Organizer operations workspace | `ORGANIZER`, `ADMIN` |
| `/scanner` | Gatekeeper QR verification terminal | `GATEKEEPER`, `ORGANIZER`, `ADMIN` |

## Architecture

```mermaid
graph TD
    A[Attendee] --> B[Event Discovery /]
    B --> C[Event Details /event/id]
    C --> D[POST /api/register]
    D --> E[Signed QR Ticket /ticket/ticketId]
    E --> F[Attendee Account /account]

    G[Auth.js] --> H[(Neon PostgreSQL)]
    D --> H
    I[Staff Scanner /scanner] --> J[POST /api/check-in]
    J --> H
    K[Organizer Workspace /admin] --> H
```

## Security Model

- Auth.js uses the Prisma adapter with database-backed sessions.
- Supported sign-in methods are Google OAuth, email and password, and optional email magic links.
- Passwords are hashed with `bcryptjs`; plaintext passwords are never stored.
- User roles default to `ATTENDEE`. Staff roles are `GATEKEEPER`, `ORGANIZER`, and `ADMIN`.
- `/admin` and `/scanner` use server-side role checks in route layouts.
- `POST` and `GET /api/check-in` enforce staff authentication independently of the UI.
- Authenticated registrations store the signed-in user ID on the ticket.
- QR payloads use HMAC-SHA256 signatures and constant-time verification.
- `TICKET_SECRET_KEY`, `AUTH_SECRET`, database credentials, OAuth secrets, and SMTP credentials must remain environment variables.
- The application sets security headers including `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and a restricted `Permissions-Policy`.

Role assignment is intentionally not self-service. New accounts are attendees. Promote trusted staff accounts directly in the database or through a future administrative role-management workflow.

## Data Layer

Neon is the current PostgreSQL provider. Prisma connects through `@prisma/adapter-pg` and `pg.Pool`, with SSL enabled for remote/Neon connections. Supabase is not required for the current architecture because it would duplicate the existing PostgreSQL and authentication responsibilities.

The schema includes:

- `Event` and `TicketTier` for event inventory.
- `Ticket` for attendee identity, QR payload, status, and optional `userId` ownership.
- `CheckInLog` for gate audit records.
- `User`, `Account`, `Session`, and `VerificationToken` for Auth.js.

Run the current schema against the configured database with:

```bash
npx prisma db push
npx prisma generate
```

The application retains an in-memory fallback for ticket registration and scan logs, but production data and durable authentication require a working PostgreSQL connection.

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| Framework | Next.js 15.1.11 | App Router, server rendering, route handlers |
| Language | TypeScript 5.7+ | Static typing and build-time validation |
| UI | React 19, Tailwind CSS 3.4 | Light event-discovery and operations interfaces |
| Database | PostgreSQL on Neon | Durable events, tickets, users, and audit data |
| ORM | Prisma 6.19.3 | Schema and database access |
| Authentication | Auth.js 5 beta | Google, credentials, email links, database sessions |
| Password hashing | bcryptjs | Password verification and storage safety |
| Ticket security | Node.js crypto | HMAC-SHA256 QR signing and verification |
| QR rendering | qrcode.react | Digital ticket QR codes |
| Deployment | Vercel | Preview and production deployments |

## Local Development

### Prerequisites

- Node.js 20 or newer
- npm
- A PostgreSQL database, currently Neon

### Setup

```bash
git clone https://github.com/hassanismailtech/Ticketer.git
cd Ticketer
npm install
```

Create `.env` in the project root. Do not commit it:

```env
DATABASE_URL="postgresql://username:password@ep-sample.region.neon.tech/neondb?sslmode=require"
TICKET_SECRET_KEY="a-long-random-ticket-signing-secret"
AUTH_SECRET="a-long-random-auth-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="Ticketer <tickets@example.com>"
```

`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `EMAIL_SERVER`, and `EMAIL_FROM` are optional during initial development. Google and magic-link sign-in become available when their values are configured. `AUTH_SECRET`, `DATABASE_URL`, and `TICKET_SECRET_KEY` are required for a real deployment.

Sync the database and start the app:

```bash
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev               # Start local development
npm run build             # Create a production build
npm run start             # Run the production build
npm run typecheck         # Run TypeScript validation
npm test                  # Run cryptographic regression tests
npx prisma generate       # Generate the Prisma client
npx prisma db push        # Sync schema to the configured database
npm run vercel:preview    # Deploy a Vercel preview with npx
npm run vercel:production # Deploy to the Vercel production target
```

Before production deployment, configure the environment variables in Vercel for both the relevant Preview and Production environments. A successful CI build alone does not promote a deployment to the production alias; the deployment must target Production or be promoted in Vercel.

## API

### `POST /api/register`

Issues a signed ticket. The request includes attendee details, event ID, tier ID, and event display metadata. The response returns a ticket ID and the ticket page location can be constructed as `/ticket/{ticketId}`.

### `POST /api/check-in`

Requires a `GATEKEEPER`, `ORGANIZER`, or `ADMIN` session.

```json
{
  "scannedPayload": "TK1.TCK-8F2A-91D0.1791628100.8f1a...",
  "operator": "Gate 1 Main Turnstile"
}
```

Possible outcomes include `GRANTED`, `ALREADY_CHECKED_IN`, `INVALID`, and `UNAUTHORIZED`.

### `GET /api/check-in`

Returns the recent scan stream and summary statistics. It also requires a staff role.

### Auth.js

The Auth.js route handler is available at `/api/auth/[...nextauth]`. Account creation uses `POST /api/auth/signup`.

## Deployment Checklist

1. Confirm `main` contains the intended changes and CI is green.
2. Confirm Vercel is connected to the correct GitHub repository and production branch.
3. Add `DATABASE_URL`, `TICKET_SECRET_KEY`, and `AUTH_SECRET` to Vercel Production.
4. Add Google OAuth and SMTP variables if those sign-in methods are required.
5. Add the deployed callback URL to Google OAuth configuration: `https://your-production-domain.com/api/auth/callback/google`.
6. Run the Prisma schema sync against the production database before using account or role features.
7. Deploy with `npm run vercel:production` or promote the successful production-branch deployment in Vercel.
8. Verify `/`, `/login`, `/account`, `/admin`, `/scanner`, ticket issuance, and staff check-in on the production domain.

## Live Links

- Production: [ticketer-9lmj-rho.vercel.app](https://ticketer-9lmj-rho.vercel.app/)
- Repository: [github.com/hassanismailtech/Ticketer](https://github.com/hassanismailtech/Ticketer)

## License & Authors

Developed by **HIT.DEV** for event organizers and high-growth conferences.
