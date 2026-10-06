/**
 * @file apiSlice.ts
 * @description Unified barrel re-export for all RTK Query slices, hooks, and types.
 * Endpoints are modularized into domain folders under `@/store/services/`:
 * - `@/store/services/auth` (Authentication, Profile, Health)
 * - `@/store/services/dashboard` (Dashboard Metrics)
 * - `@/store/services/employees` (Employee Directory)
 * - `@/store/services/attendance` (Attendance & Punching)
 * - `@/store/services/leave` (Leave Applications & Types)
 * - `@/store/services/payroll` (Payslips & Salary)
 * - `@/store/services/loans` (HR Loans)
 * - `@/store/services/snd` (Sales & Distribution Management)
 * - `@/store/services/sfm` (Sales Force Management & Targets)
 * - `@/store/services/tour-plans` (Tour Plans & Claims)
 */

export * from "./index";
