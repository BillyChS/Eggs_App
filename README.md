# 🥚 Eggs_App

A mobile-first financial management app built to track a small egg-selling business — daily sales, credit sales, monthly expenses, and profit, in one simple place.

The project started as a way to help my father manage his egg business without spreadsheets or paper notebooks. Since he's the primary user, every UI decision — large touch targets, readable text, predictable flows — was made with an older, non-technical user in mind first. Accounts aren't self-registered; his account is provisioned ahead of time and handed to him ready to use.

![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![.NET](https://img.shields.io/badge/ASP.NET%20Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## 📖 About

Eggs_App lets the business owner:

- Register daily **sales** of egg cartons, with a dynamic price entered per transaction — cash or credit.
- Track **credit customers** and collect on outstanding balances, with full or partial payments (*abonos*).
- Track monthly **expenses** by category, with a quick-pick dropdown for recurring purchases.
- Search and edit/delete any past sale or expense from a searchable monthly history.
- Generate a **monthly financial summary** — revenue, expenses, pending receivables, and net profit — at a glance.
- Do all of this through a simple, accessible mobile interface designed for an elderly, non-technical primary user.

---

## 🏗️ Tech Stack & Architecture

| Layer | Stack |
|---|---|
| **Frontend** | React Native + TypeScript, Expo Go (mobile-first, no dev build) |
| **Backend** | ASP.NET Core 8 Web API — **Vertical Slice Architecture** + MediatR + FluentValidation |
| **Database** | SQL Server + Entity Framework Core |
| **Auth** | JWT (Bearer tokens, 30-day expiration), BCrypt password hashing |

**Why Vertical Slice instead of Clean Architecture?** The project is small today but expected to grow. Vertical Slice gives feature isolation (`Features/Auth`, `Features/Sales`, `Features/Expenses`, `Features/Customers`, `Features/Reports`, `Features/Categories`) without the layering overhead of Clean Architecture — adding a new feature doesn't touch the others. Every feature slice follows the same shape: `Command`/`Query` → `Handler` → `Validator`.

Full backlog is tracked in Jira — project key **`EA`**.

---

## 📱 Screens

- **Inicio (Home)** — quick access grid with this month's profit, sales, and expenses at a glance; "Por cobrar" warning card when pending receivables exist; primary and secondary action buttons.
- **Registrar venta** — daily sales entry (carton type, quantity, price) with a confirm-payment modal to choose cash or credit (with customer name).
- **Registrar gasto** — expense entry with a category dropdown (plus free-text "Otro") and a day-by-day date picker.
- **Ver historial** — monthly sales & expenses history, tabbed, with real-time search (by customer name / expense category), and view/edit/delete on any entry.
- **Cobros (Cuentas por cobrar)** — customer-centric view of everyone with an outstanding balance, with search; tapping a customer opens their full ledger (pending sales, abonos per sale, running balance), with actions to register a partial payment (*abono*) or mark a sale as fully paid.
- **Resumen General** — monthly summary: net profit, sales revenue collected, pending receivables (shown separately from profit), and expenses broken down by category.

Navigation is handled through a shared header with a ☰ menu that dynamically lists every screen except the one you're currently on, plus a "Cerrar sesión" (logout) option.

---

## ✅ What's done

**Core setup**
- [x] React Native + TypeScript project (mobile-first, Expo Go)
- [x] ASP.NET Core 8 Web API — Vertical Slice Architecture + MediatR
- [x] SQL Server + EF Core, migrations up to date with the credit/receivables model
- [x] Scalable, modular architecture on both ends

**Authentication & Security**
- [x] JWT auth feature slice — Login (backend), BCrypt password hashing
- [x] Login screen + Auth context (frontend), token persisted in AsyncStorage
- [x] `/register` locked down to `[Authorize(Roles = "Admin")]` — no public self-signup; accounts are provisioned ahead of time by the developer
- [x] Every Sales/Expenses/Customers/Reports endpoint scoped by the caller's `UserId` from the JWT (no cross-user data access)

**Sales**
- [x] Sales feature slice — dynamic price per transaction, cash or credit
- [x] Daily sales registration screen with confirm-payment modal
- [x] Edit / delete a sale from Historial

**Credit & Receivables**
- [x] Credit sales — `IsCredit` flag + `CustomerId` FK on each sale
- [x] Customer entity — auto-created/reused by name when a credit sale is registered
- [x] `Abono` (partial payment) ledger, tied to a specific sale
- [x] `POST /Sales/{id}/abonos` — registers a partial payment, auto-marks the sale paid once the balance hits zero; server-side clamps the amount to the remaining balance
- [x] Customer-centric Cobros screen — balance list, search, per-customer detail modal with pending sales + abono history, register-abono and pay-in-full actions
- [x] Home screen "Por cobrar" summary card showing total pending receivables

**Expenses**
- [x] Expenses feature slice — Create, Get, Update, Delete
- [x] Monthly expense registration screen with recurring-category dropdown
- [x] Edit / delete an expense from Historial

**Reports**
- [x] Monthly financial summary endpoint (sales, expenses, pending receivables, net profit)
- [x] Monthly financial summary screen with month/year picker

**History & Search**
- [x] Monthly sales & expenses history, tabbed
- [x] Real-time search bar (sales by customer, expenses by category) in both Historial and Cobros

**UX & config**
- [x] Light/dark theme toggle with persistence
- [x] Reusable color-coded toast + modal feedback system (no native alerts)
- [x] Centralized API base URL via env vars + externalized JWT expiration
- [x] Accessibility pass: 52–56px touch targets, 16–18px text, predictable flows
- [x] Keyboard-handling fixes (Android edge-to-edge, safe-area insets on footer buttons)
- [x] Dynamic ☰ navigation menu (filters out current screen)
- [x] Centralized app routes (`appRoutes.ts`) — single source of truth for screen names and icons

---

## 🗺️ Roadmap

**Sales & Customers**
- [ ] Sell by unit or kg, in addition to cartons (A = 15 / B = 30)
- [ ] Customer-level notes / contact management beyond name + phone

**Reports & Dashboard**
- [ ] Home dashboard with sales trend charts and KPIs
- [ ] Monthly sales goal with progress tracking
- [ ] Flexible date-range summary endpoint with time series
- [ ] Export monthly summary to PDF / Excel

**Platform & Infra**
- [ ] Desktop version via React Native Web (Phase 2)
- [ ] Offline sales/expense registration with auto-sync
- [ ] Host backend + database in the cloud with automated backups
- [ ] Enforce HTTPS end-to-end (currently HTTP-only on the local network) — re-enable `UseHttpsRedirection` and move the mobile client off a hardcoded `http://` LAN IP

**Auth & Security**
- [ ] Refresh tokens for session revocation
- [ ] Persistent audit logging of key actions
- [ ] Finer-grained roles/permissions beyond the current single `Admin` role

---

## ⚙️ Local Setup

### Backend (ASP.NET Core)
```bash
cd Eggs_App.API
dotnet restore
dotnet ef database update   # applies migrations to SQL Server
dotnet run                  # API runs on the port set in launchSettings.json (default: http://localhost:5243)
```

### Frontend (React Native + Expo)
```bash
cd Eggs_App_Mobile
npm install
echo "EXPO_PUBLIC_API_URL=http://<your-machine-local-ip>:5243/api" > .env
npx expo start
```
> The app runs over your local network via Expo Go — make sure your phone and your dev machine are on the same Wi-Fi, and that `EXPO_PUBLIC_API_URL` points to your machine's local IP (not `localhost`). `.env` is git-ignored, so each machine sets its own.

### First user (bootstrap)
`POST /api/auth/register` requires an authenticated Admin, so there's no way to create the very first account through the running app. To provision one:
1. Temporarily comment out `[Authorize(Roles = "Admin")]` on `AuthController.Register`.
2. Run the API locally and call `POST /api/auth/register` once (via Swagger) with the real username/password.
3. Restore the `[Authorize]` attribute before leaving the API reachable on the network.

From then on, that account can log in and create any further accounts through `/register` itself.

---

## 👤 Author

**Billy Chacón** — Software Development Engineer (.NET & React Fullstack)
