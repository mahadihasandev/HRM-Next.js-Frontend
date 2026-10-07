"use client";
import { useState } from "react";
import { Button, CardWrapper, Input, Text } from "@/components/shared";
import {
  FactoryPayload,
  FactorySetup,
  SetupKind,
} from "@/store/services/factory/factoryApi";
import { label } from "@/lib/payroll/import";
type Tab = SetupKind | "production" | "safety";
interface Props {
  tab: Tab;
  editing: FactoryPayload | null;
  setups: FactorySetup[];
  onSubmit: (payload: FactoryPayload) => void;
  busy: boolean;
}
export function FactoryRecordForm({
  tab,
  editing,
  setups,
  onSubmit,
  busy,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = {
      date: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" }),
      active: "true",
      category: "safety",
      status: "open",
      break_minutes: "60",
      target: "1000",
      completed: "0",
      rejected: "0",
    };
    if (editing) {
      Object.entries(editing).forEach(([key, value]) => {
        if (typeof value !== "object") base[key] = String(value);
      });
      if (editing.type === "setup")
        Object.entries(editing.details).forEach(([key, value]) => {
          base[key] = String(value);
        });
    }
    return base;
  });
  const set = (key: string, value: string) =>
    setValues((previous) => ({ ...previous, [key]: value }));
  const factories = setups.filter(
    (item) => item.kind === "factory" && item.active,
  );
  const lines = setups.filter(
    (item) =>
      item.kind === "line" &&
      item.active &&
      item.details.factory_code === values.factory_code,
  );
  function select(key: string, options: { value: string; text: string }[]) {
    return (
      <label className="text-xs font-semibold text-slate-700">
        {label(key)}
        <select
          required
          aria-label={label(key)}
          value={values[key] || ""}
          disabled={busy}
          onChange={(event) => set(key, event.target.value)}
          className="block w-full mt-1.5 border border-slate-200 rounded-lg bg-white px-3 py-2.5 text-sm"
        >
          <option value="">Select {label(key).toLowerCase()}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </label>
    );
  }
  function input(key: string, type = "text", required = true) {
    const max =
      key === "target" || key === "completed"
        ? 10000000
        : key === "capacity"
          ? 100000
          : key === "break_minutes"
            ? 480
            : key === "rejected"
              ? Number(values.completed || 0)
              : 10000000;
    return (
      <Input
        key={key}
        label={label(key)}
        type={type}
        required={required}
        maxLength={key === "code" ? 50 : 255}
        min={
          type === "number"
            ? key === "target" || key === "capacity"
              ? 1
              : 0
            : undefined
        }
        max={type === "number" ? max : undefined}
        step={
          type === "number"
            ? key === "basic_salary" || key === "overtime_rate"
              ? "0.01"
              : "1"
            : undefined
        }
        value={values[key] || ""}
        disabled={busy}
        onChange={(event) => set(key, event.target.value)}
      />
    );
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const id = editing?.id;
    if (tab === "production")
      onSubmit({
        type: "production",
        id,
        date: values.date,
        factory_code: values.factory_code,
        line_code: values.line_code,
        order_ref: values.order_ref,
        style: values.style,
        target: Number(values.target),
        completed: Number(values.completed),
        rejected: Number(values.rejected),
      });
    else if (tab === "safety")
      onSubmit({
        type: "safety",
        id,
        date: values.date,
        factory_code: values.factory_code,
        category: values.category as "safety" | "training" | "maintenance",
        title: values.title,
        notes: values.notes || "",
        owner: values.owner,
        status: values.status as "open" | "in_progress" | "completed",
      });
    else {
      const details: Record<string, string | number> =
        tab === "factory"
          ? { address: values.address || "" }
          : tab === "line"
            ? {
                factory_code: values.factory_code,
                section: values.section,
                capacity: Number(values.capacity),
              }
            : tab === "shift"
              ? {
                  start: values.start,
                  end: values.end,
                  break_minutes: Number(values.break_minutes),
                }
              : {
                  basic_salary: Number(values.basic_salary),
                  overtime_rate: Number(values.overtime_rate),
                };
      onSubmit({
        type: "setup",
        id,
        kind: tab,
        code: values.code,
        name: values.name,
        active: values.active === "true",
        details,
      });
    }
  }
  return (
    <CardWrapper
      title={`${editing ? "Edit" : "New"} ${label(tab)} record`}
      className="!border-teal-200"
    >
      <form
        onSubmit={submit}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {tab === "production" || tab === "safety" ? (
          <>
            {input("date", "date")}
            {select(
              "factory_code",
              factories.map((item) => ({ value: item.code, text: item.name })),
            )}
            {tab === "production" ? (
              <>
                {select(
                  "line_code",
                  lines.map((item) => ({ value: item.code, text: item.name })),
                )}
                {input("order_ref")}
                {input("style")}
                {input("target", "number")}
                {input("completed", "number")}
                {input("rejected", "number")}
              </>
            ) : (
              <>
                {select(
                  "category",
                  ["safety", "training", "maintenance"].map((value) => ({
                    value,
                    text: label(value),
                  })),
                )}
                {input("title")}
                {input("owner")}
                {select(
                  "status",
                  ["open", "in_progress", "completed"].map((value) => ({
                    value,
                    text: label(value),
                  })),
                )}
                <label className="text-xs font-semibold sm:col-span-2 lg:col-span-3">
                  Notes
                  <textarea
                    aria-label="Notes"
                    rows={3}
                    maxLength={5000}
                    value={values.notes || ""}
                    disabled={busy}
                    onChange={(event) => set("notes", event.target.value)}
                    className="block w-full border border-slate-200 rounded-lg p-3 text-sm mt-2"
                  />
                </label>
              </>
            )}
          </>
        ) : (
          <>
            {input("code")}
            {input("name")}
            {select("active", [
              { value: "true", text: "Active" },
              { value: "false", text: "Inactive" },
            ])}
            {tab === "factory" && input("address", "text", false)}
            {tab === "line" && (
              <>
                {select(
                  "factory_code",
                  factories.map((item) => ({
                    value: item.code,
                    text: item.name,
                  })),
                )}
                {input("section")}
                {input("capacity", "number")}
              </>
            )}
            {tab === "shift" && (
              <>
                {input("start", "time")}
                {input("end", "time")}
                {input("break_minutes", "number")}
              </>
            )}
            {tab === "grade" && (
              <>
                {input("basic_salary", "number")}
                {input("overtime_rate", "number")}
                <Text
                  variant="caption"
                  className="sm:col-span-2 lg:col-span-3 !font-normal !text-slate-500"
                >
                  Use rates approved by your company. Grade settings are
                  reference values for salary preparation.
                </Text>
              </>
            )}
          </>
        )}
        <div className="sm:col-span-2 lg:col-span-3">
          <Button type="submit" className="!bg-teal-700" isLoading={busy}>
            Save record
          </Button>
        </div>
      </form>
    </CardWrapper>
  );
}
