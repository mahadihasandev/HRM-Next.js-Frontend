"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  Building2,
  Check,
  Download,
  FileCheck2,
  FileSpreadsheet,
  Landmark,
  Plus,
  Printer,
  RefreshCw,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Badge,
  Button,
  CardWrapper,
  EmptyState,
  Input,
  PageHeader,
  SearchInput,
  Text,
  Title,
} from "@/components/shared";
import {
  useDiscardPayrollMutation,
  useAttachPayrollFileMutation,
  useCreatePayrollMutation,
  useDownloadPayrollFileMutation,
  usePayrollActionMutation,
  usePayrollRunsQuery,
  usePayrollRunQuery,
  usePreviewPayrollMutation,
} from "@/store/services/payroll/payrollRunApi";
import {
  PayrollImport,
  PayrollPreview,
  PayrollRun,
} from "@/store/services/payroll/runTypes";
import {
  ParsedPayrollFile,
  downloadUrl,
  downloadTemplate,
  mapPayrollRows,
  parsePayrollFile,
  suggestMapping,
} from "@/lib/payroll/import";
import {
  exportBankCsv,
  money,
  printBankLetter,
  printPayslip,
  printSalaryRegister,
} from "@/lib/payroll/documents";
import { PayrollRegister } from "./PayrollRegister";
import { PayrollImportPanel } from "./PayrollImportPanel";

export function payrollError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object") {
      if ("errors" in data && data.errors && typeof data.errors === "object") {
        return Object.values(data.errors)
          .flat()
          .filter((value): value is string => typeof value === "string")
          .join(" ");
      }
      if ("message" in data && typeof data.message === "string")
        return data.message;
    }
  }
  return "The request failed. Check the connection and try again.";
}
const monthNow = () =>
  new Date()
    .toLocaleDateString("en-CA", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
    })
    .replace(/^(\d{2})\/(\d{4})$/, "$2-$1")
    .slice(0, 7);
const initialImport = (): PayrollImport => ({
  month: monthNow(),
  title: "Monthly salary",
  rows: [],
  company_address: "",
  bank_name: "",
  bank_branch: "",
  debit_account: "",
  signatory: "",
  signatory_title: "",
});

