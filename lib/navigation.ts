export type NavTab =
  | "dashboard"
  | "today-attendance"
  | "employees"
  | "hr-setup"
  | "recruitment"
  | "commission"
  | "devices-logs"
  | "attendance"
  | "leave"
  | "salary"
  | "factory"
  | "people"
  | "accounting"
  | "snd"
  | "sfm"
  | "requests"
  | "shifts"
  | "outwork"
  | "loans"
  | "performance"
  | "notices"
  | "settings";

export const PEOPLE_SECTIONS = [
  { id: "document", label: "Worker documents" },
  { id: "roster", label: "Shift roster" },
  { id: "training", label: "Training & skills" },
  { id: "grievance", label: "Grievances" },
  { id: "incident", label: "Safety incidents" },
  { id: "holiday", label: "Holiday calendar" },
] as const;
export const FACTORY_SECTIONS = [
  { id: "production", label: "Production register" },
  { id: "factory", label: "Factory units" },
  { id: "line", label: "Production lines" },
  { id: "shift", label: "Shift definitions" },
  { id: "grade", label: "Pay grades" },
  { id: "safety", label: "Floor actions" },
] as const;
export type PeopleSection = (typeof PEOPLE_SECTIONS)[number]["id"];
export type FactorySection = (typeof FACTORY_SECTIONS)[number]["id"];

export const LIVE_MODULES: readonly NavTab[] = [
  "dashboard", "today-attendance", "employees", "attendance", "leave",
  "salary", "factory", "people", "settings",
];
export function isModuleAvailable(tab: NavTab, demoPreview = false): boolean {
  return demoPreview || LIVE_MODULES.includes(tab);
}
export function peopleSection(value?: string): PeopleSection {
  return PEOPLE_SECTIONS.find((item) => item.id === value)?.id ?? "document";
}
export function factorySection(value?: string): FactorySection {
  return FACTORY_SECTIONS.find((item) => item.id === value)?.id ?? "production";
}
export function resolveNavigation(tab: NavTab, section?: string, demoPreview = false): { tab: NavTab; section?: string } {
  if (!demoPreview) {
    if (tab === "shifts") return { tab: "people", section: "roster" };
    if (tab === "performance" && section === "training") return { tab: "people", section: "training" };
    if (tab === "hr-setup") {
      if (!section || section === "holiday") return { tab: "people", section: "holiday" };
      if (section === "shifts") return { tab: "factory", section: "shift" };
      if (section === "grades") return { tab: "factory", section: "grade" };
    }
  }
  if (tab === "people") return { tab, section: peopleSection(section) };
  if (tab === "factory") return { tab, section: factorySection(section) };
  if (tab === "employees" && !demoPreview) return { tab, section: section === "add-employee" ? section : "directory" };
  return { tab, section };
}
