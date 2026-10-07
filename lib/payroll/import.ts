import Papa from "papaparse";
import {
  ImportField,
  ImportRow,
  importFields,
  numberFields,
} from "@/store/services/payroll/runTypes";
export interface ParsedPayrollFile {
  headers: string[];
  rows: string[][];
}
export const label = (field: string) =>
  field
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
const aliases: Record<string, ImportField> = {
  employee_id: "employee_full_id",
  emp_id: "employee_full_id",
  id: "employee_full_id",
  worker_id: "employee_full_id",
  basic: "basic_salary",
  basic_pay: "basic_salary",
  account_no: "bank_account_no",
  account_number: "bank_account_no",
  bank_account: "bank_account_no",
  routing_number: "routing_no",
  routing_name: "routing_no",
  ot_hours: "overtime_hours",
  ot_rate: "overtime_rate",
  net_salary: "net_payable",
  net_pay: "net_payable",
  unit: "factory",
  production_line: "line",
};
export function suggestMapping(headers: string[]): string[] {
  return headers.map((header) => {
    const key = normalize(header);
    return importFields.find((field) => field === key) || aliases[key] || "";
  });
}
export async function parsePayrollFile(file: File): Promise<ParsedPayrollFile> {
  if (file.size > 10 * 1024 * 1024)
    throw new Error("Choose a file smaller than 10 MB.");
  const extension = file.name.split(".").pop()?.toLowerCase();
  let data: string[][];
  if (extension === "xlsx") {
    const { default: ExcelJS } = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const sheet = workbook.worksheets[0];
    if (!sheet || sheet.rowCount > 5001 || sheet.columnCount > 100)
      throw new Error(
        "The first sheet must contain at most 5,000 employees and 100 columns.",
      );
    data = [];
    sheet.eachRow((row) => {
      const values: string[] = [];
      for (let col = 1; col <= sheet.columnCount; col++) {
        const cell = row.getCell(col);
        if (cell.type === 6)
          throw new Error(
            "Replace spreadsheet formulas with their values before importing.",
          );
        values.push(cell.text);
      }
      data.push(values);
    });
  } else if (["csv", "tsv", "txt"].includes(extension || "")) {
    const result = Papa.parse<string[]>(await file.text(), {
      skipEmptyLines: "greedy",
    });
    const errors = result.errors.filter(
      (error) => error.code !== "UndetectableDelimiter",
    );
    if (errors.length)
      throw new Error(`File could not be read: ${errors[0].message}`);
    data = result.data;
  } else if (extension === "json") {
    const parsed: unknown = JSON.parse(await file.text());
    if (
      !Array.isArray(parsed) ||
      !parsed.length ||
      !parsed.every(
        (row) => row && typeof row === "object" && !Array.isArray(row),
      )
    )
      throw new Error("JSON must be an array of employee records.");
    const records = parsed as Record<string, unknown>[];
    const headers = Array.from(
      new Set(records.flatMap((row) => Object.keys(row))),
    );
    data = [
      headers,
      ...records.map((row) =>
        headers.map((key) => {
          const value = row[key];
          if (
            value !== undefined &&
            value !== null &&
            typeof value !== "string" &&
            typeof value !== "number"
          )
            throw new Error("JSON values must be text or numbers.");
          return String(value ?? "");
        }),
      ),
    ];
  } else {
    throw new Error(
      "Salary imports support XLSX, CSV, TSV, TXT and JSON. Save legacy XLS as XLSX first.",
    );
  }
  const [headers, ...rows] = data;
  if (
    !headers?.length ||
    !rows.length ||
    rows.length > 5000 ||
    headers.length > 100
  )
    throw new Error(
      "Include a header row and 1–5,000 employee rows, with at most 100 columns.",
    );
  if (
    new Set(headers.map(normalize)).size !== headers.length ||
    headers.some((header) => !header.trim())
  )
    throw new Error("Every column needs a unique, non-empty header.");
  if (rows.some((row) => row.length !== headers.length))
    throw new Error(
      "Every row must have the same number of columns as the header.",
    );
  return { headers, rows };
}
export function mapPayrollRows(
  file: ParsedPayrollFile,
  mapping: string[],
): ImportRow[] {
  const selected = mapping.filter(Boolean);
  if (
    !selected.includes("employee_full_id") ||
    !selected.includes("basic_salary")
  )
    throw new Error("Map Employee Full ID and Basic Salary before validation.");
  if (new Set(selected).size !== selected.length)
    throw new Error("Map each payroll field only once.");
  return file.rows.map((row) => {
    const result: ImportRow = {};
    mapping.forEach((field, index) => {
      if (!importFields.includes(field as ImportField)) return;
      const key = field as ImportField;
      const value = row[index]?.trim() || "";
      if (!value && !["employee_full_id", "basic_salary"].includes(field))
        return;
      result[key] =
        numberFields.some((numberField) => numberField === field) ||
        field === "net_payable"
          ? value.replace(/,/g, "")
          : value;
    });
    return result;
  });
}
export function downloadUrl(url: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function downloadBlob(blob: Blob, filename: string) {
  downloadUrl(URL.createObjectURL(blob), filename);
}
export function downloadTemplate() {
  const headers = [...importFields];
  downloadBlob(
    new Blob([Papa.unparse([headers])], { type: "text/csv;charset=utf-8" }),
    "payroll-import-template.csv",
  );
}
