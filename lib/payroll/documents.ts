import Papa from "papaparse";
import {
  LegacyPayslip,
  PayrollItem,
  PayrollRun,
  earningFields,
  deductionFields,
} from "@/store/services/payroll/runTypes";
import { downloadBlob, label } from "./import";
export const money = (value: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(value);
const escape = (value: string | number | null | undefined) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ] || character,
  );
function printDocument(title: string, body: string) {
  const popup = window.open("", "_blank", "width=1000,height=800");
  if (!popup)
    throw new Error("Allow pop-ups to print or save the document as PDF.");
  popup.document.write(
    `<!doctype html><html><head><title>${escape(title)}</title><style>body{font:14px Arial,sans-serif;color:#17242c;max-width:900px;margin:40px auto;padding:0 24px}h1{font-size:26px;margin-bottom:8px}h2{font-size:18px}p{line-height:1.6}table{width:100%;border-collapse:collapse;font-size:11px}td,th{border:1px solid #cbd5e1;padding:8px;text-align:left}th{background:#f1f5f9}.right{text-align:right}.signature{margin-top:70px}.muted{color:#52616b}@page{size:A4;margin:16mm}@media print{body{margin:0;padding:0}thead{display:table-header-group}tr{break-inside:avoid}}</style></head><body>${body}</body></html>`,
  );
  popup.document.close();
  popup.focus();
  popup.print();
}
function requireApproved(run: PayrollRun) {
  if (run.status === "draft")
    throw new Error(
      "Approve the payroll batch before generating bank documents.",
    );
}
export function exportBankCsv(run: PayrollRun) {
  requireApproved(run);
  const bankRows = run.items.filter((item) => item.payment_method === "bank");
  if (!bankRows.length)
    throw new Error("This payroll batch has no bank payments.");
  const csv = Papa.unparse(
    bankRows.map((item) => ({
      employee_id: item.employee_full_id,
      employee_name: item.employee_name,
      bank: item.bank_name,
      account_number: item.bank_account_no,
      routing_number: item.routing_no,
      amount_bdt: item.net_payable.toFixed(2),
      month: run.month,
      reference: `PAY-${run.id}-${run.month}`,
    })),
    { escapeFormulae: true },
  );
  downloadBlob(
    new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
    `bank-salary-${run.month}-${run.id}.csv`,
  );
}
export function printBankLetter(run: PayrollRun) {
  requireApproved(run);
  const items = run.items.filter((item) => item.payment_method === "bank");
  if (!items.length)
    throw new Error("This payroll batch has no bank payments.");
  const rows = items
    .map(
      (item, index) =>
        `<tr><td>${index + 1}</td><td>${escape(item.employee_full_id)}</td><td>${escape(item.employee_name)}</td><td>${escape(item.bank_name)}</td><td>${escape(item.bank_account_no)}</td><td>${escape(item.routing_no)}</td><td class="right">${escape(money(item.net_payable))}</td></tr>`,
    )
    .join("");
  printDocument(
    `Bank forwarding PAY-${run.id}`,
    `<h1>${escape(run.company_name)}</h1><p class="muted">${escape(run.company_address)}</p><p>Reference: PAY-${run.id}-${escape(run.month)}<br>Date: ${escape(new Date().toLocaleDateString("en-GB"))}</p><p>To<br>The Branch Manager<br>${escape(run.bank_name)}<br>${escape(run.bank_branch)}</p><h2>Subject: Salary transfer instruction for ${escape(run.month)}</h2><p>Dear Sir / Madam,</p><p>Please debit our account <strong>${escape(run.debit_account)}</strong> and credit the salary accounts of the ${items.length} employees listed below, for a total of <strong>${escape(money(run.summary.bank_total))}</strong>. This instruction covers bank payments only.</p><table><thead><tr><th>SL</th><th>ID</th><th>Employee</th><th>Bank</th><th>Account</th><th>Routing</th><th>Net salary</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="6">Total salary transfer</td><td>${escape(money(run.summary.bank_total))}</td></tr></tfoot></table><p>Please provide confirmation and transaction references following processing.</p><div class="signature">${escape(run.signatory)}<br>${escape(run.signatory_title)}<br>Authorized signature &amp; company seal</div>`,
  );
}
export function printSalaryRegister(run: PayrollRun) {
  const rows = run.items
    .map(
      (item) =>
        `<tr><td>${escape(item.employee_full_id)}</td><td>${escape(item.employee_name)}</td><td>${escape(item.factory)} / ${escape(item.section)} / ${escape(item.line)}</td><td>${escape(money(item.total_earnings))}</td><td>${escape(money(item.total_deductions))}</td><td>${escape(money(item.net_payable))}</td><td>${escape(item.payment_method)}</td></tr>`,
    )
    .join("");
  printDocument(
    `Salary register ${run.month}`,
    `<h1>${escape(run.company_name)}</h1><h2>Salary register • ${escape(run.month)} • ${escape(run.status.toUpperCase())}</h2><p>Batch PAY-${run.id} · ${run.summary.employees} employees · Net payable ${escape(money(run.summary.net_payable))}</p><table><thead><tr><th>ID</th><th>Employee</th><th>Factory / section / line</th><th>Earnings</th><th>Deductions</th><th>Net salary</th><th>Method</th></tr></thead><tbody>${rows}</tbody></table>`,
  );
}
export function printPayslip(run: PayrollRun, item: PayrollItem) {
  const entries = [
    ...earningFields,
    "overtime_amount" as const,
    ...deductionFields,
  ]
    .map(
      (field) =>
        `<tr><td>${escape(label(field))}</td><td class="right">${escape(money(item[field]))}</td></tr>`,
    )
    .join("");
  printDocument(
    `Payslip ${item.employee_full_id}`,
    `<h1>${escape(run.company_name)}</h1><h2>Payslip • ${escape(run.month)} • ${escape(run.status.toUpperCase())}</h2><p>${escape(item.employee_name)} (${escape(item.employee_full_id)})<br>${escape(item.designation)} · ${escape(item.department)}<br>Factory: ${escape(item.factory)} · Section: ${escape(item.section)} · Line: ${escape(item.line)} · Grade: ${escape(item.grade)}</p><table>${entries}<tr><th>Total earnings</th><td>${escape(money(item.total_earnings))}</td></tr><tr><th>Total deductions</th><td>${escape(money(item.total_deductions))}</td></tr><tr><th>Net payable</th><th>${escape(money(item.net_payable))}</th></tr></table><p>Overtime: ${item.overtime_hours} hours × ${escape(money(item.overtime_rate))}<br>Payment method: ${escape(item.payment_method)}<br>Payment date: ${escape(run.payment_date || "Pending")}<br>Payment reference: ${escape(run.payment_reference || "Pending")}</p><div class="signature">Accounts authorization ____________________ &nbsp; Employee signature ____________________</div>`,
  );
}

export function printLegacyPayslip(item: LegacyPayslip) {
  const fields = [
    "basic_salary",
    "house_rent",
    "medical_allowance",
    "conveyance",
    "special_allowance",
    "overtime_amount",
    "pf_deduction",
    "tax_deduction",
    "loan_deduction",
    "other_deductions",
    "total_earnings",
    "total_deductions",
    "net_payable",
  ] as const;
  printDocument(
    `Payslip ${item.employee_full_id}`,
    `<h1>${escape(item.company)}</h1><h2>Previous salary record • ${escape(item.month)}</h2><p>${escape(item.employee_name)} (${escape(item.employee_full_id)})<br>${escape(item.designation)} · ${escape(item.department)}</p><table>${fields.map((field) => `<tr><td>${escape(label(field))}</td><td>${escape(money(item[field]))}</td></tr>`).join("")}</table><p>Status: ${escape(item.status)}<br>Payment: ${escape(item.payment_method)} · ${escape(item.payment_date || "Pending")}</p>`,
  );
}
