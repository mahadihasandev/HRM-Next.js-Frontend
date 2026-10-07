"use client";

import { API_BASE_URL } from "@/lib/api/config";

import React, { useState } from "react";
import {
  Building2,
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Laptop,
  UserPlus,
  Send,
  RefreshCw,
  Loader2,
  KeyRound,
  User,
  Briefcase,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/store/hooks";
import { setUser, AuthUser } from "@/store/authSlice";
import { PERSONA_PRESETS } from "@/components/layout/TopNavbar";

interface LoginViewProps {
  onLoginSuccess?: (user: AuthUser, token: string) => void;
}

const DEPARTMENTS = [
  "Engineering",
  "Sales & Distribution",
  "Human Resources",
  "Finance & Accounts",
  "Operations",
  "Product Design",
  "Supply Chain",
  "Legal & Compliance",
];

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const dispatch = useAppDispatch();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Sign In State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Register State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regDepartment, setRegDepartment] = useState("Engineering");
  const [regDesignation, setRegDesignation] = useState("Software Engineer");
  const [regPhone, setRegPhone] = useState("");
  const [regCode, setRegCode] = useState("");
  const [regIsCodeSent, setRegIsCodeSent] = useState(false);
  const [regIsVerified, setRegIsVerified] = useState(false);
  const [regDevCode, setRegDevCode] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handlePersonaSelect = (persona: typeof PERSONA_PRESETS[0]) => {
    setIdentifier(persona.fullId);
    setPassword("password123");
    setErrorMessage(null);
  };

  const handleSendVerificationCode = async () => {
    if (!regEmail.trim()) {
      setErrorMessage("Please enter your email address to receive a verification code.");
      return;
    }
    setErrorMessage(null);
    setIsSendingCode(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-verification-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: regEmail.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.status) {
        setRegIsCodeSent(true);
        setRegIsVerified(false);
        if (data.dev_code) {
          setRegDevCode(data.dev_code);
          toast.success(`Verification code sent! Test Code: ${data.dev_code}`, { duration: 6000 });
        } else {
          toast.success("Verification code sent to your email inbox!");
        }
      } else {
        setErrorMessage(data?.message || "Failed to dispatch verification code.");
      }
    } catch {
      setErrorMessage("Network error: Could not reach verification server.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!regCode.trim()) {
      setErrorMessage("Please enter the 6-digit code.");
      return;
    }
    setErrorMessage(null);
    setIsVerifyingCode(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: regEmail.trim(), code: regCode.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.status && data.verified) {
        setRegIsVerified(true);
        toast.success("Email verified successfully! ✓");
      } else {
        setErrorMessage(data?.message || "Invalid or expired verification code.");
      }
    } catch {
      setErrorMessage("Network error: Could not verify code.");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage("Full Name, Corporate/Personal Email, and Password are required.");
      return;
    }
    if (!regCode.trim()) {
      setErrorMessage("Please request and enter your 6-digit email verification code.");
      return;
    }

    setIsRegistering(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword.trim(),
          code: regCode.trim(),
          department: regDepartment,
          designation: regDesignation.trim() || "Staff Associate",
          phone: regPhone.trim() || "01712000000",
        }),
      });

      const data = await res.json();
      if (res.ok && data.status) {
        toast.success(`Account registered! Welcome to Smart ERP, ${data.name}.`);
        const authenticatedUser: AuthUser = {
          id: data.user_id || data.employee_id || 100,
          fullId: data.employee_full_id || "SMT-0100",
          name: data.name || regName,
          email: data.email || regEmail,
          department: data.department || regDepartment,
          phone_number: data.phone_number || regPhone || "01712000000",
          role: "employee",
        };
        const token = data.token;
        dispatch(setUser({ user: authenticatedUser, token }));
        if (onLoginSuccess) {
          onLoginSuccess(authenticatedUser, token);
        }
      } else {
        setErrorMessage(data?.message || "Registration failed. Please check your verification code.");
      }
    } catch {
      setErrorMessage("Server error during registration. Ensure backend is running.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage("Please enter both Employee ID/Email and Password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const apiEmail =
      identifier.trim() === "SMT-0001" || identifier.trim().toLowerCase() === "admin"
        ? "admin@smart.com"
        : identifier.trim();

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: apiEmail,
          password: password.trim(),
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const matchedPreset = PERSONA_PRESETS.find(
          (p) => p.fullId.toLowerCase() === identifier.trim().toLowerCase()
        );

        const authenticatedUser: AuthUser = {
          id: json.user_id || json.employee_id || 100,
          fullId:
            identifier.trim() === "admin@smart.com"
              ? "SMT-0001"
              : json.employee_full_id || identifier.trim(),
          name:
            json.employee_name ||
            json.name ||
            matchedPreset?.name ||
            (identifier.startsWith("SMT") ? `Employee (${identifier})` : "System Administrator"),
          email:
            json.email ||
            (identifier.includes("@")
              ? identifier
              : `${identifier.toLowerCase()}@smarterp.biz`),
          department:
            json.department ||
            matchedPreset?.department ||
            "Corporate Operations",
          phone_number: json.phone_number || "01716121559",
          role:
            json.employee_full_id === "SMT-0001" ||
            identifier === "SMT-0001" ||
            identifier === "admin@smart.com" ||
            identifier === "SMT-0026"
              ? "admin"
              : "employee",
        };

        const token = json.token;
        if (!token) {
          setErrorMessage("Authentication failed: No valid token issued by server.");
          setIsLoading(false);
          return;
        }
        dispatch(setUser({ user: authenticatedUser, token }));
        if (onLoginSuccess) {
          onLoginSuccess(authenticatedUser, token);
        }
        setIsLoading(false);
        return;
      } else {
        const errData = await response.json().catch(() => null);
        setErrorMessage(errData?.message || "Invalid credentials provided. Please check your username and password.");
        setIsLoading(false);
        return;
      }
    } catch {
      setErrorMessage("Unable to connect to authentication server. Please ensure the backend is running at http://127.0.0.1:8000.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between text-slate-900">
      {/* Top Corporate Status Header */}
      <header className="h-16 border-b border-slate-300 px-3 sm:px-12 flex items-center justify-between bg-white sticky top-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-extrabold text-slate-950 tracking-tight leading-none truncate">
              SMART TECHNOLOGIES (BD) LTD.
            </h1>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 leading-none mt-0.5 truncate">
              Smart HRM &amp; Enterprise ERP &bull; Corporate Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 px-3 py-1.5 rounded-xl shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>ZKTeco BioSync: Active</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
            <span>BLA 2006 Compliant</span>
          </div>
        </div>
      </header>

      {/* Main Login Canvas - Pure White Executive Spectrum */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-8 bg-slate-50/60">
        <div className={`w-full ${authMode === "register" ? "max-w-lg" : "max-w-md"} bg-white border-2 border-slate-300 rounded-2xl shadow-xl shadow-slate-200/80 p-5 sm:p-8 transition-all`}>
          
          {/* Auth Mode Toggle Pill */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6 border border-slate-300">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                authMode === "login"
                  ? "bg-white text-slate-950 shadow-xs border border-slate-300"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === "register"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Register User</span>
            </button>
          </div>

          {/* Header Title & Badges */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold mb-2 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              {authMode === "login" ? "Corporate Single Sign-On (SSO)" : "Email Code Verification Required"}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-700 tracking-tight">
              {authMode === "login" ? "Sign In to Your Workspace" : "Create New User Account"}
            </h2>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              {authMode === "login"
                ? "Enter your corporate credentials to access HR & Operations"
                : "Verify your email with a 6-digit code to activate your account"}
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-5 p-3 bg-rose-50 border-2 border-rose-300 rounded-xl flex items-start gap-2.5 text-rose-950 text-xs font-bold animate-in fade-in">
              <AlertCircle className="h-4 w-4 text-rose-700 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {authMode === "login" ? (
            /* --- SIGN IN FORM --- */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5"
                >
                  Employee ID / Corporate Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4 text-slate-700" />
                  </div>
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. SMT-0001 or admin@smart.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white text-slate-950 border-2 border-slate-300 rounded-xl placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950 shadow-2xs transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4 text-slate-700" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your security password"
                    className="w-full pl-10 pr-11 py-2.5 text-sm font-bold bg-white text-slate-950 border-2 border-slate-300 rounded-xl placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950 shadow-2xs transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-600 hover:text-slate-950 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-2 border-slate-400 text-slate-950 focus:ring-slate-950 bg-white"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Remember this workstation
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-slate-950 hover:bg-slate-850 text-white font-black text-sm rounded-xl shadow-md shadow-slate-950/20 flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to ERP Portal</span>
                    <ArrowRight className="h-4 w-4 text-emerald-400" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* --- USER REGISTRATION WITH EMAIL CODE FORM --- */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4 text-slate-700" />
                  </div>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Md. Tariqul Islam"
                    className="w-full pl-9 pr-3 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-slate-950"
                    required
                  />
                </div>
              </div>

              {/* Email & Code Verification Section */}
              <div className="p-3 bg-slate-50 border-2 border-slate-300 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                    Email &amp; 6-Digit Code <span className="text-rose-600">*</span>
                  </label>
                  {regIsVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500">
                      Verification Required
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="h-4 w-4 text-slate-700" />
                    </div>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        if (regIsVerified || regIsCodeSent) {
                          setRegIsVerified(false);
                          setRegIsCodeSent(false);
                          setRegCode("");
                          setRegDevCode(null);
                        }
                      }}
                      disabled={regIsVerified}
                      placeholder="e.g. tariqul@smarterp.biz"
                      className="w-full pl-9 pr-3 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-slate-950 disabled:bg-slate-100 disabled:text-slate-600"
                      required
                    />
                  </div>
                  {!regIsVerified ? (
                    <button
                      type="button"
                      onClick={handleSendVerificationCode}
                      disabled={isSendingCode || !regEmail.trim()}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {isSendingCode ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : regIsCodeSent ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Resend</span>
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
                        setRegIsVerified(false);
                        setRegIsCodeSent(false);
                        setRegCode("");
                        setRegDevCode(null);
                      }}
                      className="px-3 py-2 bg-white border-2 border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
                    >
                      Change
                    </button>
                  )}
                </div>

                {/* Dev Code Callout */}
                {regDevCode && !regIsVerified && (
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-[11px] text-blue-900 font-bold">
                    <div className="flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-blue-600" />
                      <span>OTP Code: <strong className="font-mono text-xs text-blue-700 tracking-wider">{regDevCode}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRegCode(regDevCode)}
                      className="text-blue-700 underline text-[10px] font-black hover:text-blue-900 cursor-pointer"
                    >
                      Fill Code
                    </button>
                  </div>
                )}

                {/* OTP Code Input Box */}
                {regIsCodeSent && !regIsVerified && (
                  <div className="pt-1.5 border-t border-slate-200 flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      value={regCode}
                      onChange={(e) => setRegCode(e.target.value.replace(/[^0-9]/g, ""))}
                      className="flex-1 px-3 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-mono font-bold tracking-widest text-slate-900 placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-500 focus:outline-none focus:border-slate-950"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={isVerifyingCode || !regCode.trim()}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {isVerifyingCode ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Verify</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Create Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4 text-slate-700" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-10 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-slate-950"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 hover:text-slate-950"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Department & Designation */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Department
                  </label>
                  <select
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-950"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    placeholder="Job Title"
                    className="w-full px-2.5 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-slate-950"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-4 w-4 text-slate-700" />
                  </div>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. 01712000000"
                    className="w-full pl-9 pr-3 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-slate-950"
                  />
                </div>
              </div>

              {/* Submit Registration Button */}
              <button
                type="submit"
                disabled={isRegistering || !regCode.trim()}
                className="w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Activating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Verify &amp; Create Account</span>
                    <ArrowRight className="h-4 w-4 text-white" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Persona Demo Selector (shown only on Sign In) */}
          {authMode === "login" && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  1-Click Persona Previews
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  Fast Sign-In
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PERSONA_PRESETS.map((p) => {
                  const isSelected = identifier === p.fullId;
                  return (
                    <button
                      key={p.fullId}
                      type="button"
                      onClick={() => handlePersonaSelect(p)}
                      className={`text-left p-2.5 rounded-xl border-2 transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                          : "bg-white border-slate-300 text-slate-900 hover:border-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-extrabold truncate ${
                            isSelected ? "text-white" : "text-slate-950"
                          }`}
                        >
                          {p.name}
                        </p>
                        <p
                          className={`text-[10px] font-mono font-semibold ${
                            isSelected ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          {p.fullId} &bull; {p.department}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Corporate Footer */}
      <footer className="h-12 border-t border-slate-300 px-6 sm:px-12 flex items-center justify-between text-xs font-semibold text-slate-700 bg-white">
        <div className="flex items-center gap-2">
          <span>&copy; 2026 Smart Technologies (BD) Ltd. All Rights Reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-800 font-bold">
            <Clock className="h-3.5 w-3.5 text-slate-700" />
            Biometric Sync Ready
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-800 font-bold">
            <Laptop className="h-3.5 w-3.5 text-slate-700" />
            Enterprise Edition v3.4
          </span>
        </div>
      </footer>
    </div>
  );
}
