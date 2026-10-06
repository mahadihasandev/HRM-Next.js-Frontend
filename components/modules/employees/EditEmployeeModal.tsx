"use client";

import React, { useState, useEffect } from "react";
import { X, Pencil, Building2, Banknote, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Title, Subtitle, Button, Input, Label, Badge } from "@/components/shared";
import { Employee, UpdateEmployeePayload } from "@/types/hrm";

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSubmit: (id: number | string, payload: UpdateEmployeePayload) => Promise<void> | void;
  isLoading?: boolean;
}

const DEPARTMENTS = [
  "Sales & Distribution",
  "Human Resources",
  "Product Design",
  "Engineering",
  "Finance & Accounts",
  "Operations",
  "Supply Chain",
  "Legal & Compliance",
];

const STATUSES: Array<"Active" | "Inactive" | "On Leave"> = ["Active", "Inactive", "On Leave"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const MARITAL_STATUSES: Array<"Single" | "Married" | "Other"> = ["Single", "Married", "Other"];

export function EditEmployeeModal({
  isOpen,
  onClose,
  employee,
  onSubmit,
  isLoading = false,
}: EditEmployeeModalProps) {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [status, setStatus] = useState<"Active" | "Inactive" | "On Leave">("Active");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [personalPhone, setPersonalPhone] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [bloodGroup, setBloodGroup] = useState("B+");
  const [maritalStatus, setMaritalStatus] = useState<"Single" | "Married" | "Other">("Married");
  const [religion, setReligion] = useState("Islam");
  const [basicSalary, setBasicSalary] = useState("50000");
  const [joiningDate, setJoiningDate] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [presentAddress, setPresentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [bankName, setBankName] = useState("Eastern Bank PLC");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");

  useEffect(() => {
    if (employee) {
      setName(employee.name || "");
      setDesignation(employee.designation || "");
      setDepartment(employee.department || DEPARTMENTS[0]);
      setStatus(employee.status || "Active");
      setEmail(employee.email || "");
      setPhone(employee.phone_number || "");
      setPersonalPhone(employee.personal_phone_number || employee.phone_number || "");
      setGender((employee.gender as "Male" | "Female" | "Other") || "Male");
      setBloodGroup(employee.blood_group || "B+");
      setMaritalStatus((employee.marital_status as "Single" | "Married" | "Other") || "Married");
      setReligion(employee.religion || "Islam");
      setBasicSalary(
        employee.salary?.basic
          ? String(employee.salary.basic)
          : "50000"
      );
      setJoiningDate(employee.joining_date || "");
      setDateOfBirth(employee.date_of_birth || "");
      setPresentAddress(employee.present_address || "");
      setPermanentAddress(employee.permanent_address || "");
      setBankName(employee.bank_name || "Eastern Bank PLC");
      setBankAccountNo(employee.bank_account_no || "");
      setFatherName(employee.father_name || "");
      setMotherName(employee.mother_name || "");
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !designation.trim()) return;

    const payload: UpdateEmployeePayload = {
      name: name.trim(),
      designation: designation.trim(),
      department,
      status,
      email: email.trim(),
      phone: phone.trim(),
      personal_phone: personalPhone.trim() || phone.trim(),
      gender,
      blood_group: bloodGroup,
      marital_status: maritalStatus,
      religion,
      basic_salary: Number(basicSalary) || 45000,
      joining_date: joiningDate,
      date_of_birth: dateOfBirth,
      present_address: presentAddress.trim(),
      permanent_address: permanentAddress.trim(),
      father_name: fatherName.trim(),
      mother_name: motherName.trim(),
      bank_name: bankName.trim(),
      bank_account_no: bankAccountNo.trim(),
    };

    onSubmit(employee.id, payload);
  };

  const parsedSalary = Number(basicSalary) || 0;
  const houseRent = Math.round(parsedSalary * 0.50);
  const medical = Math.round(parsedSalary * 0.10);
  const conveyance = 4000;
  const grossSalary = parsedSalary + houseRent + medical + conveyance;
  const pfDeduction = Math.round(parsedSalary * 0.0833);
  const taxDeduction = Math.round(grossSalary > 50000 ? (grossSalary - 50000) * 0.10 : 0);
  const netPayable = grossSalary - pfDeduction - taxDeduction;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-4 sm:p-6 sm:p-8 shadow-2xl border-2 border-slate-300 relative my-4 sm:my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md shadow-amber-600/30 shrink-0">
            <Pencil className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Title level={2} className="text-xl font-black text-gray-700">
                Edit Employee Details
              </Title>
              <Badge variant="default" className="font-mono text-xs font-bold">
                {employee.employee_full_id}
              </Badge>
            </div>
            <Subtitle className="text-xs text-slate-700 font-medium">
              Update personnel credentials, designation, organizational status, and BLA salary structure
            </Subtitle>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Primary Employment Information */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Building2 className="h-4 w-4 text-slate-800" />
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Official Designation & Department
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="edit-emp-name" className="text-xs text-slate-900 font-bold">
                  Full Name *
                </Label>
                <Input
                  id="edit-emp-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mohammad Rafiqul Islam"
                  required
                  className="bg-white text-slate-900 font-semibold border-2 border-slate-300 focus:border-slate-900"
                />
              </div>

              <div>
                <Label htmlFor="edit-emp-desig" className="text-xs text-slate-900 font-bold">
                  Designation *
                </Label>
                <Input
                  id="edit-emp-desig"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Area Sales Manager"
                  required
                  className="bg-white text-slate-900 font-semibold border-2 border-slate-300 focus:border-slate-900"
                />
              </div>

              <div>
                <Label htmlFor="edit-emp-dept" className="text-xs text-slate-900 font-bold">
                  Department *
                </Label>
                <select
                  id="edit-emp-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border-2 border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="edit-emp-status" className="text-xs text-slate-900 font-bold">
                  Employment Status
                </Label>
                <select
                  id="edit-emp-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Active" | "Inactive" | "On Leave")}
                  className="w-full h-10 px-3 rounded-lg border-2 border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="edit-emp-email" className="text-xs text-slate-900 font-bold">
                  Official Email
                </Label>
                <Input
                  id="edit-emp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@smarterp.biz"
                  className="bg-white text-slate-900 font-semibold border-2 border-slate-300 focus:border-slate-900"
                />
              </div>

              <div>
                <Label htmlFor="edit-emp-phone" className="text-xs text-slate-900 font-bold">
                  Official Phone
                </Label>
                <Input
                  id="edit-emp-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01712000000"
                  className="bg-white text-slate-900 font-semibold border-2 border-slate-300 focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Personal & Demographic Details */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
              Personal & Demographic Profile
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <Label htmlFor="edit-emp-gender" className="text-xs text-slate-900 font-bold">
                  Gender
                </Label>
                <select
                  id="edit-emp-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "Male" | "Female" | "Other")}
                  className="w-full h-10 px-3 rounded-lg border-2 border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="edit-emp-blood" className="text-xs text-slate-900 font-bold">
                  Blood Group
                </Label>
                <select
                  id="edit-emp-blood"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border-2 border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="edit-emp-marital" className="text-xs text-slate-900 font-bold">
                  Marital Status
                </Label>
                <select
                  id="edit-emp-marital"
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value as "Single" | "Married" | "Other")}
                  className="w-full h-10 px-3 rounded-lg border-2 border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  {MARITAL_STATUSES.map((ms) => (
                    <option key={ms} value={ms}>
                      {ms}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="edit-emp-join" className="text-xs text-slate-900 font-bold">
                  Joining Date
                </Label>
                <Input
                  id="edit-emp-join"
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="bg-white text-slate-900 font-semibold border-2 border-slate-300 focus:border-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <Label htmlFor="edit-emp-address" className="text-xs text-slate-900 font-bold">
                  Present Address
                </Label>
                <Input
                  id="edit-emp-address"
                  value={presentAddress}
                  onChange={(e) => setPresentAddress(e.target.value)}
                  placeholder="House, Road, Area, Thana, District"
                  className="bg-white text-slate-900 font-semibold border-2 border-slate-300 focus:border-slate-900"
                />
              </div>

              <div>
                <Label htmlFor="edit-emp-perm-address" className="text-xs text-slate-900 font-bold">
                  Permanent Address
                </Label>
                <Input
                  id="edit-emp-perm-address"
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                  placeholder="Village, Thana, District"
                  className="bg-white text-slate-900 font-semibold border-2 border-slate-300 focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Salary Structure (BLA 2006 Standard) */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-emerald-700" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Compensation & BLA 2006 Calculation
                </h4>
              </div>
              <Badge variant="success" className="text-[11px] font-bold">
                BLA 2006 Compliant
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="edit-emp-salary" className="text-xs text-slate-900 font-bold">
                  Basic Salary (৳) *
                </Label>
                <Input
                  id="edit-emp-salary"
                  type="number"
                  min="0"
                  step="500"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value)}
                  required
                  className="bg-white text-slate-950 font-black border-2 border-slate-300 focus:border-slate-900"
                />
              </div>

              <div>
                <Label htmlFor="edit-emp-bank" className="text-xs text-slate-900 font-bold">
                  Bank Name
                </Label>
                <Input
                  id="edit-emp-bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Eastern Bank PLC"
                  className="bg-white text-slate-900 font-semibold border-2 border-slate-300 focus:border-slate-900"
                />
              </div>

              <div>
                <Label htmlFor="edit-emp-acct" className="text-xs text-slate-900 font-bold">
                  Account Number
                </Label>
                <Input
                  id="edit-emp-acct"
                  value={bankAccountNo}
                  onChange={(e) => setBankAccountNo(e.target.value)}
                  placeholder="1081250987621"
                  className="bg-white text-slate-900 font-mono font-bold border-2 border-slate-300 focus:border-slate-900"
                />
              </div>
            </div>

            {/* Computed Breakdown Table */}
            <div className="bg-white rounded-lg border-2 border-slate-300 p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-slate-600 font-medium">House Rent (50%):</span>
                <p className="font-bold text-slate-900">৳{houseRent.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-600 font-medium">Medical (10%):</span>
                <p className="font-bold text-slate-900">৳{medical.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-600 font-medium">Conveyance:</span>
                <p className="font-bold text-slate-900">৳{conveyance.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-600 font-medium">Est. Gross Pay:</span>
                <p className="font-extrabold text-slate-950">৳{grossSalary.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-600 font-medium">PF (8.33%):</span>
                <p className="font-bold text-rose-700">-৳{pfDeduction.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-600 font-medium">Tax TDS:</span>
                <p className="font-bold text-rose-700">-৳{taxDeduction.toLocaleString()}</p>
              </div>
              <div className="col-span-2 bg-emerald-50 p-1.5 rounded border border-emerald-300 flex items-center justify-between">
                <span className="text-emerald-950 font-bold text-xs">Net Monthly Payable:</span>
                <span className="text-emerald-800 font-black text-sm">৳{netPayable.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-slate-300 text-slate-900 font-bold hover:bg-slate-100 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white font-black shadow-md shadow-amber-600/30 gap-1.5 w-full sm:w-auto"
            >
              {isLoading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
