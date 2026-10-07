import assert from "node:assert/strict";
import { test } from "node:test";
import { Workbook } from "exceljs";
import {
  mapPayrollRows,
  parsePayrollFile,
  suggestMapping,
} from "../lib/payroll/import";

test("CSV handles quoted commas and preserves bank account leading zeroes", async () => {
  const file = new File(
    [
      'Employee ID,Basic Salary,Account Number,Factory\nRMG-1,"10,000",00123456789,"Gazipur, Unit 1"',
    ],
    "salary.csv",
  );
  const parsed = await parsePayrollFile(file);
  const rows = mapPayrollRows(parsed, suggestMapping(parsed.headers));
  assert.equal(rows[0].employee_full_id, "RMG-1");
  assert.equal(rows[0].basic_salary, "10000");
  assert.equal(rows[0].bank_account_no, "00123456789");
  assert.equal(rows[0].factory, "Gazipur, Unit 1");
});

test("TSV and JSON imports map required payroll fields", async () => {
  const parsed = await parsePayrollFile(
    new File(["employee_full_id\tbasic_salary\nRMG-1\t12000"], "salary.tsv"),
  );
  assert.equal(
    mapPayrollRows(parsed, suggestMapping(parsed.headers))[0].basic_salary,
    "12000",
  );
  const json = await parsePayrollFile(
    new File(
      [
        '[{"employee_full_id":"RMG-2","basic_salary":15000,"bank_account_no":"00012345678"}]',
      ],
      "salary.json",
    ),
  );
  assert.equal(
    mapPayrollRows(json, suggestMapping(json.headers))[0].bank_account_no,
    "00012345678",
  );
});

test("XLSX reads the first sheet with text account numbers and rejects formulas", async () => {
  const book = new Workbook();
  const sheet = book.addWorksheet("Salary");
  sheet.addRow(["employee_full_id", "basic_salary", "bank_account_no"]);
  sheet.addRow(["RMG-1", 10000, "00123456789"]);
  const buffer = await book.xlsx.writeBuffer();
  const parsed = await parsePayrollFile(
    new File([new Uint8Array(buffer)], "salary.xlsx"),
  );
  assert.equal(
    mapPayrollRows(parsed, suggestMapping(parsed.headers))[0].bank_account_no,
    "00123456789",
  );
  sheet.getCell("B2").value = { formula: "5000+5000", result: 10000 };
  const formulas = await book.xlsx.writeBuffer();
  await assert.rejects(
    parsePayrollFile(new File([new Uint8Array(formulas)], "salary.xlsx")),
    /Replace spreadsheet formulas/,
  );
});

test("ambiguous headers, incomplete rows, duplicate mappings and unsupported files fail clearly", async () => {
  await assert.rejects(
    parsePayrollFile(new File(["ID,ID\n1,2"], "salary.csv")),
    /unique/,
  );
  await assert.rejects(
    parsePayrollFile(new File(["ID,Basic\nRMG-1"], "salary.csv")),
    /same number/,
  );
  await assert.rejects(
    parsePayrollFile(
      new File(['[{"employee_full_id":{"bad":1}}]'], "salary.json"),
    ),
    /text or numbers/,
  );
  await assert.rejects(
    parsePayrollFile(new File(["legacy file"], "salary.xls")),
    /Save legacy XLS/,
  );
  assert.throws(
    () =>
      mapPayrollRows({ headers: ["ID", "Basic"], rows: [["RMG-1", "10000"]] }, [
        "employee_full_id",
        "employee_full_id",
      ]),
    /Basic Salary/,
  );
  assert.throws(
    () =>
      mapPayrollRows(
        {
          headers: ["ID", "Basic", "Basic 2"],
          rows: [["RMG-1", "10000", "10000"]],
        },
        ["employee_full_id", "basic_salary", "basic_salary"],
      ),
    /only once/,
  );
});
