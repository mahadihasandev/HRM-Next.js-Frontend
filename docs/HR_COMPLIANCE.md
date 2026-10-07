# HR and compliance UI

Open **HR & compliance** in People Operations for worker documents, shift roster, training and skills, grievances, safety incidents and holiday calendar. The six sections share typed RTK Query endpoints, company-scoped backend records, search/status filters, pagination, detail views and change history. No demo records are shipped.

Managers add documents, date-range shifts, training attendance and holidays. Workers can read their own assignments and records, and submit concerns or incidents. Backend-provided capabilities determine available actions; grievance handling has a separate permission from other HR management. All writes await persistence, display validation failures, and retain unsaved form values. Version conflicts require closing/reopening the latest record before saving.

Document files are uploaded to private backend storage and downloaded through the authenticated API. Workers see their own attachments. An HR manager can add up to 20 PDF/JPEG/PNG/DOCX/TXT files per document, each up to 10 MB. The file input shows failure and can be retried; storage paths are never included in UI responses. Expiry and overdue reminders appear inside the workspace only.

Factory and shift options come from existing Factory operations. Create factory units/shifts/lines there before assigning a roster. Active dates cannot overlap for an employee. Training uses company employees and individual attendance; workers cannot inspect other participants' results. Grievance identities are visible to authorized handlers and are not anonymous.

Deploy the matching backend migration before the frontend. Both existing API base URL configuration and session handling are reused; no additional packages/environment keys are needed. Payroll calculation, statutory leave policies and automatic holiday/overtime adjustments remain outside this module.

Research rationale and backend API/privacy details: [backend HR compliance guide](https://github.com/mahadihasandev/HRM-PHP-Backend/blob/codex/hr-compliance/docs/HR_COMPLIANCE.md). Priorities follow [Better Work Bangladesh](https://betterwork.org/bangladesh/our-services/) and [ILO garment-sector grievance guidance](https://researchrepository.ilo.org/esploro/outputs/encyclopediaEntry/Promoting-and-strengthening-effective-grievance-mechanisms/995700671202676), reviewed on 7 October 2026.

Local verification: six frontend tests, TypeScript and the production build passed. Full lint reported zero errors and 103 inherited warnings. Browser checks confirmed saved documents, expiry counters, training validation/participants and authenticated attachment download. Historical employee selections are retained when a worker becomes inactive.
