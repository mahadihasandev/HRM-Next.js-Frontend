# FRONTEND ARCHITECTURE & DEVELOPMENT GUIDELINES

## Project Overview
This is a high-performance Human Resource Management (HRM) frontend built with **Next.js 16** (App Router, Turbopack, React 19), **Tailwind CSS v4**, **Redux Toolkit & RTK Query**, and **Shadcn UI** design primitives. The project is optimized for deployment on **Vercel** and communicates with the Laravel 13 backend hosted on Render.

---

## 1. Architectural Principles & Folder Structure
Follow Clean Component Architecture and strict separation of concerns:
```
frontend/
├── app/                      # Next.js App Router (pages, layouts, route handlers)
│   ├── globals.css           # Tailwind v4 import & design system tokens
│   ├── layout.tsx            # Root layout with font optimization & Redux provider
│   └── page.tsx              # Application home / dashboard view
├── components/
│   ├── shared/               # Reusable shared components
│   │   ├── Typography/       # <Title>, <Subtitle>, <Text>
│   │   ├── Card/             # <Card>, <CardHeader>, <CardTitle>, <CardWrapper>
│   │   ├── Search/           # <SearchInput> (debounced with shortcut hints)
│   │   ├── Button/           # <Button> with CVA variants and loading state
│   │   ├── Input/            # <Input> with label, icon, and error handling
│   │   ├── Feedback/         # <LoadingSpinner>, <Badge>, <EmptyState>
│   │   ├── Layout/           # <PageHeader>
│   │   ├── Media/            # <OptimizedImage> wrapping next/image
│   │   └── index.ts          # Centralized export for all shared components
│   └── ui/                   # Shadcn UI primitives
├── lib/
│   └── utils.ts              # cn() utility using clsx and tailwind-merge
├── store/
│   ├── store.ts              # Redux store configuration with RTK Query middleware
│   ├── hooks.ts              # useAppDispatch & useAppSelector typed hooks
│   ├── ReduxProvider.tsx     # Client provider wrapper for RootLayout
│   └── services/             # Modular RTK Query slices partitioned by domain
│       ├── baseApi.ts        # Base API slice with authentication headers & tag types
│       ├── types.ts          # Shared API response contracts
│       ├── auth/             # Login, profile, & system health
│       ├── dashboard/        # Executive overview & KPIs
│       ├── employees/        # Employee directory & profiles
│       ├── attendance/       # Daily reports & mobile punching
│       ├── leave/            # Leave balances, types, & applications
│       ├── payroll/          # Payslips & salary history
│       ├── loans/            # Loan applications & status
│       ├── snd/              # Sales & Distribution (customers, orders, visits)
│       ├── sfm/              # Sales Force Management (targets & commitments)
│       ├── tour-plans/       # Tour plans & travel DA/TA claims
│       ├── index.ts          # Centralized barrel export
│       └── apiSlice.ts       # Unified re-export for backwards compatibility
└── types/                    # Shared TypeScript interfaces & types
```

---

## 2. Reusable Shared Component Rules
- **Everything Shared First**: Even if a card, search bar, button, or header is only used once in the application, create or reuse a dedicated shared component in `@/components/shared`.
- **Typography Standards**:
  - Never use raw `<h1-h4>` or `<p>` with ad-hoc classes directly in page views.
  - Use `<Title level={1|2|3|4}>` for headings.
  - Use `<Subtitle>` for lead/descriptive subheadings.
  - Use `<Text variant="body" | "lead" | "caption" | "muted" | "code">` for all textual content.
- **Search Component**:
  - Always use `<SearchInput>` from `@/components/shared` which includes debouncing, clear actions, search icons, and keyboard shortcut indicators.
- **Card Standards**:
  - Use `<CardWrapper>` for standard card containers with title, description, header action, and footer slots.

---

## 3. Redux Toolkit & RTK Query Standards
- **API Communication**: All network fetching to the Laravel backend must be managed via RTK Query (`@/store/services/apiSlice.ts`).
- **Tag Invalidation**: Assign cache tags (`['User', 'Health', 'Auth']`) to endpoints to enable automated re-fetching and optimistic updates.
- **State Selection**: Use typed hooks `useAppSelector` and `useAppDispatch` from `@/store/hooks`. Do not import standard `useSelector` or `useDispatch` directly in components.
- **Client Boundaries**: Keep pages and components server-rendered where feasible. Wrap interactive stateful sections with `'use client'` directives.

---

## 4. Performance & Media Optimization
- **Next.js Image**: Always use Next.js Image optimization (`next/image`) or the shared `<OptimizedImage>` wrapper. Do not use unoptimized `<img>` tags. Remote hostnames are configured in `next.config.ts`.
- **Font Optimization**: Fonts are loaded via `next/font/google` (Inter / Outfit) in `layout.tsx` with zero layout shift and local pre-caching.
- **Tailwind CSS**: Installed locally via npm and `@tailwindcss/postcss`. Never use external CDN links.

---

## 5. Vercel Deployment & Security
- **Config**: Configured with `vercel.json` applying strict security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`).
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: Backend API base URL on Render (e.g. `https://hrm-backend.onrender.com/api/v1`).
- **Build Command**: `next build` (validated with zero TypeScript or linting errors).

---

## 6. Code Cleanliness & Quality Standards
- Delete all unnecessary template boilerplate, demo icons, and placeholder code.
- Keep components small, readable, and typed with TypeScript.
- Write clean and maintainable code adhering to DRY principles.

---

## 7. Mandatory Strict Type Safety Policy (Zero `any` Rule)
- **Zero `any` Allowance**: The use of `any`, `as any`, or `[key: string]: any;` is strictly prohibited throughout the entire codebase.
- **Strict Generic API Typing**: All API endpoints and client `fetch` calls must type payloads and responses using `ApiResponse<T>` and concrete DTOs located in `@/types/hrm` or domain type files.
- **Error Narrowing**: Catch clauses must use `err: unknown` and narrow down errors using type checks (`err instanceof Error` or property checking).
- **Mandatory Verification**: Every agent MUST execute `npx tsc --noEmit` and confirm exit code `0` with 0 compile errors before concluding work.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
