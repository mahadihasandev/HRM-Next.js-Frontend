"use client";
import { FileSpreadsheet, UploadCloud } from "lucide-react";
import { Button, CardWrapper, Input, Text } from "@/components/shared";
import {
  PayrollImport,
  PayrollPreview,
  importFields,
} from "@/store/services/payroll/runTypes";
import { ParsedPayrollFile, label } from "@/lib/payroll/import";
import { money } from "@/lib/payroll/documents";
import { PayrollRegister } from "./PayrollRegister";
interface Props {
  form: PayrollImport;
  updateForm: (patch: Partial<PayrollImport>) => void;
  parsed: ParsedPayrollFile | null;
  mapping: string[];
  setMapping: (mapping: string[]) => void;
  readFile: (file: File) => void;
  preview: PayrollPreview | null;
  validate: () => void;
  save: () => void;
  busy: boolean;
  reading: boolean;
}
export function PayrollImportPanel({
  form,
  updateForm,
  parsed,
  mapping,
  setMapping,
  readFile,
  preview,
  validate,
  save,
  busy,
  reading,
}: Props) {
  return (
    <CardWrapper
      title="Import a salary sheet"
      description="Match columns, validate salaries, then save a draft for review."
      className="!border-teal-200 !shadow-none"
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <Input
          label="Payroll month"
          type="month"
          required
          value={form.month}
          disabled={busy}
          onChange={(event) => updateForm({ month: event.target.value })}
        />
        <Input
          label="Batch title"
          required
          value={form.title}
          maxLength={255}
          disabled={busy}
          onChange={(event) => updateForm({ title: event.target.value })}
        />
      </div>
      <label
        className={`flex flex-col items-center text-center rounded-xl border-2 border-dashed border-teal-200 bg-teal-50/40 p-6 cursor-pointer ${busy ? "pointer-events-none opacity-50" : "hover:bg-teal-50"}`}
      >
        <UploadCloud className="size-8 text-teal-600 mb-3" />
        <Text className="!font-semibold">
          {reading
            ? "Reading salary file…"
            : form.source_name || "Choose your salary file"}
        </Text>
        <Text variant="caption" className="!font-normal !text-slate-500 mt-2">
          Excel (.xlsx), CSV, TSV, TXT or JSON · Up to 10 MB / 5,000 employees
        </Text>
        <input
          type="file"
          aria-label="Choose salary import file"
          className="sr-only"
          disabled={busy || reading}
          accept=".xlsx,.csv,.tsv,.txt,.json"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) readFile(file);
            event.target.value = "";
          }}
        />
      </label>
      <Text variant="caption" className="!font-normal !text-slate-500 mt-3">
        Use full employee IDs from the directory. Keep account and routing
        numbers as text. Overtime uses the rate supplied in your sheet; no
        statutory rate is assumed. Optional Net Payable verifies your existing
        sheet total.
      </Text>
      {parsed && (
        <div className="mt-6">
          <Text className="!font-semibold flex items-center gap-2">
            <FileSpreadsheet className="size-4 text-teal-700" />
            Map your columns · {parsed.rows.length} employees
          </Text>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 max-h-72 overflow-auto">
            {parsed.headers.map((header, index) => (
              <label key={header} className="text-xs text-slate-600">
                {header}
                <select
                  aria-label={`Map ${header}`}
                  value={mapping[index]}
                  disabled={busy}
                  onChange={(event) =>
                    setMapping(
                      mapping.map((field, fieldIndex) =>
                        fieldIndex === index ? event.target.value : field,
                      ),
                    )
                  }
                  className="block w-full border border-slate-200 bg-white rounded-lg px-3 py-2.5 text-sm text-slate-800 mt-1"
                >
                  <option value="">Skip column</option>
                  {importFields.map((field) => (
                    <option key={field} value={field}>
                      {label(field)}
                    </option>
                  ))}
                </select>
                <span className="block mt-1 text-slate-400 truncate">
                  Sample: {parsed.rows[0]?.[index] || "empty"}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
      <details className="mt-5 rounded-xl border border-slate-200 p-4" open>
        <summary className="text-sm font-semibold cursor-pointer">
          Bank forwarding & company details
        </summary>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {(
            [
              "bank_name",
              "bank_branch",
              "debit_account",
              "company_address",
              "signatory",
              "signatory_title",
            ] as const
          ).map((field) => (
            <Input
              key={field}
              label={label(field)}
              value={form[field]}
              maxLength={255}
              disabled={busy}
              onChange={(event) => updateForm({ [field]: event.target.value })}
            />
          ))}
        </div>
      </details>
      <div className="flex flex-wrap gap-3 mt-5">
        <Button
          className="!bg-teal-700"
          onClick={validate}
          disabled={busy || reading || !parsed}
          isLoading={busy}
        >
          Validate salary sheet
        </Button>
        <Button
          variant="outline"
          onClick={save}
          disabled={busy || reading || !preview?.valid}
        >
          Save reviewed draft
        </Button>
      </div>
      {preview && (
        <div className="mt-5 space-y-4" role="status">
          {preview.valid ? (
            <div className="rounded-xl bg-teal-50 border border-teal-200 p-4">
              <Text className="!text-teal-800 !text-sm">
                All {preview.summary.employees} employees reconciled · Net
                salary {money(preview.summary.net_payable)}
              </Text>
            </div>
          ) : (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
              <Text className="!text-rose-800 !font-semibold">
                Resolve {preview.errors.length} rows before saving
              </Text>
              <ul className="list-disc pl-5 text-sm text-rose-800 mt-3 space-y-2 max-h-64 overflow-auto">
                {preview.errors.map((error) => (
                  <li key={error.row}>
                    Row {error.row} · {error.employee_full_id || "Missing ID"}:{" "}
                    {error.messages.join(" ")}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <PayrollRegister rows={preview.rows} />
        </div>
      )}
    </CardWrapper>
  );
}
