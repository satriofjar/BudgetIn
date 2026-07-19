# BudgetIn

A personal finance tracker for income, expenses, and investments — with per-category monthly budgets and monthly/yearly dashboards. Multi-user, with each user's data kept fully private.

## Features

- **Dashboard** — monthly and yearly summaries: total income/expense/investment, current month balance (auto-carried over from prior months), total saving, excess fun money, per-category planned-vs-actual breakdown with over-budget indicators, expense composition chart, and a yearly income/expense/investment trend chart.
- **Transactions** — add, edit, delete, search, and filter (by period, type, category) with pagination and CSV export.
- **Categories** — fully custom per-user categories (expense / income / investment) with a monthly planned budget and optional notes. A category still referenced by transactions can't be deleted.
- **Auth** — Google Sign-In via Firebase Authentication; all data is scoped and isolated per user.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4 + [shadcn/ui](https://ui.shadcn.com) (built on [Base UI](https://base-ui.com))
- [Firebase](https://firebase.google.com) — Firestore (data) + Authentication (Google Sign-In)
- [Recharts](https://recharts.org) for charts, [react-hook-form](https://react-hook-form.com) + [Zod](https://zod.dev) for forms

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Firebase

Create a project at the [Firebase console](https://console.firebase.google.com), then:

- Enable **Authentication → Sign-in method → Google**.
- Create a **Firestore** database.
- Under **Project settings → Your apps**, add a Web app and copy its config values.

Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 3. Deploy Firestore security rules and indexes

Publish the contents of [`firestore.rules`](./firestore.rules) via **Firestore Database → Rules** in the console (or `firebase deploy --only firestore:rules` if you have the Firebase CLI set up).

Composite indexes are defined in [`firestore.indexes.json`](./firestore.indexes.json). If you don't deploy them upfront, Firestore will surface a direct "create index" link in the browser console the first time a query needs one — just click it.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |

## Data model

All data lives under a per-user scope in Firestore:

```
users/{userId}
users/{userId}/categories/{categoryId}    # name, type, plannedBudget, notes
users/{userId}/transactions/{transactionId}  # date, type, categoryId, description, amount
```

Categories have three parallel types — `expense`, `income`, `investment` — each fully custom per user (no locked default list). Security rules enforce that a category can't be deleted while transactions still reference it, and that users can only ever read or write their own data.

## Formulas

- **Total Saving** = Income − Expense
- **Excess Fun Money** = Income − Expense − Investment
- **Current month balance** = prior months' carried-over balance + Income − Expense − Investment
