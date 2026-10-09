"use client";

import { requestHrm } from "@/lib/api/request";

import { API_BASE_URL } from "@/lib/api/config";

import React, { useState } from "react";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Send,
  RefreshCw,
  Loader2,
  KeyRound,
  User,
  Briefcase,
  Phone,
  Factory,
} from "lucide-react";
import toast from "react-hot-toast";
import { BrandMark, Text, Title } from "@/components/shared";
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

  const handlePersonaSelect = (persona: (typeof PERSONA_PRESETS)[0]) => {
    setIdentifier(persona.fullId);
    setPassword("password123");
    setErrorMessage(null);
  };

  const handleSendVerificationCode = async () => {
    if (!regEmail.trim()) {
      setErrorMessage(
        "Please enter your email address to receive a verification code.",
      );
      return;
    }
    setErrorMessage(null);
    setIsSendingCode(true);
    try {
      const res = await requestHrm(`${API_BASE_URL}/auth/send-verification-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: regEmail.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.status) {
        setRegIsCodeSent(true);
        setRegIsVerified(false);
        if (data.dev_code) {
          setRegDevCode(data.dev_code);
          toast.success(`Verification code sent! Test Code: ${data.dev_code}`, {
            duration: 6000,
          });
        } else {
          toast.success("Verification code sent to your email inbox!");
        }
      } else {
        setErrorMessage(
          data?.message || "Failed to dispatch verification code.",
        );
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
      const res = await requestHrm(`${API_BASE_URL}/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: regEmail.trim(), code: regCode.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.status && data.verified) {
        setRegIsVerified(true);
        toast.success("Email verified successfully! ✓");
      } else {
        setErrorMessage(
          data?.message || "Invalid or expired verification code.",
        );
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
      setErrorMessage(
        "Full Name, Corporate/Personal Email, and Password are required.",
      );
      return;
    }
    if (!regCode.trim()) {
      setErrorMessage(
        "Please request and enter your 6-digit email verification code.",
      );
      return;
    }

    setIsRegistering(true);
    setErrorMessage(null);

    try {
      const res = await requestHrm(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
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
        toast.success(
          `Account registered! Welcome to Smart ERP, ${data.name}.`,
        );
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
        dispatch(setUser({ user: authenticatedUser, token, rememberMe }));
        if (onLoginSuccess) {
          onLoginSuccess(authenticatedUser, token);
        }
      } else {
        setErrorMessage(
          data?.message ||
            "Registration failed. Please check your verification code.",
        );
      }
    } catch {
      setErrorMessage(
        "Server error during registration. Ensure backend is running.",
      );
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
      identifier.trim() === "SMT-0001" ||
      identifier.trim().toLowerCase() === "admin"
        ? "admin@smart.com"
        : identifier.trim();

    try {
      const response = await requestHrm(`${API_BASE_URL}/login`, {
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
          (p) => p.fullId.toLowerCase() === identifier.trim().toLowerCase(),
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
            (identifier.startsWith("SMT")
              ? `Employee (${identifier})`
              : "System Administrator"),
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
          setErrorMessage(
            "Authentication failed: No valid token issued by server.",
          );
          setIsLoading(false);
          return;
        }
        dispatch(setUser({ user: authenticatedUser, token, rememberMe }));
        if (onLoginSuccess) {
          onLoginSuccess(authenticatedUser, token);
        }
        setIsLoading(false);
        return;
      } else {
        const errData = await response.json().catch(() => null);
        setErrorMessage(
          errData?.message ||
            "Invalid credentials provided. Please check your username and password.",
        );
        setIsLoading(false);
        return;
      }
    } catch {
      setErrorMessage(
        "Could not reach the sign-in service. Please check your connection and try again.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[1fr_1.05fr]">
      <section className="relative hidden min-h-dvh flex-col overflow-hidden bg-[#123f40] p-12 text-white lg:flex xl:p-16">
        <div className="relative flex items-center gap-3">
          <BrandMark className="!bg-white/10" />
          <Text className="!text-xl !font-semibold !text-white">
            Smart HRM<span className="text-teal-300">.</span>
          </Text>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-44 size-[640px] rounded-full border-[80px] border-white/[.025]"
        />
        <div className="relative my-auto py-14">
          <Text
            variant="caption"
            className="!text-[11px] !font-medium !tracking-[.18em] !text-teal-200/80"
          >
            BUILT AROUND YOUR PEOPLE
          </Text>
          <Title
            level={1}
            className="mt-5 max-w-md !text-[44px] !font-medium !leading-[1.15] !tracking-tight !text-white xl:!text-[52px]"
          >
            A better workday
            <br />
            starts here<span className="text-teal-300">.</span>
          </Title>
          <Text className="mt-6 max-w-sm !text-sm !leading-7 !text-teal-100/75">
            Bring your people, payroll and factory operations together. Less
            paperwork. More time for what matters.
          </Text>
          <div className="mt-12 max-w-md rounded-2xl border border-white/10 bg-white/[.04] p-5">
            <div className="flex items-center justify-between">
              <Text className="!text-xs !font-medium !text-white">
                One connected workspace
              </Text>
              <span className="flex size-7 items-center justify-center rounded-full bg-teal-300/10">
                <CheckCircle2 className="size-4 text-teal-200" />
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {[
                {
                  icon: User,
                  title: "People & attendance",
                  detail: "Every employee, every workday",
                },
                {
                  icon: Briefcase,
                  title: "Payroll & bank documents",
                  detail: "Prepare, review and approve",
                },
                {
                  icon: Factory,
                  title: "Factory operations",
                  detail: "From production lines to floor actions",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-xl bg-white/[.04] p-3"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-teal-300/10 text-teal-200">
                    <item.icon className="size-4" />
                  </span>
                  <div>
                    <Text className="!text-xs !font-medium !text-white">
                      {item.title}
                    </Text>
                    <Text
                      variant="caption"
                      className="mt-1 !text-[10px] !text-teal-100/60"
                    >
                      {item.detail}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Text
          variant="caption"
          className="relative !text-[11px] !text-teal-100/50"
        >
          People & factory operations · Smart HRM
        </Text>
      </section>
      <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-10 sm:px-12">
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <BrandMark />
          <Text className="!text-xl !font-semibold">
            Smart HRM<span className="text-teal-700">.</span>
          </Text>
        </div>
        <div
          className={`w-full ${authMode === "register" ? "max-w-lg" : "max-w-[400px]"}`}
        >
          <div className="mb-8 flex gap-6 border-b border-slate-200">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setErrorMessage(null);
              }}
              className={`pb-3 text-sm font-medium border-b-2 ${authMode === "login" ? "border-teal-700 text-teal-800" : "border-transparent text-slate-400 hover:text-slate-600"}`}
            >
              Sign in
            </button>

          </div>
          <div className="mb-8">
            <Title
              level={1}
              className="!text-[28px] !font-semibold !tracking-tight !text-gray-600"
            >
              {authMode === "login"
                ? "Welcome to your workspace"
                : "Create your account"}
            </Title>
            <Text className="mt-3 !text-sm !text-slate-500">
              {authMode === "login"
                ? "Sign in to manage your workday, people and operations."
                : "Verify your email to get started with Smart HRM."}
            </Text>
          </div>
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-relaxed text-rose-700"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {errorMessage}
            </div>
          )}
          {authMode === "login" ? (
            /* --- SIGN IN FORM --- */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-xs font-medium text-slate-600 mb-2"
                >
                  Employee ID or email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4 text-slate-700" />
                  </div>
                  <input
                    id="identifier"
                    autoComplete="username"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Your employee ID or email address"
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-medium bg-white text-slate-950 border border-slate-200 rounded-xl placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/10 shadow-2xs transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-600 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4 text-slate-700" />
                  </div>
                  <input
                    id="password"
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-2.5 text-sm font-medium bg-white text-slate-950 border border-slate-200 rounded-xl placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/10 shadow-2xs transition-colors"
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
                    className="h-4 w-4 rounded border-2 border-slate-400 text-slate-950 focus:ring-teal-600/10 bg-white"
                  />
                  <span className="text-xs font-medium text-slate-800">
                    Remember me
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to workspace</span>
                    <ArrowRight className="h-4 w-4 text-emerald-400" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* --- USER REGISTRATION WITH EMAIL CODE FORM --- */
            <form
              onSubmit={handleRegisterSubmit}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label
                  htmlFor="register-name"
                  className="block text-xs font-medium text-slate-800 mb-1"
                >
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4 text-slate-700" />
                  </div>
                  <input
                    type="text"
                    id="register-name"
                    autoComplete="name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Md. Tariqul Islam"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-teal-600"
                    required
                  />
                </div>
              </div>

              {/* Email & Code Verification Section */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="register-email" className="block text-xs font-medium text-slate-800">
                    Email &amp; 6-Digit Code{" "}
                    <span className="text-rose-600">*</span>
                  </label>
                  {regIsVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-500">
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
                      id="register-email"
                      autoComplete="email"
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
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-teal-600 disabled:bg-slate-100 disabled:text-slate-600"
                      required
                    />
                  </div>
                  {!regIsVerified ? (
                    <button
                      type="button"
                      onClick={handleSendVerificationCode}
                      disabled={isSendingCode || !regEmail.trim()}
                      className="px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
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
                      className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-100 cursor-pointer"
                    >
                      Change
                    </button>
                  )}
                </div>

                {/* Dev Code Callout */}
                {regDevCode && !regIsVerified && (
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-[11px] text-blue-900 font-medium">
                    <div className="flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-blue-600" />
                      <span>
                        OTP Code:{" "}
                        <strong className="font-mono text-xs text-blue-700 tracking-wider">
                          {regDevCode}
                        </strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRegCode(regDevCode)}
                      className="text-blue-700 underline text-[10px] font-semibold hover:text-blue-900 cursor-pointer"
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
                      aria-label="Email verification code"
                      autoComplete="one-time-code"
                      placeholder="Enter 6-digit code"
                      value={regCode}
                      onChange={(e) =>
                        setRegCode(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium tracking-widest text-slate-900 placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-500 focus:outline-none focus:border-teal-600"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={isVerifyingCode || !regCode.trim()}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
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
                <label
                  htmlFor="register-password"
                  className="block text-xs font-medium text-slate-800 mb-1"
                >
                  Create Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4 text-slate-700" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="register-password"
                    autoComplete="new-password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-teal-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-600 hover:text-slate-950"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Department & Designation */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="register-department"
                    className="block text-xs font-medium text-slate-800 mb-1"
                  >
                    Department
                  </label>
                  <select
                    id="register-department"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="register-designation"
                    className="block text-xs font-medium text-slate-800 mb-1"
                  >
                    Designation
                  </label>
                  <input
                    type="text"
                    id="register-designation"
                    autoComplete="organization-title"
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    placeholder="Job Title"
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label
                  htmlFor="register-phone"
                  className="block text-xs font-medium text-slate-800 mb-1"
                >
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-4 w-4 text-slate-700" />
                  </div>
                  <input
                    type="tel"
                    id="register-phone"
                    autoComplete="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. 01712000000"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Submit Registration Button */}
              <button
                type="submit"
                disabled={isRegistering || !regCode.trim()}
                className="w-full h-11 mt-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
          {authMode === "login" &&
            process.env.NEXT_PUBLIC_ENABLE_DEMO_PREVIEWS === "true" && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-800">
                    Preview accounts
                  </span>
                  <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    Demo mode
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
                          <Text
                            className={`text-xs font-semibold truncate ${
                              isSelected ? "text-white" : "text-slate-950"
                            }`}
                          >
                            {p.name}
                          </Text>
                          <Text
                            className={`text-[10px] font-mono font-semibold ${
                              isSelected ? "text-slate-300" : "text-slate-600"
                            }`}
                          >
                            {p.fullId} &bull; {p.department}
                          </Text>
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
          <Text
            variant="caption"
            className="mt-8 border-t border-slate-100 pt-5 !text-center !text-[11px] !text-slate-400"
          >
            Need access? Contact your HR administrator.
          </Text>
        </div>
      </main>

      <div className="sr-only" aria-hidden="true">
        Smart HRM workspace
      </div>
    </div>
  );
}
