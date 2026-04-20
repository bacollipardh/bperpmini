# Kosovo ERP Suite

Enterprise-grade ERP for Kosovo businesses — purchase invoices, sales invoices, sales returns, stock management, and full audit logging, with a clean Next.js admin panel backed by NestJS and PostgreSQL.

---

## Architecture

```
erp-suite/
├── backend/           NestJS + Prisma + PostgreSQL
│   ├── src/
│   │   ├── auth/          JWT auth, guards, strategies
│   │   ├── audit-logs/    Global audit log service
│   │   ├── customers/
│   │   ├── document-series/
│   │   ├── health/        GET /api/health
│   │   ├── item-categories/
│   │   ├── items/
│   │   ├── payment-methods/
│   │   ├── pdf/           PDF generation (PDFKit)
│   │   ├── prisma/        PrismaService
│   │   ├── purchase-invoices/
│   │   ├── roles/
│   │   ├── sales-invoices/
│   │   ├── sales-returns/
│   │   ├── stock/
│   │   ├── suppliers/
│   │   ├── tax-rates/
│   │   ├── units/
│   │   ├── users/
│   │   └── warehouses/
│   └── prisma/
│       ├── schema.prisma
│       ├── seed.ts
│       └── migrations/
└── frontend/          Next.js 15 App Router + Tailwind
    ├── app/
    │   ├── (app)/     Protected pages with AppShell
    │   └── login/     Public login page
    └── components/
```

**Stack:** NestJS 11 · TypeScript · Prisma 6 · PostgreSQL 16 · JWT (bcrypt) · Swagger · PDFKit · Next.js 15 · Tailwind CSS · Docker Compose

---

## Prerequisites

- Docker & Docker Compose (for Docker dev)
- Node.js 22+ & npm (for local dev)
- PostgreSQL 16 (for local dev without Docker)

---

## Environment Setup

### Backend — copy and edit

```bash
cp backend/.env.example backend/.env
```

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/erpdb?schema=public
PORT=3000
CORS_ORIGIN=http://localhost:3001
JWT_SECRET=your-long-random-secret-here
```

### Frontend — copy and edit

```bash
cp frontend/.env.example frontend/.env.local
```

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
INTERNAL_API_BASE_URL=http://localhost:3000/api
```

---

## Docker Development (Recommended)

```bash
# Start all services (builds images on first run)
docker compose up --build

# Seed the database (first time only, after backend is healthy)
docker exec erp-backend npx ts-node prisma/seed.ts
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3000/api |
| Swagger Docs | http://localhost:3000/api/docs |
| Health | http://localhost:3000/api/health |

**Default login:** `admin@erp.local` / `Admin123!`

---

## Local Development

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx ts-node prisma/seed.ts
npm run start:dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

---

## Migrations & Seed

```bash
# Create a new migration
cd backend && npx prisma migrate dev --name <name>

# Deploy pending migrations (production/Docker)
npx prisma migrate deploy

# Seed initial data
npx ts-node prisma/seed.ts
```

Seed creates: roles, admin user, item categories, units, tax rates (18%/8%/0%), warehouses, payment methods, document series, sample items/suppliers/customers.

---

## Build

```bash
cd backend && npm run build     # outputs to dist/
cd frontend && npm run build    # outputs to .next/standalone/
```

---

## Auth

All endpoints except `POST /api/auth/login` and `GET /api/health` require a JWT Bearer token.

```http
POST /api/auth/login
{"email": "admin@erp.local", "password": "Admin123!"}
→ {"accessToken": "...", "user": {...}}

GET /api/auth/me
Authorization: Bearer <token>
```

Token validity: 24 hours. The frontend stores the token in a browser cookie (`erp_token`) and includes it on every request. The Next.js middleware redirects unauthenticated users to `/login`.

---

## Business Rules

1. Only **DRAFT** documents can be edited.
2. **Purchase Invoice post** → stock increases, `PURCHASE_IN` movement created.
3. **Sales Invoice post** → stock decreases; fails with 400 if insufficient stock.
4. **Sales Return post** → stock increases; validates return qty ≤ (sold qty − already returned).
5. Sales invoice status auto-updates to **PARTIALLY_RETURNED** or **FULLY_RETURNED**.
6. Document numbers generated from `DocumentSeries` (prefix + sequential counter).
7. Acting user is derived from JWT — no client-supplied user IDs trusted.
8. All postings are Prisma transactions.
9. Audit log entries on all create/update/post operations.

---

## Tests

```bash
cd backend && npm test
```

Covers: auth login, wrong password, unknown user, stock sufficiency check, avg cost calculation.

---

## Production Notes

- Use a strong random `JWT_SECRET` (32+ chars).
- Use managed PostgreSQL with SSL (`?sslmode=require`).
- Set `CORS_ORIGIN` to your frontend domain.
- Run `prisma migrate deploy` before each deployment.
- Add rate limiting on `/api/auth/login`.
- Use Nginx or Caddy as a reverse proxy with TLS.

---

## Completed

- JWT auth + bcrypt + login/logout UI
- Full CRUD: roles, users, item categories, units, tax rates, warehouses, payment methods, document series, items, suppliers, customers
- Purchase invoice: draft → post (stock in) + PDF
- Sales invoice: draft → post (stock out, insufficient-stock guard) + discounts + PDF
- Sales return: draft → post (stock in, qty guard, invoice status update) + PDF
- Stock balances (weighted avg cost) + movements
- Audit logs
- Swagger at `/api/docs`
- Docker Compose with healthchecks and startup sequencing
- Prisma migrations + seed
- Next.js admin panel: all list/create/edit/detail pages

## Future Enhancements

- Pagination, search, and filtering on all list endpoints
- Per-role endpoint authorization (RBAC guards)
- Kosovo fiscal/SEF integration
- Purchase order workflow
- Customer payment tracking
- Profit/loss and sales analytics reporting
- Refresh token rotation
- CI/CD pipeline
