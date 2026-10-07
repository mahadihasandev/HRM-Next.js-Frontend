"use client";
import { useState } from "react";
import {
  Button,
  CardWrapper,
  Input,
  SearchInput,
  Select,
  Text,
  Textarea,
} from "@/components/shared";
import type {
  PeopleDetails,
  PeopleOverview,
  PeoplePayload,
} from "@/store/services/people/peopleApi";
import { displayLabel, statuses, todayDhaka } from "./config";

export function PeopleRecordForm({
  initial,
  overview,
  busy,
  onSave,
  onCancel,
}: {
  initial: PeoplePayload;
  overview: PeopleOverview;
  busy: boolean;
  onSave: (payload: PeoplePayload) => Promise<void>;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initial);
  const [participantSearch, setParticipantSearch] = useState("");
  const [formError, setFormError] = useState("");
  const { kind, details } = value;
  const savedIds = [
    initial.employee_full_id,
    ...(initial.details.participants?.map(
      (participant) => participant.employee_full_id,
    ) || []),
  ].filter((id): id is string => Boolean(id));
  const employees = [
    ...overview.employees,
    ...Array.from(new Set(savedIds))
      .filter(
        (id) =>
          !overview.employees.some(
            (employee) => employee.employee_full_id === id,
          ),
      )
      .map((id) => ({
        employee_full_id: id,
        name: id,
        department: "Inactive employee",
      })),
  ];

  const canManage =
    kind === "grievance"
      ? overview.capabilities.grievances
      : overview.capabilities.manage;
  const detail = <K extends keyof PeopleDetails>(
    key: K,
    next: PeopleDetails[K],
  ) =>
    setValue((previous) => ({
      ...previous,
      details: { ...previous.details, [key]: next },
    }));
  const textField = (
    key: "reference" | "trainer" | "location" | "responsible_person",
    label: string,
    required = false,
  ) => (
    <Input
      label={label}
      value={details[key] || ""}
      maxLength={255}
      required={required}
      onChange={(event) => detail(key, event.target.value)}
    />
  );
  const notesField = (
    key: "notes" | "description" | "resolution" | "corrective_action",
    label: string,
    required = false,
  ) => (
    <Textarea
      label={label}
      value={details[key] || ""}
      maxLength={5000}
      required={required}
      onChange={(event) => detail(key, event.target.value)}
    />
  );
  const choices = (
    key: "category" | "priority" | "severity",
    label: string,
    options: string[],
  ) => (
    <Select
      label={label}
      value={details[key]}
      onChange={(event) => detail(key, event.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {displayLabel(option)}
        </option>
      ))}
    </Select>
  );
  const setupField = (
    setupKind: "factory" | "shift" | "line",
    label: string,
    required = true,
  ) => {
    const key = `${setupKind}_code` as
      | "factory_code"
      | "shift_code"
      | "line_code";
    const options = overview.setups.filter(
      (setup) =>
        setup.kind === setupKind &&
        (setupKind !== "line" ||
          setup.details.factory_code === details.factory_code),
    );
    return (
      <Select
        label={label}
        value={details[key] || ""}
        required={required}
        onChange={(event) => {
          if (setupKind === "factory")
            setValue((previous) => ({
              ...previous,
              details: {
                ...previous.details,
                factory_code: event.target.value,
                line_code: "",
              },
            }));
          else detail(key, event.target.value);
        }}
      >
        <option value="">
          {required ? "Choose from factory setup" : "No line assignment"}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.code}>
            {option.name} · {option.code}
          </option>
        ))}
      </Select>
    );
  };
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    if (kind === "training" && !details.participants?.length) {
      setFormError("Select at least one worker for this training.");
      return;
    }
    try {
      await onSave(value);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "This record could not be saved.",
      );
    }
  }
  return (
    <CardWrapper
      title={value.id ? "Update record" : "New record"}
      description="Records are saved to your company workspace."
    >
      <form onSubmit={submit} className="space-y-5">
        <fieldset disabled={busy} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Title"
              value={value.title}
              maxLength={255}
              required
              onChange={(event) =>
                setValue({ ...value, title: event.target.value })
              }
            />
            {canManage && (
              <Select
                label="Status"
                value={value.status}
                onChange={(event) => {
                  const nextStatus = event.target.value;
                  setValue({
                    ...value,
                    status: nextStatus,
                    details:
                      kind === "training" && nextStatus === "planned"
                        ? {
                            ...details,
                            participants: details.participants?.map(
                              (participant) => ({
                                ...participant,
                                result: "registered",
                              }),
                            ),
                          }
                        : details,
                  });
                }}
              >
                {statuses[kind].map((status) => (
                  <option key={status} value={status}>
                    {displayLabel(status)}
                  </option>
                ))}
              </Select>
            )}
            {(kind === "document" || kind === "roster") && (
              <Select
                label="Employee"
                value={value.employee_full_id || ""}
                required
                onChange={(event) =>
                  setValue({ ...value, employee_full_id: event.target.value })
                }
              >
                <option value="">Choose an employee</option>
                {employees.map((employee) => (
                  <option
                    key={employee.employee_full_id}
                    value={employee.employee_full_id}
                  >
                    {employee.name} · {employee.employee_full_id}
                  </option>
                ))}
              </Select>
            )}
            <Input
              label={
                kind === "document"
                  ? "Issue date"
                  : kind === "incident"
                    ? "Incident date"
                    : "Start date"
              }
              type="date"
              value={value.start_date}
              max={
                kind === "incident" || kind === "grievance"
                  ? todayDhaka()
                  : undefined
              }
              required
              onChange={(event) =>
                setValue({ ...value, start_date: event.target.value })
              }
            />
            <Input
              label={
                kind === "document"
                  ? "Expiry date (optional)"
                  : kind === "roster" || kind === "holiday"
                    ? "End date"
                    : "Follow-up date (optional)"
              }
              type="date"
              min={value.start_date}
              value={value.due_date || ""}
              required={kind === "roster"}
              onChange={(event) =>
                setValue({ ...value, due_date: event.target.value || null })
              }
            />
            {kind === "document" && (
              <>
                {choices("category", "Document type", [
                  "appointment",
                  "contract",
                  "id",
                  "certificate",
                  "other",
                ])}
                {textField("reference", "Reference number (optional)")}
              </>
            )}
            {kind === "roster" && (
              <>
                {setupField("factory", "Factory unit")}
                {setupField("shift", "Shift")}
                {setupField("line", "Production line (optional)", false)}
              </>
            )}
            {kind === "training" && (
              <>
                {choices("category", "Training topic", [
                  "induction",
                  "fire_safety",
                  "first_aid",
                  "skills",
                  "worker_rights",
                  "harassment_prevention",
                  "other",
                ])}
                {textField("trainer", "Trainer", true)}
                {textField("location", "Location", true)}
              </>
            )}
            {kind === "grievance" && (
              <>
                {choices("category", "Concern category", [
                  "wages",
                  "harassment",
                  "safety",
                  "welfare",
                  "other",
                ])}
                {choices("priority", "Priority", ["normal", "high", "urgent"])}
              </>
            )}
            {kind === "incident" && (
              <>
                {setupField("factory", "Factory unit")}
                {choices("category", "Incident category", [
                  "near_miss",
                  "injury",
                  "fire",
                  "equipment",
                  "other",
                ])}
                {choices("severity", "Severity", [
                  "low",
                  "medium",
                  "high",
                  "critical",
                ])}
                {canManage &&
                  textField(
                    "responsible_person",
                    "Action owner",
                    value.status === "completed",
                  )}
              </>
            )}
            {kind === "holiday" && (
              <>
                {choices("category", "Holiday type", [
                  "public",
                  "festival",
                  "weekly",
                  "company",
                ])}
                <Select
                  label="Paid holiday"
                  value={details.paid ? "yes" : "no"}
                  onChange={(event) =>
                    detail("paid", event.target.value === "yes")
                  }
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
              </>
            )}
          </div>
          {(kind === "grievance" || kind === "incident") &&
            notesField("description", "Description", true)}
          {kind === "grievance" &&
            canManage &&
            notesField(
              "resolution",
              "Response / resolution",
              value.status === "resolved",
            )}
          {kind === "incident" &&
            canManage &&
            notesField(
              "corrective_action",
              "Corrective action",
              value.status === "completed",
            )}
          {!["grievance", "incident"].includes(kind) &&
            notesField("notes", "Notes (optional)")}
          {kind === "training" && (
            <div className="rounded-xl border border-slate-200 p-4 space-y-3">
              <Text className="!font-semibold !text-sm">
                Participants & attendance · {details.participants?.length || 0}{" "}
                selected
              </Text>
              <SearchInput
                aria-label="Find workers"
                placeholder="Name or employee ID"
                value={participantSearch}
                onChange={setParticipantSearch}
              />
              <div className="max-h-64 overflow-auto space-y-2">
                {employees
                  .filter((employee) =>
                    `${employee.name} ${employee.employee_full_id}`
                      .toLowerCase()
                      .includes(participantSearch.toLowerCase()),
                  )
                  .map((employee) => {
                    const selected = details.participants?.find(
                      (participant) =>
                        participant.employee_full_id ===
                        employee.employee_full_id,
                    );
                    return (
                      <div
                        key={employee.employee_full_id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2"
                      >
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={Boolean(selected)}
                            onChange={(event) =>
                              detail(
                                "participants",
                                event.target.checked
                                  ? [
                                      ...(details.participants || []),
                                      {
                                        employee_full_id:
                                          employee.employee_full_id,
                                        result: "registered",
                                      },
                                    ]
                                  : details.participants?.filter(
                                      (participant) =>
                                        participant.employee_full_id !==
                                        employee.employee_full_id,
                                    ),
                              )
                            }
                          />
                          {employee.name}
                          <span className="text-xs text-slate-500">
                            {employee.employee_full_id}
                          </span>
                        </label>
                        {selected && value.status === "completed" && (
                          <Select
                            label={`Attendance for ${employee.name}`}
                            value={selected.result}
                            onChange={(event) =>
                              detail(
                                "participants",
                                details.participants?.map((participant) =>
                                  participant.employee_full_id ===
                                  employee.employee_full_id
                                    ? {
                                        ...participant,
                                        result: event.target.value as
                                          | "registered"
                                          | "attended"
                                          | "absent",
                                      }
                                    : participant,
                                ),
                              )
                            }
                          >
                            {["registered", "attended", "absent"].map(
                              (result) => (
                                <option key={result} value={result}>
                                  {displayLabel(result)}
                                </option>
                              ),
                            )}
                          </Select>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </fieldset>
        {formError && (
          <Text role="alert" className="!text-red-700 !text-sm">
            {formError}
          </Text>
        )}
        <div className="flex gap-2">
          <Button type="submit" isLoading={busy}>
            Save record
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </CardWrapper>
  );
}
