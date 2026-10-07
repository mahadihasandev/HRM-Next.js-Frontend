"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Server,
  Radio,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Cpu,
  Fingerprint,
  Smile,
  CreditCard,
  Plus,
  Play,
  RotateCw,
} from "lucide-react";
import {
  Title,
  CardWrapper,
  Button,
  Badge,
  PageHeader,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/shared";
import toast from "react-hot-toast";

interface MachineDevice {
  id: number;
  name: string;
  ip: string;
  port: number;
  commKey: string;
  serialNumber: string;
  location: string;
  status: "Online" | "Offline";
  lastHeartbeat: string;
  totalLogsCaptured: number;
}

interface BiometricLog {
  id: number;
  punchTime: string;
  employeeFullId: string;
  employeeName: string;
  deviceName: string;
  deviceSerial: string;
  verifyMode: "Fingerprint" | "Face Recognition" | "RFID Card" | "Password";
  punchState: "Check-In" | "Check-Out" | "Break-In" | "Break-Out";
}

const INITIAL_DEVICES: MachineDevice[] = [
  {
    id: 1,
    name: "ZKTeco ProCapture-X (Main Gate)",
    ip: "192.168.10.201",
    port: 4370,
    commKey: "0",
    serialNumber: "ZK9912048821",
    location: "Tejgaon Commercial HQ - Gate 1",
    status: "Online",
    lastHeartbeat: "Just now (Live)",
    totalLogsCaptured: 84210,
  },
  {
    id: 2,
    name: "ZKTeco SpeedFace-V5L (Executive Floor)",
    ip: "192.168.10.202",
    port: 4370,
    commKey: "0",
    serialNumber: "ZK9938472911",
    location: "Level 4 - Management Suite",
    status: "Online",
    lastHeartbeat: "1 min ago",
    totalLogsCaptured: 42190,
  },
  {
    id: 3,
    name: "ZKTeco BioStation (Gazipur Central Depot)",
    ip: "10.0.12.55",
    port: 4370,
    commKey: "0",
    serialNumber: "ZK8829471900",
    location: "Depot Entrance & Dispatch Wing",
    status: "Online",
    lastHeartbeat: "3 mins ago",
    totalLogsCaptured: 27223,
  },
  {
    id: 4,
    name: "ZKTeco uFace 800 (Chittagong Depot)",
    ip: "10.0.24.18",
    port: 4370,
    commKey: "0",
    serialNumber: "ZK7748192033",
    location: "Agrabad Logistics Hub",
    status: "Offline",
    lastHeartbeat: "2 hours ago",
    totalLogsCaptured: 15820,
  },
];

const INITIAL_LOGS: BiometricLog[] = [
  {
    id: 1,
    punchTime: "2026-10-05 08:52:14",
    employeeFullId: "SMT-0051",
    employeeName: "Abdul Halim",
    deviceName: "ZKTeco ProCapture-X (Main Gate)",
    deviceSerial: "ZK9912048821",
    verifyMode: "Fingerprint",
    punchState: "Check-In",
  },
  {
    id: 2,
    punchTime: "2026-10-05 08:54:30",
    employeeFullId: "SMT-0001",
    employeeName: "Kazi Farhan Ahmed",
    deviceName: "ZKTeco SpeedFace-V5L (Executive Floor)",
    deviceSerial: "ZK9938472911",
    verifyMode: "Face Recognition",
    punchState: "Check-In",
  },
  {
    id: 3,
    punchTime: "2026-10-05 08:57:05",
    employeeFullId: "SMT-0052",
    employeeName: "Sayed Mahfuzur Rahman",
    deviceName: "ZKTeco SpeedFace-V5L (Executive Floor)",
    deviceSerial: "ZK9938472911",
    verifyMode: "Face Recognition",
    punchState: "Check-In",
  },
  {
    id: 4,
    punchTime: "2026-10-05 09:02:18",
    employeeFullId: "SMT-0053",
    employeeName: "Tanvir Hasan",
    deviceName: "ZKTeco ProCapture-X (Main Gate)",
    deviceSerial: "ZK9912048821",
    verifyMode: "RFID Card",
    punchState: "Check-In",
  },
  {
    id: 5,
    punchTime: "2026-10-05 09:05:40",
    employeeFullId: "SMT-0054",
    employeeName: "Rashid Al-Noor",
    deviceName: "ZKTeco ProCapture-X (Main Gate)",
    deviceSerial: "ZK9912048821",
    verifyMode: "Fingerprint",
    punchState: "Check-In",
  },
  {
    id: 6,
    punchTime: "2026-10-05 09:12:00",
    employeeFullId: "SMT-0055",
    employeeName: "Kamal Uddin",
    deviceName: "ZKTeco BioStation (Gazipur Central Depot)",
    deviceSerial: "ZK8829471900",
    verifyMode: "Fingerprint",
    punchState: "Check-In",
  },
];

export interface DeviceIntegrationViewProps {
  initialSubTab?: string;
}

export function DeviceIntegrationView({ initialSubTab }: DeviceIntegrationViewProps = {}) {
  const [openSections, setOpenSections] = useState<string[]>(
    initialSubTab ? [initialSubTab] : ["devices", "logs"]
  );


  const [devices, setDevices] = useState<MachineDevice[]>(INITIAL_DEVICES);
  const [logs, setLogs] = useState<BiometricLog[]>(INITIAL_LOGS);
  const [search, setSearch] = useState("");
  const [selectedDeviceFilter, setSelectedDeviceFilter] = useState("all");
  const [verifyModeFilter, setVerifyModeFilter] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);

  const totalLogsCount = devices.reduce((sum, d) => sum + d.totalLogsCaptured, 0);

  const handleSyncAllDevices = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("ADMS Cloud Push sync completed! All terminals refreshed.");
    }, 900);
  };

  const handlePingDevice = (ip: string) => {
    toast.success(`Ping test to ${ip} returned 12ms latency (Packet loss 0%)`);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      log.employeeFullId.toLowerCase().includes(search.toLowerCase()) ||
      log.deviceSerial.toLowerCase().includes(search.toLowerCase());
    const matchesDevice =
      selectedDeviceFilter === "all" || log.deviceName.includes(selectedDeviceFilter);
    const matchesMode =
      verifyModeFilter === "all" || log.verifyMode === verifyModeFilter;
    return matchesSearch && matchesDevice && matchesMode;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Biometric Machine Integration & Attendance Logs"
        subtitle="Manage networked ZKTeco & biometric terminals, ADMS Cloud push sync, and audit raw punch logs."
        badge={<Badge variant="success">ADMS Push Active</Badge>}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Connected Terminals</span>
            <Server className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{devices.length}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
            {devices.filter((d) => d.status === "Online").length} Online &bull; 1 Offline
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Total Logs Captured</span>
            <Radio className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {totalLogsCount.toLocaleString()}
          </p>
          <span className="text-[10px] text-blue-600 font-bold mt-1 inline-block">
            Synced with SQLite DB
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Push Protocol</span>
            <Cpu className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-lg font-black text-slate-900">ADMS / HTTP</p>
          <span className="text-[10px] text-purple-600 font-bold mt-1 inline-block">
            Port 4370 &bull; TLS 1.3
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Last ADMS Sync</span>
            <RefreshCw className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-sm font-black text-slate-900">Just Now</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
            Auto-Polling Every 60s
          </span>
        </div>
      </div>

      {/* Subcategory Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setOpenSections(["devices", "logs"])}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0",
            openSections.length > 1
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          )}
        >
          All Modules ({devices.length} Devices, {logs.length} Logs)
        </button>
        <button
          type="button"
          onClick={() => setOpenSections(["devices"])}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0",
            openSections.length === 1 && openSections.includes("devices")
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          )}
        >
          <Server className="h-3.5 w-3.5" />
          Networked Machine Devices ({devices.length})
        </button>
        <button
          type="button"
          onClick={() => setOpenSections(["logs"])}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0",
            openSections.length === 1 && openSections.includes("logs")
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          )}
        >
          <Radio className="h-3.5 w-3.5" />
          Biometric Punch Audit Logs ({logs.length})
        </button>
      </div>

      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={(val) => setOpenSections(Array.isArray(val) ? val : [val])}
      >
        {/* 1. Networked Machine Devices */}
        <AccordionItem value="devices">
          <AccordionTrigger
            icon={<Server className="h-5 w-5" />}
            subtitle="ZKTeco IP hardware, communication keys, heartbeat statuses & instant terminal sync"
            badge={<Badge variant="default">{devices.length} Terminals</Badge>}
          >
            Machine Devices & Hardware Terminals
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-700">
                  Live biometrics hardware communicating via ADMS Cloud Push protocol
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={isSyncing}
                    onClick={handleSyncAllDevices}
                    leftIcon={<RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    {isSyncing ? "Syncing..." : "Sync All Terminals Now"}
                  </Button>
                </div>
              </div>

              {/* Devices Table (Screenshot 12.21.24 PM reference) */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-3">SL</th>
                      <th className="py-3 px-3">Device Name</th>
                      <th className="py-3 px-3">IP Address</th>
                      <th className="py-3 px-3 text-center">Port</th>
                      <th className="py-3 px-3">Serial Number</th>
                      <th className="py-3 px-3">Location / Facility</th>
                      <th className="py-3 px-3 text-center">Logs</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-center">Diagnostics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {devices.map((d, idx) => (
                      <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{d.name}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{d.ip}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-700">{d.port}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{d.serialNumber}</td>
                        <td className="py-2.5 px-3 text-slate-700">{d.location}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                          {d.totalLogsCaptured.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-extrabold text-[10px] ${
                              d.status === "Online"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                d.status === "Online" ? "bg-emerald-600 animate-pulse" : "bg-rose-600"
                              }`}
                            />
                            {d.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handlePingDevice(d.ip)}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] cursor-pointer"
                          >
                            Ping Test
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Raw Attendance Punch Logs (Screenshot 12.21.43 PM, 12.21.50 PM, 12.22.00 PM reference) */}
        <AccordionItem value="logs">
          <AccordionTrigger
            icon={<Fingerprint className="h-5 w-5" />}
            subtitle="Raw biometric punch records, verify methods (Fingerprint, Face, Card), timestamps & states"
            badge={<Badge variant="default">{totalLogsCount.toLocaleString()} Total Records</Badge>}
          >
            Attendance Logs & Biometric Punch Audit
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, staff ID, serial..."
                    className="w-full bg-white text-slate-900 border-2 border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
                  <span className="text-xs font-bold text-slate-700">Verify Mode:</span>
                  <select
                    value={verifyModeFilter}
                    onChange={(e) => setVerifyModeFilter(e.target.value)}
                    className="bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none"
                  >
                    <option value="all">All Modes</option>
                    <option value="Fingerprint">Fingerprint</option>
                    <option value="Face Recognition">Face Recognition</option>
                    <option value="RFID Card">RFID Card</option>
                  </select>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success("Exporting attendance logs to Excel...")}
                    leftIcon={<FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />}
                    className="text-xs font-bold border-slate-300"
                  >
                    Export CSV
                  </Button>
                </div>
              </div>

              {/* Logs Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-3">SL</th>
                      <th className="py-3 px-3">Punch Timestamp</th>
                      <th className="py-3 px-3">Employee ID</th>
                      <th className="py-3 px-3">Employee Name</th>
                      <th className="py-3 px-3">Terminal Device</th>
                      <th className="py-3 px-3">Verify Method</th>
                      <th className="py-3 px-3 text-center">State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredLogs.map((log, idx) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {log.punchTime}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                          {log.employeeFullId}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{log.employeeName}</td>
                        <td className="py-2.5 px-3 text-slate-600">{log.deviceName}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-semibold text-[11px]">
                            {log.verifyMode === "Face Recognition" ? (
                              <Smile className="h-3.5 w-3.5 text-blue-600" />
                            ) : log.verifyMode === "RFID Card" ? (
                              <CreditCard className="h-3.5 w-3.5 text-purple-600" />
                            ) : (
                              <Fingerprint className="h-3.5 w-3.5 text-emerald-600" />
                            )}
                            {log.verifyMode}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                              log.punchState === "Check-In"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {log.punchState}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
