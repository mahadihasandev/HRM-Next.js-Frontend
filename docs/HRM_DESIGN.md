# HR workspace design

The workspace uses a white navigation panel, grouped HR/factory modules, a teal primary action color, a pale slate canvas and Inter typography. Shared cards, badges, buttons, search fields and form controls define the visual treatment across the app. Tables keep clear headers, lighter dividers and horizontal scrolling for detailed registers on smaller screens.

The dashboard combines the current API metrics with weekly attendance, an attendance status chart, request-register links, personal punch history and quick access to employees, payroll, factory and leave. Missing data has an unavailable state rather than invented frontend fallback values. Existing backend dashboard aggregates and their business rules remain unchanged; this design change does not certify the accuracy of those aggregates.

The account menu displays the signed-in employee, integrations, permissions and sign-out. Demo shortcuts/persona selectors are hidden unless `NEXT_PUBLIC_ENABLE_DEMO_PREVIEWS=true` is explicitly configured. Rebuild after changing this public environment value. A preview persona does not replace the authenticated server identity.

On phones, the navigation drawer supports search, Escape dismissal, focus containment and restoration. Closed navigation is hidden from keyboard focus. The bottom navigation prioritizes home, attendance, staff and payroll, with the complete module list available from the menu. Forms have visible focus states, associated labels and autocomplete where appropriate. Reduced-motion preferences are respected.

Validation includes TypeScript, focused ESLint, the payroll import tests, the production build, and browser checks of desktop/mobile sign-in, dashboard, employee search, payroll/factory registers and account/navigation interactions. Screenshots use local example employees and are not production payroll data.
