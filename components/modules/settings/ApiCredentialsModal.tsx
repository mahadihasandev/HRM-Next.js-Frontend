"use client";

import { API_BASE_URL } from "@/lib/api/config";
import { requestHrm } from "@/lib/api/request";

import React, { useState } from "react";
import {
  KeyRound,
  RefreshCw,
  Copy,
  Check,
  X,
  ShieldCheck,
} from "lucide-react";
import { Title, Subtitle, Button, Badge, Input, Banner, Label } from "@/components/shared";

interface ApiCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeToken: string;
  onUpdateToken: (token: string) => void;
}

export function ApiCredentialsModal({
  isOpen,
  onClose,
  activeToken,
  onUpdateToken,
}: ApiCredentialsModalProps) {
  const [tokenInput, setTokenInput] = useState(
    activeToken || ""
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiUrl, setApiUrl] = useState(`${API_BASE_URL}`);

  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    variant: "success" | "danger" | "warning";
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTestLogin = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Test local Laravel or remote API login
      const response = await requestHrm(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(apiKey ? { "hrm-api-key": apiKey } : {}),
        },
        body: JSON.stringify({ email: username, password }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status && data.token) {
        onUpdateToken(data.token);
        setTokenInput(data.token);
        setTestResult({
          variant: "success",
          message: `Authenticated successfully! Issued Token: ${data.token.slice(0, 15)}... (Employee ID: ${data.employee_full_id || username})`,
        });
      } else {
        setTestResult({
          variant: "warning",
          message: data.message || "Connected to server, but authentication was not granted.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to reach API server. Check URL, network, and CORS configuration.";
      setTestResult({
        variant: "danger",
        message: `Connection failed: ${msg}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(tokenInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 sm:p-8 shadow-2xl border-2 border-slate-300 relative my-4 sm:my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-500 hover:text-slate-950 hover:bg-slate-100 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-1">
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <Title level={2} className="text-xl font-bold text-gray-700">
              API Connection & Credentials
            </Title>
            <Subtitle className="text-xs text-slate-700 font-medium">
              Configure backend endpoints, tokens & authentication
            </Subtitle>
          </div>
        </div>

        <div className="space-y-4 pt-4 text-xs">
          {/* Active Connection Status */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-100/60 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Token-Based Authentication</p>
                <p className="text-[11px] text-slate-500">
                  Headers: Authorization: Bearer &bull; hrm-api-key
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Ready
            </Badge>
          </div>

          <div className="space-y-3">
            <Input
              label="API Base URL (Local or Remote)"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              helperText="Local Laravel server (http://localhost:8000/api/v1) or remote URL"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Username / Employee ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Input
              label="HRM API Key (Header: hrm-api-key)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />

            <div>
              <div className="flex justify-between items-center mb-1">
                <Label>Active Bearer Token</Label>
                <button
                  type="button"
                  onClick={copyToken}
                  className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <textarea
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value);
                  onUpdateToken(e.target.value);
                }}
                className="w-full h-16 rounded-lg border-2 border-slate-300 bg-white p-2.5 font-mono text-[11px] font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {testResult && (
            <Banner
              variant={testResult.variant}
              title={testResult.variant === "success" ? "Connection Verified" : testResult.variant === "danger" ? "Connection Error" : "Authentication Notice"}
              description={testResult.message}
              isDismissible
              onClose={() => setTestResult(null)}
            />
          )}

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTestLogin}
              isLoading={isLoading}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              className="w-full sm:w-auto"
            >
              Test Connection & Login
            </Button>
            <Button size="sm" onClick={onClose} className="w-full sm:w-auto">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
