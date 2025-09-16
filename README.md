# Multi-Tenant SaaS Notes Application

## Objective
Develop and deploy a multi-tenant SaaS Notes Application hosted on Vercel. The application allows multiple tenants (companies) to securely manage their users and notes, enforcing role-based access and subscription limits.

---

## Multi-Tenancy Approach

- **Supported Tenants:** Acme and Globex
- **Isolation:** Data belonging to one tenant is never accessible to another.
- **Chosen Approach:**  
  **Shared schema with tenant ID column**  
  All tenant-scoped objects (`User`, `Note`, etc.) include a `tenant` slug (e.g., `acme`, `globex`). All queries are filtered by the authenticated user's tenant, ensuring strict logical isolation.  
  > _Other approaches considered: schema-per-tenant, database-per-tenant. This project uses the shared schema approach for simplicity and scalability._

---

## Authentication & Authorization

- **JWT-based login** (`/auth/login`)
- **Roles:**
  - **Admin:** Can invite users and upgrade subscriptions.
  - **Member:** Can create, view, edit, and delete notes.
- **Seeded Test Accounts** (password: `password`):
  - `admin@acme.test` (Admin, tenant: Acme)
  - `user@acme.test` (Member, tenant: Acme)
  - `admin@globex.test` (Admin, tenant: Globex)
  - `user@globex.test` (Member, tenant: Globex)

---

## Subscription Feature Gating

- **Free Plan:** Tenant limited to a maximum of 3 notes.
- **Pro Plan:** Unlimited notes.
- **Upgrade Endpoint:**  
  `POST /tenants/:slug/upgrade` (Admin only)  
  Upgrading removes the note limit immediately.

---

## Notes API (CRUD)

All endpoints enforce tenant isolation and role restrictions:

- `POST /notes` – Create a note
- `GET /notes` – List all notes for the current tenant
- `GET /notes/:id` – Retrieve a specific note
- `PUT /notes/:id` – Update a note
- `DELETE /notes/:id` – Delete a note

---

## Health Endpoint

- `GET /health` → `{ "status": "ok" }`

---

## Deployment

- **Backend:** Hosted on Vercel (or compatible Node host).  
  - CORS is enabled for API accessibility.
  - Environment variables: `MONGO_URI`, `JWT_SECRET`
- **Frontend:** Hosted on Vercel (`client` folder).  
  - Environment variable: `REACT_APP_API_BASE` or `VITE_API_URL` (points to backend API)

---

## Frontend Features

- Login using predefined accounts
- List, create, and delete notes
- Shows “Upgrade to Pro” prompt when Free tenant reaches note limit

---

## Local Setup

### Backend
1. `cd server`
2. `npm install`
3. Copy `.env.example` → `.env` and set `MONGO_URI` and `JWT_SECRET`
4. `npm run seed` (creates tenants and seeded accounts)
5. `npm run dev` (server runs on port 4000)
6. Health: `GET http://localhost:4000/health`

### Frontend
1. `cd client`
2. `npm install`
3. Copy `.env.example` → `.env` and set `REACT_APP_API_BASE` or `VITE_API_URL` (default: `http://localhost:4000`)
4. `npm start` or `npm run dev` (client runs on port 3000)

---

## Deploying to Vercel

- **Frontend:** Deploy the `client` folder. Set `REACT_APP_API_BASE` or `VITE_API_URL` in Vercel dashboard.
- **Backend:** Deploy the `server` folder. Set `MONGO_URI` and `JWT_SECRET` in Vercel dashboard.
- Ensure backend CORS is enabled and environment variables are set.

---

## Improvements & Notes

- Passwords are hashed (bcrypt).
- Use a production-grade database (MongoDB Atlas recommended).
- For stronger isolation in production, consider schema-per-tenant or database-per-tenant approaches.

---

