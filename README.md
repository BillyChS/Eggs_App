# 🥚 Eggs_App

A mobile-first financial management app built to track a small egg-selling business — daily sales, monthly expenses, and profit, in one simple place.

The project started as a way to help my father manage his egg business without spreadsheets or paper notebooks. Since he's the primary user, every UI decision — large touch targets, readable text, predictable flows — was made with an older, non-technical user in mind first.

![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![.NET](https://img.shields.io/badge/ASP.NET%20Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## 📖 About

Eggs_App lets the business owner:

- Register daily **sales** of egg cartons, with a dynamic price entered per transaction.
- Track monthly **expenses** by category, with a quick-add dropdown for recurring purchases.
- Generate a **monthly financial summary** — revenue, expenses, and net profit — at a glance.
- Do all of this through a simple, accessible mobile interface designed for an elderly, non-technical primary user.

---

## 🏗️ Tech Stack & Architecture

| Layer | Stack |
|---|---|
| **Frontend** | React Native + TypeScript, Expo Go (mobile-first, no dev build) |
| **Backend** | ASP.NET Core Web API — **Vertical Slice Architecture** + MediatR |
| **Database** | SQL Server + Entity Framework Core |
| **Auth** | JWT (Register / Login) |

**Why Vertical Slice instead of Clean Architecture?** The project is small today but expected to grow. Vertical Slice gives feature isolation (`/Features/Auth`, `/Features/Sales`, `/Features/Expenses`, `/Features/Reports`) without the layering overhead of Clean Architecture — adding a new feature doesn't touch the others.

Full backlog is tracked in Jira — project key **`EA`**.

---

## 📱 Screens

- **Inicio (Home)** — quick access grid: two full-width primary actions (Registrar venta / Registrar gasto), a two-column row (Historial / Cuentas por cobrar), and a full-width "Ver Resumen" button.
- **Registrar venta** — daily sales entry.
- **Registrar gasto** — monthly expense entry, with a category dropdown.
- **Ver historial** — sales & expenses history *(currently being upgraded — see below)*.
- **Cuentas por cobrar** — per-customer credit ledger *(planned)*.
- **Ver resumen de ganancias** — monthly summary (revenue, expenses, profit).

Navigation is handled through a shared header with a ☰ menu that dynamically lists every screen except the one you're currently on.

---

## ✅ What's done

**Core setup**
- [x] React Native + TypeScript project (mobile-first, Expo Go)
- [x] ASP.NET Core Web API — Vertical Slice Architecture + MediatR
- [x] SQL Server + EF Core, initial migrations
- [x] Scalable, modular architecture on both ends

**Authentication**
- [x] JWT auth feature slice — Register & Login (backend)
- [x] Login & Register screens + Auth context (frontend)

**Sales**
- [x] Sales feature slice — dynamic price per transaction
- [x] Daily sales registration screen

**Expenses**
- [x] Expenses feature slice — Create & Get endpoints
- [x] Monthly expense registration screen
- [x] Recurring expense products dropdown for quick registration

**Reports**
- [x] Monthly financial summary endpoint (sales, expenses, profit)
- [x] Monthly financial summary screen

**UX & config**
- [x] Light/dark theme toggle with persistence
- [x] Reusable color-coded toast + modal feedback system (no native alerts)
- [x] Centralized API base URL via env vars + externalized JWT expiration
- [x] Accessibility pass: 52–56px touch targets, 16–18px text, predictable flows
- [x] Keyboard-handling fixes (Android edge-to-edge, safe-area insets on footer buttons)
- [x] Dynamic ☰ navigation menu (filters out current screen)

## 🔧 In progress

- [ ] History list (sales & expenses) with edit and delete actions

## 🗺️ Roadmap

**Sales & Customers**
- [ ] Sell by unit or kg, in addition to cartons (A = 15 / B = 30)
- [ ] Optional customer name on sales for detailed tracking
- [ ] Accounts receivable — per-customer credit ledger ("Cuentas por cobrar")
- [ ] Abonos — register partial payments against a customer's balance

**Reports & Dashboard**
- [ ] Home dashboard with sales trend charts and KPIs
- [ ] Monthly sales goal with progress tracking
- [ ] Flexible date-range summary endpoint with time series
- [ ] Export monthly summary to PDF / Excel

**Platform & Infra**
- [ ] Desktop version via React Native Web (Phase 2)
- [ ] Offline sales/expense registration with auto-sync
- [ ] Host backend + database in the cloud with automated backups

**Auth & Security**
- [ ] Admin / SuperAdmin roles and permissions
- [ ] Refresh tokens for session revocation
- [ ] Persistent audit logging of key actions

**UX**
- [ ] Home screen action icons (➕ green / coin) and slightly larger text

---

## ⚙️ Local Setup

### Backend (ASP.NET Core)
```bash
cd backend
dotnet restore
dotnet ef database update   # applies migrations to SQL Server
dotnet run                  # API runs on the port set in launchSettings.json
```

### Frontend (React Native + Expo)
```bash
cd mobile
npm install
cp .env.example .env         # set EXPO_PUBLIC_API_URL to your backend's local IP + port
npx expo start
```
> The app runs over your local network via Expo Go — make sure your phone and your dev machine are on the same Wi-Fi, and that `EXPO_PUBLIC_API_URL` points to your machine's local IP (not `localhost`).

---

## 👤 Author

**Billy Chacón** — Software Development Engineer (.NET & React Fullstack)
