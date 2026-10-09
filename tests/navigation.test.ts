import test from "node:test";
import assert from "node:assert/strict";
import {
  LIVE_MODULES, PEOPLE_SECTIONS, FACTORY_SECTIONS, EMPLOYEE_SECTIONS,
  isModuleAvailable, resolveNavigation,
} from "../lib/navigation";

test("production navigation only exposes implemented modules", () => {
  for (const tab of LIVE_MODULES) assert.equal(isModuleAvailable(tab), true);
  for (const tab of ["recruitment", "accounting", "loans", "requests", "devices-logs", "notices"] as const) {
    assert.equal(isModuleAvailable(tab), false);
    assert.equal(isModuleAvailable(tab, true), true);
  }
});

test("every HR, factory and employee submenu resolves to its exact section", () => {
  for (const item of PEOPLE_SECTIONS) assert.deepEqual(resolveNavigation("people", item.id), { tab: "people", section: item.id });
  for (const item of FACTORY_SECTIONS) assert.deepEqual(resolveNavigation("factory", item.id), { tab: "factory", section: item.id });
  for (const item of EMPLOYEE_SECTIONS) assert.deepEqual(resolveNavigation("employees", item.id), { tab: "employees", section: item.id });
  assert.deepEqual(resolveNavigation("people", "unknown"), { tab: "people", section: "document" });
  assert.deepEqual(resolveNavigation("factory", "unknown"), { tab: "factory", section: "production" });
  assert.deepEqual(resolveNavigation("employees", "unknown"), { tab: "employees", section: "directory" });
});

test("parent and dashboard navigation reset stale sections", () => {
  assert.deepEqual(resolveNavigation("people"), { tab: "people", section: "document" });
  assert.deepEqual(resolveNavigation("factory"), { tab: "factory", section: "production" });
  assert.deepEqual(resolveNavigation("employees"), { tab: "employees", section: "directory" });
  assert.deepEqual(resolveNavigation("leave"), { tab: "leave", section: undefined });
  assert.deepEqual(resolveNavigation("employees", "bulk-salary"), { tab: "employees", section: "bulk-salary" });
});

test("legacy shortcuts use the real replacement workflows", () => {
  assert.deepEqual(resolveNavigation("shifts"), { tab: "people", section: "roster" });
  assert.deepEqual(resolveNavigation("performance", "training"), { tab: "people", section: "training" });
  assert.deepEqual(resolveNavigation("hr-setup", "holiday"), { tab: "people", section: "holiday" });
  assert.deepEqual(resolveNavigation("hr-setup", "shifts"), { tab: "factory", section: "shift" });
  assert.deepEqual(resolveNavigation("hr-setup", "grades"), { tab: "factory", section: "grade" });
  assert.deepEqual(resolveNavigation("shifts", undefined, true), { tab: "shifts", section: undefined });
});
