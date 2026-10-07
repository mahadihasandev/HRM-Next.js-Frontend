"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Users,
  Mail,
  Phone,
  X,
  Eye,
  Building2,
  ShieldCheck,
  UserPlus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Title,
  CardWrapper,
  Button,
  Badge,
  SearchInput,
  PageHeader,
  EmptyState,
  Banner,
} from "@/components/shared";
import { useGetEmployeesQuery, useCreateEmployeeMutation, useUpdateEmployeeMutation, useDeleteEmployeeMutation } from "@/store/services/employees";
import {
  Employee,
  EmployeeApiRecord,
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from "@/types/hrm";
import { RegisterEmployeeModal } from "./RegisterEmployeeModal";
import { EditEmployeeModal } from "./EditEmployeeModal";
import { DeleteEmployeeDialog } from "./DeleteEmployeeDialog";
import { ManagePermissionsModal } from "./ManagePermissionsModal";
import {
  EmployeeBirthdaysTab,
  EmployeeProbationTab,
  EmployeeSummaryTab,
  EmployeeReportsTab,
  EmployeeArchiveHoldTab,
  EmployeeBulkSalaryTab,
  EmployeeIdCardPrintTab,
} from "./tabs";

export type EmployeeSubTab =
  | "directory"
  | "add-employee"
  | "birthdays"
  | "probation"
  | "summary"
  | "reports"
  | "archive"
  | "bulk-salary"
  | "id-cards";

function mapApiRecordToEmployee(item: EmployeeApiRecord): Employee {
  return {
    id: item.id,
    employee_id: item.employee_id || item.id,
    employee_full_id: item.employee_full_id || `SMT-00${item.id}`,
    name: item.name,
    email: item.email || "",
    phone_number: item.phone || item.phone_number || "",
    personal_phone_number:
      item.personal_phone ||
      item.personal_phone_number ||
      item.phone ||
      "",
    designation: item.designation || "",
    department: item.department || "",
    company: item.company || "",
    status:
      item.status === "Active" ||
      item.status === "Inactive" ||
      item.status === "On Leave"
        ? item.status
        : "Active",
    blood_group: item.blood_group || "",
    gender: item.gender || "",
    marital_status: item.marital_status || "",
    religion: item.religion || "",
    date_of_birth: item.date_of_birth || "",
    joining_date: item.joining_date || "",
    present_address: item.present_address || "",
    permanent_address: item.permanent_address || "",
    father_name: item.father_name || "",
    mother_name: item.mother_name || "",
    bank_name: item.bank_name || "",
    bank_account_no: item.bank_account_no || "",
    branch_name: item.branch_name || "",
    routing_name: item.routing_name || "",
    salary: {
      basic: Number(item.basic_salary ?? 0),
      house_rent: Number(item.house_rent ?? 0),
      medical_allowance: Number(item.medical_allowance ?? 0),
      conveyance: Number(item.conveyance ?? 0),
      gross: Number(item.gross_salary ?? 0),
      pf_deduction: Number(item.pf_deduction ?? 0),
      tax_deduction: Number(item.tax_deduction ?? 0),
      net_payable: Number(item.net_payable ?? 0),
    },
  };
}

interface EmployeeDirectoryViewProps {
  currentOperator?: {
    id: number | string;
    fullId: string;
    name: string;
    department: string;
  };
  isAdmin?: boolean;
  initialSubTab?: EmployeeSubTab;
}

export function EmployeeDirectoryView({
  currentOperator,
  isAdmin,
  initialSubTab = "directory",
}: EmployeeDirectoryViewProps = {}) {
  const activeSubTab: EmployeeSubTab =
    initialSubTab === "add-employee" ? "directory" : initialSubTab;
  const [isAddModalOpen, setIsAddModalOpen] = useState(
    initialSubTab === "add-employee",
  );

  const { data: employeeResponse, isLoading, isError } = useGetEmployeesQuery();
  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const employees = (employeeResponse?.data ?? []).map(mapApiRecordToEmployee);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
    null,
  );
  const [permissionsEmployee, setPermissionsEmployee] =
    useState<Employee | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const pageSize = 15;

  const handleCreateEmployee = async (payload: CreateEmployeePayload) => {
    setIsSubmitting(true);
    try {
      const json = await createEmployee(payload).unwrap();
      if (!json.status) throw new Error(json.message || 'Employee registration failed');
      const createdItem: EmployeeApiRecord = json.data;
      const newEmp = mapApiRecordToEmployee(createdItem);

      setIsAddModalOpen(false);
      toast.success(
        `Employee ${newEmp.name} (${newEmp.employee_full_id}) registered successfully!`,
      );
      setFeedbackMsg(
        `✓ Employee ${newEmp.name} enrolled successfully with ID ${newEmp.employee_full_id}!`,
      );
      setTimeout(() => setFeedbackMsg(null), 6000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Server error";
      toast.error("Error registering employee: " + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEmployee = async (
    id: number | string,
    payload: UpdateEmployeePayload,
  ) => {
    setIsUpdating(true);
    try {
      const json = await updateEmployee({ id, data: payload }).unwrap();
      if (!json.status) throw new Error(json.message || 'Employee update failed');
      const updatedRecord: EmployeeApiRecord = json.data;
      const updatedEmp = mapApiRecordToEmployee(updatedRecord);

      if (
        selectedEmployee &&
        (selectedEmployee.id === id ||
          selectedEmployee.employee_full_id === String(id))
      ) {
        setSelectedEmployee(updatedEmp);
      }

      setEditingEmployee(null);
      toast.success(`Employee ${updatedEmp.name} updated successfully!`);
      setFeedbackMsg(`✓ Employee ${updatedEmp.name} updated successfully!`);
      setTimeout(() => setFeedbackMsg(null), 6000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Server error";
      toast.error("Error updating employee: " + msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteEmployee = async (id: number | string) => {
    setIsDeleting(true);
    try {
      const json = await deleteEmployee(id).unwrap();
      if (!json.status) throw new Error(json.message || 'Employee deactivation failed');
      if (
        selectedEmployee &&
        (selectedEmployee.id === id ||
          selectedEmployee.employee_full_id === String(id))
      ) {
        setSelectedEmployee(null);
      }

      setDeletingEmployee(null);
      toast.success("Employee removed successfully.");
      setFeedbackMsg("✓ Employee removed from the system successfully.");
      setTimeout(() => setFeedbackMsg(null), 6000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Server error";
      toast.error("Error deleting employee: " + msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const departments = [
    "all",
    "Sales & Distribution",
    "Human Resources",
    "Product Design",
    "Engineering",
    "Finance & Accounts",
    "Operations",
    "Supply Chain",
    "Legal & Compliance",
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_full_id.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase()) ||
      (emp.phone_number && emp.phone_number.includes(search));

    const matchesDept =
      departmentFilter === "all" || emp.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-6">
      {isLoading && <Banner variant="info" title="Loading employees" description="Retrieving your company directory." />}
      {isError && <Banner variant="danger" title="Directory unavailable" description="Employees could not be loaded. Check your connection and sign in again if needed." />}
      <PageHeader
        title="Employees"
        titleClassName="text-gray-700"
        subtitle="Manage your people, profiles, departments and bank details."
        badge={
          <Badge variant="default" className="gap-1.5 font-medium">
            <Users className="h-3.5 w-3.5 text-white" />
            {filteredEmployees.length} Total Staff
          </Badge>
        }
        action={
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<UserPlus className="h-4 w-4" />}
            className="bg-teal-700 hover:bg-teal-800 text-white font-medium shadow-sm"
          >
            Add Employee
          </Button>
        }
      />

      {feedbackMsg && (
        <Banner
          variant="success"
          title="Employee Enrolled"
          description={feedbackMsg}
          isDismissible
          onClose={() => setFeedbackMsg(null)}
        />
      )}

      {activeSubTab !== 'directory' && process.env.NEXT_PUBLIC_ENABLE_DEMO_PREVIEWS !== 'true' ? (
        <Banner variant="info" title="This employee tool is not available yet" description="Use the employee directory and approved payroll workflow for current records." />
      ) : <>
      {activeSubTab === "birthdays" && <EmployeeBirthdaysTab />}
      {activeSubTab === "probation" && <EmployeeProbationTab />}
      {activeSubTab === "summary" && <EmployeeSummaryTab />}
      {activeSubTab === "reports" && <EmployeeReportsTab />}
      {activeSubTab === "archive" && <EmployeeArchiveHoldTab />}
      {activeSubTab === "bulk-salary" && <EmployeeBulkSalaryTab />}
      {activeSubTab === "id-cards" && <EmployeeIdCardPrintTab />}

      </>}
      {activeSubTab === "directory" && (
        <>
          {/* Search and Filters Bar with High Contrast */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-none">
            <div className="w-full sm:max-w-md">
              <SearchInput
                placeholder="Search by name, employee ID or role…"
                value={search}
                onChange={(val) => {
                  if (val !== search) {
                    setSearch(val);
                    setCurrentPage(1);
                  }
                }}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label
                htmlFor="employee-department"
                className="text-xs text-slate-500 font-medium"
              >
                Department
              </label>
              <select
                id="employee-department"
                value={departmentFilter}
                onChange={(e) => {
                  const nextDept = e.target.value;
                  if (nextDept !== departmentFilter) {
                    setDepartmentFilter(nextDept);
                    setCurrentPage(1);
                  }
                }}
                className="h-10 text-xs rounded-lg border border-slate-200 bg-white px-3 font-medium text-slate-900 focus:outline-none focus:border-teal-600"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Employees Table / Cards */}
          <CardWrapper>
            {filteredEmployees.length === 0 ? (
              <EmptyState
                title="No personnel found"
                description={
                  search || departmentFilter !== "all"
                    ? "No employee records match your search criteria or department filter."
                    : "No employee records available in directory."
                }
                icon={<Users className="h-6 w-6 text-slate-900" />}
                className="my-4"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4">Employee</th>
                      <th className="py-3.5 px-4">Role & Department</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Bank Verification</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedEmployees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-teal-50/30 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-teal-50 text-teal-700 font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs">
                              {emp.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-950 leading-tight">
                                {emp.name}
                              </p>
                              <p className="text-xs text-slate-600 font-mono font-medium mt-0.5">
                                {emp.employee_full_id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-900">
                            {emp.designation}
                          </p>
                          <p className="text-xs text-slate-600 font-semibold">
                            {emp.department}
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-xs space-y-0.5">
                            <p className="flex items-center gap-1.5 text-slate-700 font-medium">
                              <Mail className="h-3 w-3 text-slate-900 shrink-0" />
                              {emp.email}
                            </p>
                            <p className="flex items-center gap-1.5 text-slate-700 font-medium">
                              <Phone className="h-3 w-3 text-slate-900 shrink-0" />
                              {emp.phone_number || emp.personal_phone_number}
                            </p>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-xs">
                            <span className="font-medium text-slate-900">
                              {emp.bank_name}
                            </span>
                            <p className="font-mono text-slate-600 font-semibold text-[11px]">
                              {emp.bank_account_no
                                ? `••• ${emp.bank_account_no.slice(-4)}`
                                : "Pending"}
                            </p>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              emp.status === "Active" ? "success" : "warning"
                            }
                          >
                            {emp.status}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedEmployee(emp)}
                              leftIcon={
                                <Eye className="h-3.5 w-3.5 text-slate-900" />
                              }
                              className="border-slate-300 font-medium text-slate-900 hover:bg-slate-100 px-2.5"
                              title="View Profile"
                            >
                              Profile
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPermissionsEmployee(emp)}
                              leftIcon={
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                              }
                              className="border-slate-300 font-medium text-emerald-800 hover:bg-emerald-50 px-2.5"
                              title="Manage Permissions & Module Visibility"
                            >
                              Access
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingEmployee(emp)}
                              leftIcon={
                                <Pencil className="h-3.5 w-3.5 text-amber-700" />
                              }
                              className="border-slate-300 font-medium text-amber-800 hover:bg-amber-50 px-2.5"
                              title="Edit Employee"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingEmployee(emp)}
                              leftIcon={
                                <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                              }
                              className="border-slate-300 font-medium text-rose-700 hover:bg-rose-50 px-2.5"
                              title="Delete Employee"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 bg-white">
                    <span className="text-xs text-slate-700 font-semibold">
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(
                        currentPage * pageSize,
                        filteredEmployees.length,
                      )}{" "}
                      of {filteredEmployees.length} personnel
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
                        className="border-slate-300 text-xs font-medium h-8 px-2.5"
                      >
                        Prev
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`h-8 w-8 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              currentPage === pageNum
                                ? "bg-slate-900 text-white shadow-xs font-semibold"
                                : "bg-white text-slate-800 border border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
                        className="border-slate-300 text-xs font-medium h-8 px-2.5"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardWrapper>

          {/* Employee Full Profile Drawer / Modal */}
          {selectedEmployee && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="absolute top-5 right-5 p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Profile Header */}
                <div className="flex items-center gap-4 pb-6 border-b border-slate-300">
                  <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-semibold text-xl shadow-md shrink-0">
                    {selectedEmployee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Title
                        level={2}
                        className="text-xl font-semibold text-gray-700"
                      >
                        {selectedEmployee.name}
                      </Title>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <p className="text-xs text-slate-700 font-mono font-medium mt-0.5">
                      ID: {selectedEmployee.employee_full_id} &bull;{" "}
                      {selectedEmployee.designation}
                    </p>
                    <p className="text-xs text-slate-900 font-medium flex items-center gap-1.5 mt-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-900" />
                      {selectedEmployee.department} &bull;{" "}
                      {selectedEmployee.company}
                    </p>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="py-4 space-y-5 text-xs">
                  {/* Personal Details */}
                  <div>
                    <p className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] pb-1.5 mb-2.5 border-b border-slate-200">
                      Personal Information
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 font-medium">
                          Father&apos;s Name:
                        </span>
                        <p className="font-medium text-slate-900">
                          {selectedEmployee.father_name || "Md. Shamsul Huda"}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">
                          Mother&apos;s Name:
                        </span>
                        <p className="font-medium text-slate-900">
                          {selectedEmployee.mother_name || "Begum Rokeya"}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">
                          Blood Group:
                        </span>
                        <p className="font-medium text-slate-900">
                          {selectedEmployee.blood_group || "B+"}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">
                          Date of Birth:
                        </span>
                        <p className="font-medium text-slate-900">
                          {selectedEmployee.date_of_birth || "1992-06-15"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 font-medium">
                          Present Address:
                        </span>
                        <p className="font-medium text-slate-900">
                          {selectedEmployee.present_address ||
                            "Dhaka, Bangladesh"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bank & Salary Breakdown */}
                  {selectedEmployee.salary && (
                    <div>
                      <p className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] pb-1.5 mb-2.5 border-b border-slate-200 flex items-center justify-between">
                        <span>Remuneration & Bank Account</span>
                        <span className="text-emerald-700 font-semibold text-sm">
                          ৳
                          {selectedEmployee.salary.net_payable.toLocaleString()}{" "}
                          / mo
                        </span>
                      </p>
                      <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-slate-500 font-medium">
                            Bank Name:
                          </span>
                          <p className="font-medium text-slate-900">
                            {selectedEmployee.bank_name}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">
                            Account Number:
                          </span>
                          <p className="font-mono font-medium text-slate-900">
                            {selectedEmployee.bank_account_no}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">
                            Basic Pay:
                          </span>
                          <p className="font-medium text-slate-900">
                            ৳{selectedEmployee.salary.basic.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">
                            Gross Package:
                          </span>
                          <p className="font-semibold text-slate-950">
                            ৳{selectedEmployee.salary.gross.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const emp = selectedEmployee;
                        setSelectedEmployee(null);
                        setEditingEmployee(emp);
                      }}
                      leftIcon={
                        <Pencil className="h-3.5 w-3.5 text-amber-700" />
                      }
                      className="border-slate-300 font-medium text-amber-800 hover:bg-amber-50"
                    >
                      Edit Employee
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const emp = selectedEmployee;
                        setSelectedEmployee(null);
                        setPermissionsEmployee(emp);
                      }}
                      leftIcon={
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      }
                      className="border-slate-300 font-medium text-emerald-800 hover:bg-emerald-50"
                    >
                      Permissions
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const emp = selectedEmployee;
                        setSelectedEmployee(null);
                        setDeletingEmployee(emp);
                      }}
                      leftIcon={
                        <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                      }
                      className="border-slate-300 font-medium text-rose-700 hover:bg-rose-50"
                    >
                      Delete Record
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setSelectedEmployee(null)}
                    className="bg-slate-900 text-white font-medium"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Register New Employee Modal */}
      <RegisterEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateEmployee}
        isLoading={isSubmitting}
      />

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        key={editingEmployee?.employee_full_id || "edit-closed"}
        isOpen={Boolean(editingEmployee)}
        onClose={() => setEditingEmployee(null)}
        employee={editingEmployee}
        onSubmit={handleUpdateEmployee}
        isLoading={isUpdating}
      />

      {/* Delete Employee Confirmation Dialog */}
      <DeleteEmployeeDialog
        isOpen={Boolean(deletingEmployee)}
        onClose={() => setDeletingEmployee(null)}
        employee={deletingEmployee}
        onConfirm={handleDeleteEmployee}
        isLoading={isDeleting}
      />

      {/* Role & Permissions Access Control Modal */}
      <ManagePermissionsModal
        key={permissionsEmployee?.employee_full_id || "permissions-closed"}
        isOpen={Boolean(permissionsEmployee)}
        onClose={() => setPermissionsEmployee(null)}
        employee={permissionsEmployee}
        operator={currentOperator}
        isAdmin={isAdmin}
        onPermissionsUpdated={() => {
          setFeedbackMsg(
            `✓ Permissions policy for ${permissionsEmployee?.name} updated successfully!`,
          );
          setTimeout(() => setFeedbackMsg(null), 6000);
        }}
      />
    </div>
  );
}
