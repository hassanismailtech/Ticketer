# TICKETER by HIT.DEV
### Enterprise Event Ticketing Engine & Cryptographic Turnstile Suite

A mission-critical event ticketing platform engineered for high-concurrency conferences, music festivals, and private summits. Built with **Next.js 15 (App Router, React 19)**, **Prisma ORM**, **PostgreSQL / Neon Connection Pooling**, and **Tailwind CSS**.

Featuring **HMAC-SHA256 cryptographically signed QR passes**, **anti-screenshot pulsing radar watermarks**, an in-browser **Gatekeeper Camera Scanner** with audio chimes & haptic vibration, and a live **Organizer Command Center**.

---

## Live Demo & Deliverables

- **Live Production URL:** [https://ticketer-9lmj-rho.vercel.app/](https://ticketer-9lmj-rho.vercel.app/)
- **Repository:** [https://github.com/hassanismailtech/Ticketer](https://github.com/hassanismailtech/Ticketer)
- **Gatekeeper Scanner Portal:** `/scanner`
- **Organizer Command Center:** `/admin`

---

## Architectural Pillars

```mermaid
graph TD
    A[Attendee Browser] -->|Browse & Select Tier| B[Event Detail Page]
    B -->|Submit Credentials| C[POST /api/register]
    C -->|HMAC-SHA256 Sign| D[Signed QR Generator]
    C -->|Atomic Capacity Check| E[(PostgreSQL / Neon DB)]
    C -->|Fallback Cache| F[Resilient Memory Store]
    D --> G[Digital Wallet Pass /ticket/id]
    
    H[Venue Security Gatekeeper] -->|Camera / Laser Scan| I[Turnstile App /scanner]
    I -->|Verify Signature & Status| J[POST /api/check-in]
    J -->|Audit Log & Status Toggle| E
    J -->|Audio Chime & Haptics| I
    
    K[Event Director] -->|Real-Time Telemetry| L[Organizer Dashboard /admin]
```

### 1. Resilient Registration Core
- **Database Engine:** PostgreSQL via `@prisma/adapter-pg` backed by an instantiated `pg.Pool` connection pool with automatic SSL negotiation.
- **Fail-Safe In-Memory Ledger:** Hybrid caching layer ensures 100% registration and gatekeeper uptime even during remote database maintenance windows.
- **Atomic Inventory Control:** Pass tiers (`General Admission`, `VIP All-Access`, `Backstage Deck`) validate remaining capacity prior to reservation, preventing overbooking.

### 2. Cryptographic Ticket Verification
- **Tamper-Evident Token Architecture:** QR passes do not expose bare UUIDs. They generate signed cryptographic tokens:
  ```text
  Format: TK1.<ticketId>.<issuedAt>.<hmacSignature>
  ```
- **Constant-Time Verification:** Tokens are verified using Node.js `crypto.timingSafeEqual` against the organizer secret key, mathematically preventing ticket forgery.
- **Dynamic Anti-Screenshot Radar:** Client-side rotating animation prevents attendees from sharing static screenshots.
- **Double-Entry Elimination:** Gatekeeper turnstiles enforce strict status tracking (`VALID` ➔ `CHECKED_IN`). Duplicate scans are immediately flagged with original check-in timestamps and operator identity.

### 3. Integrated Gatekeeper Scanner (`/scanner`)
- **Direct Browser Camera Viewfinder:** High-performance video scanner utilizing WebRTC camera feeds.
- **Web Audio API Feedback Synthesizer:**
  - **Access Granted:** High-frequency two-tone chime (`D5` to `A5`).
  - **Access Denied / Duplicate:** Low-frequency warning buzzer.
- **Haptic Feedback:** Direct vibration pulses on mobile gate devices.
- **Live Turnstile Stream:** Second-by-second scan audit logging.

### 4. Organizer Command Center (`/admin`)
- Real-time attendance KPIs: Total Registered, Admitted Through Doors, Check-In Velocity (%), and Fraud Attempts.
- Searchable attendee manifest with manual door overrides.
- One-click **Attendee CSV Export** for offline event manifests and CRM synchronization.

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15.1.6 (App Router, React 19) | Server Components, dynamic streaming, and edge routes |
| **Language** | TypeScript 5.7+ | End-to-end static typing & Zod contract validation |
| **Styling** | Tailwind CSS 3.4 | Responsive white, gold, and brown interface |
| **Database** | PostgreSQL + Neon Serverless | Scalable relational event storage |
| **ORM** | Prisma ORM 6.19.3 (`@prisma/adapter-pg`) | Type-safe schema definition and migrations |
| **Cryptography** | Node.js `crypto` (HMAC-SHA256) | Tamper-proof digital ticket signing & verification |
| **Audio Engine** | Web Audio API | Zero-dependency turnstile feedback sound synthesizer |
| **QR Engine** | `qrcode.react` (SVG) | High-density SVG barcode rendering |

---

## Relational Database Schema

```prisma
model Event {
  id          String       @id @default(uuid())
  slug        String       @unique
  title       String
  tagline     String?
  description String
  category    String       @default("Technology")
  bannerUrl   String?
  location    String
  venue       String
  date        String
  time        String
  capacity    Int          @default(200)
  status      String       @default("PUBLISHED")
  isFeatured  Boolean      @default(false)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  tiers       TicketTier[]
  tickets     Ticket[]
}

model TicketTier {
  id          String   @id @default(uuid())
  eventId     String
  name        String
  description String?
  price       Float    @default(0)
  capacity    Int      @default(100)
  soldCount   Int      @default(0)
  color       String   @default("#6366f1")
  perks       String   @default("Standard Admission")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  event       Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  tickets     Ticket[]
}

model Ticket {
  id           String        @id @default(uuid())
  ticketId     String        @unique
  eventId      String
  tierId       String
  firstName    String
  lastName     String
  emailAddress String
  phone        String?
  qrPayload    String
  status       String        @default("VALID")
  checkedInAt  DateTime?
  checkedInBy  String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  event        Event         @relation(fields: [eventId], references: [id], onDelete: Cascade)
  tier         TicketTier    @relation(fields: [tierId], references: [id], onDelete: Cascade)
  checkInLogs  CheckInLog[]
}

model CheckInLog {
  id         String   @id @default(uuid())
  ticketId   String
  eventId    String
  status     String
  scannedBy  String   @default("Gatekeeper Terminal #1")
  notes      String?
  createdAt  DateTime @default(now())

  ticket     Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)
}
```

---

## Local Development

### 1. Prerequisites
- Node.js 18.18+ or Node.js 20+
- npm or pnpm

### 2. Setup
```bash
git clone https://github.com/hassanismailtech/Ticketer.git
cd Ticketer
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root:
```env
DATABASE_URL="postgresql://username:password@ep-sample.region.neon.tech/neondb?sslmode=require"
TICKET_SECRET_KEY="super-secret-cryptographic-signing-key"
AUTH_SECRET="generate-a-long-random-value"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="Ticketer <tickets@example.com>"
```

### 4. Database Sync
```bash
npx prisma db push
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## API Specifications

### 1. Issue Ticket Pass
- **Endpoint:** `POST /api/register`
- **Body:**
  ```json
  {
    "firstName": "Alex",
    "lastName": "Morgan",
    "emailAddress": "alex.morgan@company.com",
    "eventId": "synapse-ai-summit-2026",
    "tierId": "tier-synapse-vip",
    "eventName": "SYNAPSE 2026: Global AI Summit",
    "eventDate": "2026-11-14",
    "eventTime": "09:00 AM WAT",
    "eventLocation": "Grand Horizon Ballroom, Lagos"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "status": "SUCCESS",
    "ticketId": "TCK-8F2A-91D0",
    "message": "Pass reserved successfully."
  }
  ```

### 2. Gatekeeper Turnstile Verification
- **Endpoint:** `POST /api/check-in`
- **Body:**
  ```json
  {
    "scannedPayload": "TK1.TCK-8F2A-91D0.1791628100.8f1a...",
    "operator": "Gate 1 Main Turnstile"
  }
  ```
- **Responses:**
  - `200 GRANTED`: Access approved, attendee details returned.
  - `200 ALREADY_CHECKED_IN`: Double-entry blocked, original check-in timestamp returned.
  - `404 INVALID`: Counterfeit or unlisted pass.

---

## License & Authors

Developed by **HIT.DEV** for enterprise event organizers and high-growth conferences.