export function PayrollWorkspace({
  canManage = false,
}: {
  canManage?: boolean;
}) {
  const { data, isLoading, error, refetch, isFetching } = usePayrollRunsQuery();
  const [previewPayroll, previewState] = usePreviewPayrollMutation();
  const [createPayroll, createState] = useCreatePayrollMutation();
  const [action, actionState] = usePayrollActionMutation();
  const [attach, attachState] = useAttachPayrollFileMutation();
  const [discard, discardState] = useDiscardPayrollMutation();
  const [discardOpen, setDiscardOpen] = useState(false);
  const [downloadFile] = useDownloadPayrollFileMutation();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<PayrollImport>(initialImport);
  const [importOpen, setImportOpen] = useState(false);
  const [parsed, setParsed] = useState<ParsedPayrollFile | null>(null);
  const [mapping, setMapping] = useState<string[]>([]);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PayrollPreview | null>(null);
  const [reading, setReading] = useState(false);
  const [search, setSearch] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentDate, setPaymentDate] = useState(
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" }),
  );
  const [paymentReference, setPaymentReference] = useState("");
  const runs = useMemo(() => data?.data || [], [data]);
  const selectedBatch =
    selectedId === null ? runs[0] : runs.find((run) => run.id === selectedId);
  const {
    currentData: runData,
    isFetching: fetchingRun,
    error: runError,
  } = usePayrollRunQuery(selectedBatch?.id || 0, { skip: !selectedBatch });
  const selected = runData?.data;
  const activeSummary = selected || selectedBatch;
  const summary = activeSummary?.summary;
  const busy =
    previewState.isLoading ||
    createState.isLoading ||
    actionState.isLoading ||
    attachState.isLoading ||
    discardState.isLoading;
  const updateForm = (patch: Partial<PayrollImport>) => {
    setForm((previous) => ({ ...previous, ...patch }));
    setPreview(null);
  };
  const notifyDocument = (callback: () => void) => {
    try {
      callback();
    } catch (err) {
      toast.error(payrollError(err));
    }
  };
  async function readFile(file: File) {
    setReading(true);
    setPreview(null);
    setParsed(null);
    setSourceFile(null);
    try {
      const result = await parsePayrollFile(file);
      setParsed(result);
      setMapping(suggestMapping(result.headers));
      setSourceFile(file);
      updateForm({ source_name: file.name });
    } catch (err) {
      toast.error(payrollError(err));
    } finally {
      setReading(false);
    }
  }
  function payload(): PayrollImport {
    if (!parsed) throw new Error("Choose a salary file first.");
    return { ...form, rows: mapPayrollRows(parsed, mapping) };
  }
  async function validate() {
    try {
      const result = await previewPayroll(payload()).unwrap();
      setPreview(result.data);
    } catch (err) {
      toast.error(payrollError(err));
    }
  }
  async function save() {
    try {
      const result = await createPayroll(payload()).unwrap();
      setSelectedId(result.data.id);
      setImportOpen(false);
      setParsed(null);
      setPreview(null);
      toast.success(
        "Payroll draft saved. Review the register before approval.",
      );
      if (sourceFile) {
        try {
          await attach({ id: result.data.id, file: sourceFile }).unwrap();
        } catch {
          toast.error(
            "Draft saved, but the source attachment failed. Upload it again from Supporting files.",
          );
        }
      }
      setSourceFile(null);
      setForm(initialImport());
    } catch (err) {
      toast.error(payrollError(err));
    }
  }
  async function transition(run: PayrollRun, next: "approve" | "paid") {
    try {
      await action({
        id: run.id,
        action: next,
        ...(next === "paid"
          ? { payment_date: paymentDate, payment_reference: paymentReference }
          : {}),
      }).unwrap();
      setPaymentOpen(false);
      setPaymentReference("");
      toast.success(
        next === "approve"
          ? "Payroll approved. Bank documents are ready."
          : "Payment confirmation recorded.",
      );
    } catch (err) {
      toast.error(payrollError(err));
    }
  }
  async function uploadSupporting(file: File) {
    if (!selected) return;
    try {
      await attach({ id: selected.id, file }).unwrap();
      toast.success("Supporting file saved.");
    } catch (err) {
      toast.error(payrollError(err));
    }
  }
  return (
    <div className="payroll-workspace space-y-6">
      <PageHeader
        title="Payroll workspace"
        subtitle="Factory payroll, from salary sheet to bank instruction."
        badge={
          <Badge
            variant="outline"
            className="!border-teal-200 !bg-teal-50 !text-teal-800"
          >
            GARMENT OPERATIONS
          </Badge>
        }
        action={
          <>
            <Button
              variant="outline"
              leftIcon={<Download className="size-4" />}
              onClick={downloadTemplate}
            >
              Import template
            </Button>
            {canManage && (
              <Button
                className="!bg-teal-700 hover:!bg-teal-800"
                leftIcon={<Plus className="size-4" />}
                onClick={() => setImportOpen(!importOpen)}
              >
                {importOpen ? "Close import" : "New payroll"}
              </Button>
            )}
          </>
        }
      />
      <div className="rounded-2xl bg-[#123f43] p-6 sm:p-8 text-white overflow-hidden relative">
        <div className="absolute right-8 top-7 opacity-10">
          <Building2 className="size-32" />
        </div>
        <Text
          variant="caption"
          className="!text-teal-200 tracking-[0.18em] uppercase"
        >
          A clearer month-end
        </Text>
        <Title
          level={2}
          className="!text-white !font-semibold text-2xl sm:text-3xl mt-3"
        >
          Every worker. Every taka. Accounted for.
        </Title>
        <Text className="!text-teal-100 max-w-xl mt-3 !font-normal">
          Review salary, overtime and allowances together. Resolve file issues
          before approval, then prepare your bank forwarding letter.
        </Text>
        <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6 text-xs text-teal-100">
          {[
            "Import & reconcile",
            "Review & approve",
            "Prepare bank documents",
            "Confirm payment",
          ].map((step, index) => (
            <span className="flex items-center gap-2" key={step}>
              <span className="flex size-5 items-center justify-center rounded-full border border-teal-200/30 text-[10px]">
                {index + 1}
              </span>
              {step}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            title: "Net payroll",
            value: summary ? money(summary.net_payable) : "—",
            detail: activeSummary
              ? `${activeSummary.month} · ${activeSummary.title}`
              : "Select or create a payroll batch",
            icon: Banknote,
          },
          {
            title: "Employees",
            value: summary?.employees.toLocaleString() || "—",
            detail: "Matched to employee records",
            icon: Building2,
          },
          {
            title: "Bank transfer",
            value: summary ? money(summary.bank_total) : "—",
            detail: "Included in bank forwarding",
            icon: Landmark,
          },
          {
            title: "Cash payroll",
            value: summary ? money(summary.cash_total) : "—",
            detail: "Separate from bank instructions",
            icon: FileCheck2,
          },
        ].map((stat) => (
          <CardWrapper key={stat.title} className="!border-slate-200">
            <div className="flex items-center justify-between">
              <Text variant="caption" className="!font-medium !text-slate-500">
                {stat.title}
              </Text>
              <stat.icon className="size-4 text-teal-700" />
            </div>
            <Text className="!text-xl sm:!text-2xl !font-semibold mt-4 tabular-nums break-all">
              {stat.value}
            </Text>
            <Text
              variant="caption"
              className="!font-normal !text-slate-500 mt-2"
            >
              {stat.detail}
            </Text>
          </CardWrapper>
        ))}
      </div>
      {importOpen && (
        <PayrollImportPanel
          form={form}
          updateForm={updateForm}
          parsed={parsed}
          mapping={mapping}
          setMapping={(value) => {
            setMapping(value);
            setPreview(null);
          }}
          readFile={readFile}
          preview={preview}
          validate={validate}
          save={save}
          busy={busy}
          reading={reading}
        />
      )}
      {error && (
        <CardWrapper className="!border-rose-200 !bg-rose-50">
          <Text role="alert">{payrollError(error)}</Text>
          <Button variant="outline" className="mt-3" onClick={() => refetch()}>
            Retry connection
          </Button>
        </CardWrapper>
      )}
      {isLoading ? (
        <Text role="status">Loading payroll batches…</Text>
      ) : (
        !error &&
        !runs.length && (
          <CardWrapper>
            <EmptyState
              title="Your first payroll starts here"
              description="Download the template, enter employee IDs and salary components, then import your salary file. No salaries are generated until you review and approve the batch."
              icon={<FileSpreadsheet className="size-8 text-teal-700" />}
            />
          </CardWrapper>
        )
      )}
      {!!runs.length && (
        <div className="grid xl:grid-cols-[260px_minmax(0,1fr)] gap-5 items-start">
          <CardWrapper
            title="Payroll batches"
            description={`${runs.length} recent batches`}
            className="!border-slate-200"
            headerAction={
              <Button
                size="icon"
                variant="ghost"
                aria-label="Refresh payroll"
                disabled={isFetching}
                onClick={() => refetch()}
              >
                <RefreshCw className="size-4" />
              </Button>
            }
          >
            <div className="space-y-2 max-h-[520px] overflow-auto">
              {runs.map((run) => (
                <button
                  key={run.id}
                  onClick={() => {
                    setSelectedId(run.id);
                    setSearch("");
                    setPaymentOpen(false);
                    setDiscardOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${selectedBatch?.id === run.id ? "bg-teal-50 border-teal-300" : "border-transparent hover:bg-slate-50"}`}
                >
                  <div className="flex items-center justify-between">
                    <Text
                      as="span"
                      variant="caption"
                      className="!font-semibold"
                    >
                      {run.month}
                    </Text>
                    <Badge
                      variant={
                        run.status === "paid"
                          ? "success"
                          : run.status === "approved"
                            ? "default"
                            : "outline"
                      }
                      className="text-[10px]"
                    >
                      {run.status}
                    </Badge>
                  </div>
                  <Text className="!text-sm !font-medium mt-2 truncate">
                    {run.title}
                  </Text>
                  <Text
                    variant="caption"
                    className="!text-slate-500 !font-normal mt-1"
                  >
                    {run.summary.employees} workers ·{" "}
                    {money(run.summary.net_payable)}
                  </Text>
                </button>
              ))}
            </div>
          </CardWrapper>
          {runError && <Text role="alert">{payrollError(runError)}</Text>}
          {fetchingRun && !selected && (
            <Text role="status">Loading salary register…</Text>
          )}
          {selected && (
            <div className="space-y-5 min-w-0">
              <CardWrapper
                title={selected.title}
                description={`PAY-${selected.id} · ${selected.month} · Source: ${selected.source_name || "Salary import"}`}
                className="!border-slate-200"
                headerAction={
                  <Badge
                    variant={selected.status === "paid" ? "success" : "outline"}
                  >
                    {selected.status.toUpperCase()}
                  </Badge>
                }
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {canManage && selected.status === "draft" && (
                    <Button
                      className="!bg-teal-700"
                      disabled={busy}
                      onClick={() => transition(selected, "approve")}
                      leftIcon={<Check className="size-4" />}
                    >
                      Approve payroll
                    </Button>
                  )}
                  {canManage && selected.status === "approved" && (
                    <Button
                      className="!bg-teal-700"
                      onClick={() => setPaymentOpen(!paymentOpen)}
                    >
                      Record payment confirmation
                    </Button>
                  )}
                  {canManage && selected.status === "draft" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDiscardOpen(!discardOpen)}
                    >
                      Discard draft
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Printer className="size-4" />}
                    onClick={() =>
                      notifyDocument(() => printSalaryRegister(selected))
                    }
                  >
                    Salary register
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      selected.status === "draft" ||
                      selected.summary.bank_total === 0
                    }
                    onClick={() =>
                      notifyDocument(() => printBankLetter(selected))
                    }
                  >
                    Bank forwarding letter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      selected.status === "draft" ||
                      selected.summary.bank_total === 0
                    }
                    onClick={() =>
                      notifyDocument(() => exportBankCsv(selected))
                    }
                  >
                    Bank CSV
                  </Button>
                </div>
                <Text
                  variant="caption"
                  className="!font-normal !text-slate-500"
                >
                  Approval locks the imported salary snapshot. Bank documents
                  can be printed or saved as PDF. Bank CSV uses a standard
                  register; your bank may require a different upload format.
                </Text>
                {selected.approved_at && (
                  <Text variant="caption" className="mt-3">
                    Approved {new Date(selected.approved_at).toLocaleString()} ·
                    User #{selected.approved_by}
                  </Text>
                )}
                {selected.status === "paid" && (
                  <Text variant="caption" className="mt-3 !text-teal-800">
                    Payment recorded on {selected.payment_date} · Reference{" "}
                    {selected.payment_reference}
                  </Text>
                )}
                {discardOpen && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 mt-4">
                    <Text className="!text-sm">
                      Discard this unapproved batch and its attachments? You can
                      then import a corrected sheet.
                    </Text>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={busy}
                        onClick={async () => {
                          try {
                            await discard(selected.id).unwrap();
                            setDiscardOpen(false);
                            setSelectedId(null);
                            toast.success("Draft discarded.");
                          } catch (err) {
                            toast.error(payrollError(err));
                          }
                        }}
                      >
                        Discard this draft
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDiscardOpen(false)}
                      >
                        Keep draft
                      </Button>
                    </div>
                  </div>
                )}
                {paymentOpen && (
                  <form
                    className="grid sm:grid-cols-3 gap-3 bg-teal-50 rounded-xl p-4 mt-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      transition(selected, "paid");
                    }}
                  >
                    <Input
                      label="Actual payment date"
                      type="date"
                      required
                      value={paymentDate}
                      onChange={(event) => setPaymentDate(event.target.value)}
                    />
                    <Input
                      label="Bank / cash transaction reference"
                      required
                      value={paymentReference}
                      maxLength={255}
                      onChange={(event) =>
                        setPaymentReference(event.target.value)
                      }
                    />
                    <Button
                      type="submit"
                      disabled={busy}
                      className="self-end !bg-teal-700"
                    >
                      Confirm payment recorded
                    </Button>
                    <Text
                      variant="caption"
                      className="sm:col-span-3 !font-normal"
                    >
                      Record this after the bank or cashier confirms payment.
                      This app does not send money.
                    </Text>
                  </form>
                )}
              </CardWrapper>
              <CardWrapper
                title="Employee salary register"
                description="Factory, section and line details with the approved salary breakdown."
                className="!border-slate-200"
                headerAction={
                  <SearchInput
                    aria-label="Search salary register"
                    placeholder="Employee, factory or line…"
                    value={search}
                    onChange={setSearch}
                    className="max-w-xs"
                  />
                }
              >
                <PayrollRegister
                  rows={selected.items}
                  search={search}
                  onPayslip={(item) =>
                    notifyDocument(() => printPayslip(selected, item))
                  }
                />
              </CardWrapper>
              <CardWrapper
                title="Supporting files"
                description="Keep salary sheets, bank confirmations and approval documents together."
                className="!border-slate-200"
                headerAction={
                  canManage && (
                    <label
                      className={`inline-flex gap-2 text-sm items-center border border-slate-200 rounded-lg px-3 py-2 cursor-pointer ${busy ? "opacity-50" : ""}`}
                    >
                      <UploadCloud className="size-4 text-teal-700" />
                      Attach file
                      <input
                        aria-label="Attach supporting payroll file"
                        type="file"
                        className="sr-only"
                        disabled={busy}
                        accept=".pdf,.xlsx,.csv,.tsv,.txt,.json,.jpg,.jpeg,.png,.docx"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) uploadSupporting(file);
                          event.target.value = "";
                        }}
                      />
                    </label>
                  )
                }
              >
                <div className="space-y-2">
                  {selected.attachments.map((file) => (
                    <Button
                      key={file.id}
                      variant="ghost"
                      onClick={async () => {
                        try {
                          const blob = await downloadFile({
                            id: selected.id,
                            attachment: file.id,
                          }).unwrap();
                          downloadUrl(blob, file.name);
                        } catch (err) {
                          toast.error(payrollError(err));
                        }
                      }}
                      leftIcon={<Download className="size-4" />}
                    >
                      {file.name}{" "}
                      <span className="text-slate-500 text-xs">
                        {Math.ceil(file.size / 1024)} KB
                      </span>
                    </Button>
                  ))}
                  {!selected.attachments.length && (
                    <Text variant="muted">No supporting files attached.</Text>
                  )}
                </div>
              </CardWrapper>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
