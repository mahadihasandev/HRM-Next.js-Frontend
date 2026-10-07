"use client";

import React, { useState } from "react";
import {
  X,
  UserPlus,
  Building2,
  Banknote,
  ShieldCheck,
  Mail,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Send,
  RefreshCw,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Title, Subtitle, Button, Input, Label, Badge } from "@/components/shared";
import { CreateEmployeePayload } from "@/types/hrm";
import {
  useSendVerificationCodeMutation,
  useVerifyCodeMutation,
} from "@/store/services/auth/authApi";

interface RegisterEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: CreateEmployeePayload) => Promise<void> | void;
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

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export function RegisterEmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: RegisterEmployeeModalProps) {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [bloodGroup, setBloodGroup] = useState("B+");
  const [basicSalary, setBasicSalary] = useState("50000");
  const [joiningDate, setJoiningDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [presentAddress, setPresentAddress] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [password, setPassword] = useState("");

  // Email Verification State
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [devCodePreview, setDevCodePreview] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const [sendCode, { isLoading: isSendingCode }] = useSendVerificationCodeMutation();
  const [verifyCode, { isLoading: isVerifyingCode }] = useVerifyCodeMutation();

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (isVerified || isCodeSent) {
      setIsVerified(false);
      setIsCodeSent(false);
      setVerificationCode("");
      setDevCodePreview(null);
      setVerificationError(null);
    }
  };

  const handleSendVerificationCode = async () => {
    const targetEmail =
      email.trim() ||
      (name.trim() ? `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@smarterp.biz` : "");
    if (!targetEmail) {
      toast.error("Please enter a valid email address first.");
      return;
    }
    if (!email.trim()) {
      setEmail(targetEmail);
    }
    setVerificationError(null);
    try {
      const res = await sendCode({ email: targetEmail }).unwrap();
      setIsCodeSent(true);
      setIsVerified(false);
      if (res.dev_code) {
        setDevCodePreview(res.dev_code);
        toast.success(`Verification code sent! Code: ${res.dev_code}`, { duration: 6000 });
      } else {
        toast.success("Verification code sent to email inbox!");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : err instanceof Error
          ? err.message
          : "Failed to dispatch verification code";
      setVerificationError(msg || "Error sending code");
      toast.error(msg || "Failed to dispatch code");
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationError("Please enter the 6-digit code.");
      return;
    }
    setVerificationError(null);
    try {
      const res = await verifyCode({
        email: email.trim(),
        code: verificationCode.trim(),
      }).unwrap();
      if (res.verified) {
        setIsVerified(true);
        toast.success("Email verified successfully! ✓");
      } else {
        setVerificationError(res.message || "Invalid verification code.");
        toast.error(res.message || "Invalid verification code.");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : err instanceof Error
          ? err.message
          : "Verification failed";
      setVerificationError(msg || "Verification failed");
      toast.error(msg || "Verification failed");
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !designation.trim()) return;
    if (password.trim().length < 8) { toast.error("Set a password of at least 8 characters."); return; }

    if (isCodeSent && !isVerified) {
      toast.error("Please verify your 6-digit email code before completing registration.");
      return;
    }

    const finalEmail =
      email.trim() ||
      `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@smarterp.biz`;

    const payload: CreateEmployeePayload = {
      name: name.trim(),
      designation: designation.trim(),
      department,
      email: finalEmail,
      phone: phone.trim() || "01712000000",
      gender,
      blood_group: bloodGroup,
      basic_salary: Number(basicSalary),
      joining_date: joiningDate,
      present_address: presentAddress.trim() || "Dhaka, Bangladesh",
      bank_name: bankName,
      bank_account_no: bankAccountNo.trim(),
      password: password.trim(),
      verification_code: isVerified ? verificationCode.trim() : undefined,
      is_verified: isVerified,
    };

    onSubmit(payload);
  };

  const parsedSalary = Number(basicSalary) || 0;
  const estimatedGross = parsedSalary * 1.6 + 4000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 sm:p-8 shadow-2xl border-2 border-slate-300 relative my-4 sm:my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-2 pr-8">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30 shrink-0">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <Title level={2} className="text-lg sm:text-xl font-black text-gray-700">
              Register New Employee
            </Title>
            <Subtitle className="text-xs text-slate-700 font-medium">
              Create an official profile, auto-calculate BLA salary slabs, and issue staff ID
            </Subtitle>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-xs">
          {/* Section: Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Full Name"
              placeholder="e.g. Md. Tariqul Islam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Designation / Job Title"
              placeholder="e.g. Senior Area Sales Manager"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
            />

            <div>
              <Label required>Department</Label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full mt-1.5 px-3 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Verification Box */}
            <div className="sm:col-span-2 p-3 bg-slate-50 border-2 border-slate-300 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Mail className="h-4 w-4 text-blue-600" />
                  Corporate / Personal Email &amp; Verification
                </Label>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Email Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500">
                    Verify via 6-Digit Code
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="e.g. tariqul@smarterp.biz"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    disabled={isVerified}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-slate-900 disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>
                {!isVerified ? (
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {isSendingCode ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : isCodeSent ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Resend Code</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Send Code</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsVerified(false);
                      setIsCodeSent(false);
                      setVerificationCode("");
                      setDevCodePreview(null);
                    }}
                    className="px-3 py-2 bg-white border-2 border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Change Email
                  </button>
                )}
              </div>

              {/* Dev Code Quick Fill Callout */}
              {devCodePreview && !isVerified && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-[11px] text-blue-900 font-bold">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>Test OTP: <strong className="font-mono text-xs text-blue-700 tracking-wider">{devCodePreview}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVerificationCode(devCodePreview)}
                    className="text-blue-700 underline text-[10px] font-black cursor-pointer hover:text-blue-900"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {/* Verification Code Input Section */}
              {isCodeSent && !isVerified && (
                <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit verification code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-mono font-bold tracking-widest text-slate-900 placeholder:text-slate-500 placeholder:font-sans placeholder:tracking-normal focus:outline-none focus:border-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isVerifyingCode || !verificationCode.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {isVerifyingCode ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Verify Code</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {verificationError && (
                <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {verificationError}
                </p>
              )}
            </div>

            <Input
              label="Mobile Number"
              type="tel"
              placeholder="e.g. 01712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Gender</Label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "Male" | "Female")}
                  className="w-full mt-1.5 px-3 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <Label>Blood Group</Label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Portal & Mobile Punch Login Password"
                type="text"
                placeholder="Set a password of at least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                Every employee is registered as a user. They can log in using their Employee ID or email with this password.
              </p>
            </div>
          </div>

          {/* Section: Compensation & Bank Details */}
          <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-950 flex items-center gap-1.5">
                <Banknote className="h-4 w-4 text-emerald-700" />
                BLA 2006 Compensation & Payroll
              </span>
              <span className="text-[11px] font-bold text-slate-700">
                Est. Gross: ৳{estimatedGross.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Basic Salary (৳)"
                type="number"
                placeholder="45000"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
                required
              />

              <Input
                label="Joining Date"
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                required
              />

              <div>
                <Label>Salary Bank</Label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  <option value="Eastern Bank PLC">Eastern Bank PLC</option>
                  <option value="Dutch-Bangla Bank">Dutch-Bangla Bank</option>
                  <option value="BRAC Bank PLC">BRAC Bank PLC</option>
                  <option value="City Bank Ltd.">City Bank Ltd.</option>
                  <option value="Islami Bank Bangladesh">Islami Bank Bangladesh</option>
                </select>
              </div>
            </div>

            <Input
              label="Bank Account / Routing Number"
              placeholder="e.g. 1081250987621 (Banani Branch)"
              value={bankAccountNo}
              onChange={(e) => setBankAccountNo(e.target.value)}
            />
          </div>

          <Input
            label="Present Address"
            placeholder="e.g. House 24, Road 7, Sector 3, Uttara, Dhaka"
            value={presentAddress}
            onChange={(e) => setPresentAddress(e.target.value)}
          />

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-300">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-300 font-bold text-slate-800 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 shadow-md shadow-blue-600/30 w-full sm:w-auto"
            >
              {isLoading ? "Enrolling..." : "Enroll & Issue ID"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
