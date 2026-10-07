import type {
  PeopleKind,
  PeoplePayload,
} from "@/store/services/people/peopleApi";
export const sections: {
  kind: PeopleKind;
  title: string;
  description: string;
  addLabel: string;
}[] = [
  {
    kind: "document",
    title: "Worker documents",
    description:
      "Appointment letters, contracts and certificates, with expiry follow-up.",
    addLabel: "Add document",
  },
  {
    kind: "roster",
    title: "Shift roster",
    description:
      "Assign workers to factory shifts and lines across a date range.",
    addLabel: "Assign shift",
  },
  {
    kind: "training",
    title: "Training & skills",
    description:
      "Plan induction and safety training, then record each worker’s attendance.",
    addLabel: "Plan training",
  },
  {
    kind: "grievance",
    title: "Grievances",
    description:
      "Raise a workplace concern and follow its response. Only you and authorized handlers can view it.",
    addLabel: "Raise a concern",
  },
  {
    kind: "incident",
    title: "Safety incidents",
    description:
      "Report hazards or incidents and track corrective action through completion.",
    addLabel: "Report incident",
  },
  {
    kind: "holiday",
    title: "Holiday calendar",
    description:
      "Publish festival holidays, weekly rest periods and company closures.",
    addLabel: "Add holiday",
  },
];
export const statuses: Record<PeopleKind, string[]> = {
  document: ["pending", "verified", "expired", "archived"],
  roster: ["active", "cancelled"],
  training: ["planned", "completed", "cancelled"],
  grievance: ["open", "in_review", "resolved"],
  incident: ["open", "in_progress", "completed"],
  holiday: ["scheduled", "cancelled"],
};
export function displayLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}
export function todayDhaka(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function newRecord(kind: PeopleKind): PeoplePayload {
  const defaults = {
    document: { category: "appointment", reference: "", notes: "" },
    roster: { factory_code: "", shift_code: "", line_code: "", notes: "" },
    training: {
      category: "induction",
      trainer: "",
      location: "",
      participants: [],
      notes: "",
    },
    grievance: {
      category: "wages",
      priority: "normal",
      description: "",
      resolution: "",
    },
    incident: {
      category: "near_miss",
      severity: "low",
      factory_code: "",
      description: "",
      responsible_person: "",
      corrective_action: "",
    },
    holiday: { category: "festival", paid: true, notes: "" },
  };
  return {
    kind,
    title: "",
    start_date: todayDhaka(),
    due_date: kind === "roster" ? todayDhaka() : null,
    status: statuses[kind][0],
    employee_full_id: null,
    details: defaults[kind],
  };
}
