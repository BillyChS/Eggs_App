# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Eggs App is a small-business management app for tracking egg sales, expenses, and monthly profit reports. It consists of two sub-projects:

- **`Eggs_App.API/`** — ASP.NET Core 8 REST API (C#)
- **`Eggs_App_Mobile/`** — React Native / Expo mobile app (TypeScript)

---

## API (`Eggs_App.API`)

### Running & Building

```powershell
# From Eggs_App.API/
dotnet run
dotnet build
```

Swagger UI is available at `http://localhost:5243/swagger` in development.

### Database Migrations

```powershell
# From Eggs_App.API/
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

### Architecture

The API follows a vertical slice / CQRS pattern using **MediatR**:

- `Controllers/` — thin controllers that delegate entirely to MediatR (`_mediator.Send(command)`)
- `Features/<Domain>/<Operation>/` — each feature has its own `Command`/`Query`, `Handler`, and `Validator` (FluentValidation)
- `Infrastructure/Data/` — `AppDbContext` (EF Core + SQL Server) and entity classes
- `Migrations/` — EF Core migration history

**Auth flow**: `LoginHandler` validates credentials with BCrypt, then issues a JWT (7-day expiry). The JWT carries `NameIdentifier`, `Name`, and `Role` claims. All protected endpoints extract `UserId` from `ClaimTypes.NameIdentifier` via `IHttpContextAccessor`.

**Reports** use Minimal API endpoints (`ReportsEndpoints.cs`) mapped via `app.MapReportsEndpoints()`, while Sales, Expenses, and Auth use MVC controllers.

**Key config** (in `appsettings.json`):
- `ConnectionStrings:DefaultConnection` — SQL Server connection string
- `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience` — JWT signing config

---

## Mobile (`Eggs_App_Mobile`)

### Running

```bash
# From Eggs_App_Mobile/
npx expo start          # start dev server
npx expo start --android
npx expo start --ios
```

### Architecture

- `src/context/AuthContext.tsx` — global auth state; stores JWT in `AsyncStorage`, exposes `login`/`logout` and the current `token`
- `src/navigation/AppNavigator.tsx` — token-gated navigation: authenticated users see Home/CreateSale/CreateExpense/Summary; unauthenticated users see Login only
- `src/services/` — axios-based API clients (`authService`, `salesService`, `expensesService`, `reportsService`); each reads the JWT from `AsyncStorage` to set the `Authorization: Bearer` header
- `src/screens/` — one folder per domain (auth, home, sales, expenses, reports)
- `src/components/` — shared UI components (`ScreenHeader`, `HomeButton`)

### API Base URL

The mobile app hardcodes the API URL to the local network IP:

```ts
const API_URL = 'http://192.168.100.125:5243/api';
```

Update this in each service file (`authService.ts`, `salesService.ts`, `expensesService.ts`, `reportsService.ts`) when the server IP changes.

---

## Domain Model

- **Sale**: `CartonType` (int enum), `Quantity`, `PricePerCarton`, `TotalAmount` (computed on save), `SaleDate` (local time, not UTC), `UserId`
- **Expense**: `Name`, `Amount`, `Description`, `CategoryId` (nullable FK), `ExpenseDate`, `UserId`
- **Category**: lookup table for expense categories
- **User**: `Username` (unique), `PasswordHash` (BCrypt), `Role`
