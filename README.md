# CampusIQ - Premium College Discovery Platform

CampusIQ is a high-performance, responsive, and production-grade college discovery and decision-making platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**. Inspired by Collegedunia and Careers360, CampusIQ is designed to help students discover colleges, compare institutions side-by-side, filter programs, read realistic student reviews, and predict college match probabilities based on entrance exam ranks (JEE Main, NEET, CAT, etc.).

---

## 🚀 Key Features

1. **College Listing & Advanced Search/Filter (`/colleges`)**
   - Live query searching across college names, abbreviations, and locations.
   - Comprehensive multi-faceted filters: State, Course/Program (B.Tech, MBA, MBBS), Fees, and Rating.
   - Dynamic sorting: NIRF Ranking, Fees, Average Placements, Highest Packages, and User Ratings.
   - Full server-side pagination integrated with the URL state.

2. **Slug-Based Detailed College Profile (`/colleges/[slug]`)**
   - High-fidelity visual profile for colleges (e.g., IITs, NITs, VIT, BITS, AIIMS, IIMs).
   - Rich sections: Placement Stats (Average & Highest Packages), Course Details, Infrastructure details, and a dynamic student reviews timeline.
   - Modern tabbed navigation interface with interactive transitions.

3. **Multi-College Comparison Tool (`/compare`)**
   - Interactive, state-aware bottom Comparison Drawer that lets users add up to 3 colleges.
   - Side-by-side comparative matrix covering Location, NIRF Rank, Fee Structure, Average & Highest Placements, Student Rating, and Course selection.
   - Persistent store powered by Zustand with `localStorage` state retention.

4. **Entance Exam Rank Predictor (`/predictor`)**
   - Instant matching engine based on Entrance Exam (JEE Main, NEET, CAT) and Category (General, OBC, SC, ST).
   - Smart predictive model analyzing past database cutoffs/placement tier requirements to calculate matching confidence (e.g., "High", "Medium", "Low").
   - Detailed result cards highlighting target courses and direct action links.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15.5](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with Outfit & Inter typography, glassmorphism, and responsive CSS variables.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Compare state persistence) and [TanStack Query v5](https://tanstack.com/query/latest) (Client-side API requests).
- **ORM / Database**: [Prisma ORM](https://www.prisma.io/) with SQLite (local zero-configuration development fallback) or PostgreSQL (production configuration ready).
- **Icons**: [Lucide React](https://lucide.dev/) (custom brand SVG fallback).
- **Tooling**: TypeScript, Prettier, ESLint.

---

## 📂 Project Architecture

```
d:/CollegeDunia/
├── prisma/
│   ├── schema.prisma       # Database schema (SQLite default, PostgreSQL commented)
│   ├── dev.db              # Local SQLite database (gitignored)
│   └── seed.ts             # Comprehensive database seed script (49 realistic colleges)
├── src/
│   ├── app/
│   │   ├── api/            # API endpoints (GET colleges, slug detail, compare, predictor)
│   │   ├── colleges/       # Colleges listing & detail pages
│   │   ├── compare/        # Compare matrix page
│   │   ├── predictor/      # Entrance exam predictor tool
│   │   ├── layout.tsx      # Global app shell
│   │   └── page.tsx        # Hero landing page
│   ├── components/         # Reusable UI (Navbar, Footer, CollegeCard, Drawer, etc.)
│   ├── context/            # Global Toast Notifications Context
│   ├── store/              # Zustand Compare Store
│   └── types/              # Domain TypeScript types
├── tsconfig.json           # TS rules configuration
└── eslint.config.mjs       # Custom ESLint overrides for production verification
```

---

## ⚙️ Quick Start (Local Setup)

### 1. Prerequisites
Ensure you have **Node.js 18.x** or higher installed.

### 2. Clone and Install Dependencies
Navigate to the directory and run:
```bash
npm install
```

### 3. Database Generation & Seed (SQLite - Zero Configuration)
CampusIQ is configured to run on a local SQLite database (`dev.db`) out-of-the-box so you can run the app immediately without installing a database engine:

```bash
# Push database schema to SQLite
npx prisma db push

# Seed the database with 49 rich, realistic college records
npx prisma db seed
```
This seeds 49 top colleges in India including IITs, NITs, BITS, VIT, IIMs, AIIMS, and Christian Medical College, complete with courses, fee structures, cutoffs, average packages, and authentic student reviews.

### 4. Run Development Server
Run the local next server (using fast Turbopack compiler):
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ⚡ Production Deployment (PostgreSQL + Vercel)

For production deployment, you can configure PostgreSQL (e.g., hosted on Neon, Supabase, Railway) by updating the Prisma configurations:

### 1. Update Database Provider
Edit [schema.prisma](file:///d:/CollegeDunia/prisma/schema.prisma) and swap the datasource provider from `sqlite` to `postgresql`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Configure Environment Variables
Create an `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@hostname:5432/dbname?sslmode=require"
```

### 3. Deploy Migrations
Run Prisma migrations to create tables on your PostgreSQL database:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Deploy to Vercel
Connect your repo to Vercel. Ensure you add `DATABASE_URL` under your environment variables, and Vercel will automatically build and run the application.

---

## 🔌 API Documentation

All API endpoints are fully typed and return JSON:

- **`GET /api/colleges`**: Fetch matching colleges.
  - Query parameters: `search`, `state`, `course`, `feesLimit`, `minRating`, `sortBy` (`nirf`, `fees`, `placement`, `highestPackage`, `rating`), `page`, `limit`.
- **`GET /api/colleges/[slug]`**: Fetch detailed profile of a college by its slug.
- **`GET /api/compare?ids=id1,id2,id3`**: Helper endpoint to batch fetch full college profiles for the comparison matrix.
- **`POST /api/predict`**: Submits entrance rank data and predicts matching college branches.
  - Body payload: `{ exam: "JEE Main" | "NEET" | "CAT", rank: number, category: string }`

---

## 🎨 Styling & Design Aesthetics

- **Dark Mode Styling**: Sleek slate-900 background with glowing border cards and glassmorphic UI components.
- **Micro-Animations**: Custom hover-lift transitions, active state highlights, and responsive drawer sliders.
- **SEO Ready**: Custom metadata with descriptive titles, descriptions, and viewports on all routes.
- **Error Handlers**: Custom React boundaries (`error.tsx`) and beautiful 404 pages (`not-found.tsx`).
