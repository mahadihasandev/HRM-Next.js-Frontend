# Payroll and factory operations

Use the matching backend branch. Apply its payroll and factory migrations before opening these modules.

Set `NEXT_PUBLIC_API_URL=https://YOUR-BACKEND/api/v1` in the frontend environment and rebuild. Payroll, factory, login and permission requests use the configured URL. Login supplies the actual Sanctum token from Redux to RTK Query. Persona switching is presentation-only: the new backend APIs always authorize and scope data using the real logged-in employee.

Salary & Payroll supports XLSX, CSV, TSV, delimited TXT and JSON. Download the template, enter full employee IDs and salary components, map columns, validate and save a draft. Excel uses the first worksheet. Replace formulas with values and keep bank/routing numbers as text. Legacy XLS must be saved as XLSX first.

Approve only after reviewing the salary register. Approved batches generate a bank forwarding letter (print or Save as PDF), standard bank CSV and individual payslips. Cash wages are excluded from bank documents. Confirm the bank-specific upload format with your bank; the generic CSV is not a guaranteed bank upload contract. Record payment after receiving a bank/cashier transaction reference; the app does not transfer funds. Drafts may be discarded and imported again; approved/paid snapshots remain locked.

Factory Operations manages units, production lines, shifts, grade reference rates, daily order output, safety follow-ups, training and maintenance. Grade settings do not automatically update employee salaries; production output does not automatically create payroll bonuses. Rates and payroll inputs remain company-approved values.

See the backend's `docs/PAYROLL_AND_FACTORY.md` for permissions, storage, calculation fields, APIs and deployment details.

Validation: `npm ci`, `npm run test:payroll`, `npx tsc --noEmit`, `npm run build`. ESLint for touched feature files can be run with `npx eslint components/modules/factory components/modules/payroll/PayrollWorkspace.tsx components/modules/payroll/PayrollImportPanel.tsx components/modules/payroll/PayrollRegister.tsx store/services/factory store/services/payroll/payrollRunApi.ts store/services/payroll/runTypes.ts lib/payroll lib/api/config.ts store/services/baseApi.ts`.
