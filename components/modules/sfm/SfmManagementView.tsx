"use client";

import React, { useState } from "react";
import {
  Compass,
  Download,
  Target,
  AlertCircle,
  Layers,
  Calendar,
  CheckCircle2,
  UserPlus,
} from "lucide-react";
import {
  CardWrapper,
  Title,
  Subtitle,
  Badge,
  Button,
  Banner,
  EmptyState,
} from "@/components/shared";
import {
  useGetSfmTargetDashboardQuery,
  useGetTargetCommitmentsQuery,
  useUpdateTargetCommitmentMutation,
} from "@/store/services/sfm";

import { TargetCommitment } from "./types";
import { SfmMetrics } from "./SfmMetrics";
import { SfmCommitmentTable } from "./SfmCommitmentTable";
import { SfmUpdateModal } from "./SfmUpdateModal";
import { AddSrCommitmentModal } from "./AddSrCommitmentModal";

const INITIAL_COMMITMENTS: TargetCommitment[] = [
  {
    id: 5,
    employee_id: 479,
    employee_name: "Abdul Halim",
    code: "SMT-0051",
    territory: "Dhaka North - Mirpur Zone",
    month: "2026-10",
    target_value: 2500000,
    commitment_value: 2677000,
    actual_sales: 2180000,
    pcmo_commitment: 1275000,
    hddo_commitment: 1402000,
    details: [
      { detail_id: 14, commitment_value: 1275000 },
      { detail_id: 15, commitment_value: 1402000 },
    ],
  },
  {
    id: 6,
    employee_id: 480,
    employee_name: "Kamrul Hasan",
    code: "SMT-0052",
    territory: "Dhaka South - Tejgaon Zone",
    month: "2026-10",
    target_value: 2200000,
    commitment_value: 2200000,
    actual_sales: 1950000,
    pcmo_commitment: 1000000,
    hddo_commitment: 1200000,
    details: [
      { detail_id: 16, commitment_value: 1000000 },
      { detail_id: 17, commitment_value: 1200000 },
    ],
  },
  {
    id: 7,
    employee_id: 481,
    employee_name: "Zubair Hossain",
    code: "SMT-0053",
    territory: "Chittagong Metro",
    month: "2026-10",
    target_value: 3000000,
    commitment_value: 3100000,
    actual_sales: 2850000,
    pcmo_commitment: 1500000,
    hddo_commitment: 1600000,
    details: [
      { detail_id: 18, commitment_value: 1500000 },
      { detail_id: 19, commitment_value: 1600000 },
    ],
  },
  {
    id: 8,
    employee_id: 482,
    employee_name: "Monirul Islam",
    code: "SMT-0054",
    territory: "Rajshahi Regional Base",
    month: "2026-10",
    target_value: 1800000,
    commitment_value: 1800000,
    actual_sales: 1540000,
    pcmo_commitment: 850000,
    hddo_commitment: 950000,
    details: [
      { detail_id: 20, commitment_value: 850000 },
      { detail_id: 21, commitment_value: 950000 },
    ],
  },
];

const MOCK_SHOP_VISITS = [
  {
    date: "2026-10-02",
    time: "10:15 AM - 10:48 AM",
    sr: "Abdul Halim (SMT-0051)",
    shop: "CodeTap Distributors",
    thana: "Mirpur",
    duration: "33 mins",
    ordered: true,
    amount: "৳118,750",
  },
  {
    date: "2026-10-02",
    time: "11:10 AM - 11:32 AM",
    sr: "Abdul Halim (SMT-0051)",
    shop: "Padma Lubricants & Auto Center",
    thana: "Pallabi",
    duration: "22 mins",
    ordered: true,
    amount: "৳42,750",
  },
  {
    date: "2026-10-02",
    time: "12:00 PM - 12:12 PM",
    sr: "Abdul Halim (SMT-0051)",
    shop: "Bismillah Auto Parts",
    thana: "Mirpur-1",
    duration: "12 mins",
    ordered: false,
    reason: "Sufficient Inventory Available",
  },
];

interface FeedbackBanner {
  variant: "success" | "danger" | "warning";
  title: string;
  message: string;
}

export function SfmManagementView() {
  const [activeSubTab, setActiveSubTab] = useState<
    "targets" | "shop-visits" | "reasons" | "geography" | "attendance"
  >("targets");

  const [selectedMonth, setSelectedMonth] = useState("2026-10");
  const [localOverrides, setLocalOverrides] = useState<Record<number, Partial<TargetCommitment>>>({});
  const [editingCommitment, setEditingCommitment] = useState<TargetCommitment | null>(null);
  const [isAddSrOpen, setIsAddSrOpen] = useState(false);
  const [extraCommitments, setExtraCommitments] = useState<TargetCommitment[]>([]);
  const [feedback, setFeedback] = useState<FeedbackBanner | null>(null);

  // RTK Query Hooks
  const { data: sfmDashboardResp } = useGetSfmTargetDashboardQuery();
  const { data: apiCommitmentsResp } = useGetTargetCommitmentsQuery({ month: selectedMonth });
  const [updateCommitmentApi, { isLoading: isUpdating }] = useUpdateTargetCommitmentMutation();

  // Derive commitments from RTK Query data merged with local optimistic overrides
  const commitments: TargetCommitment[] = React.useMemo(() => {
    const baseList: TargetCommitment[] =
      apiCommitmentsResp?.data && apiCommitmentsResp.data.length > 0
        ? apiCommitmentsResp.data.map((c) => ({
            id: c.id,
            employee_id: c.employee_id,
            employee_name: c.employee_name,
            code: c.code,
            territory: c.territory,
            month: c.month,
            target_value: c.target_value,
            commitment_value: c.commitment_value,
            actual_sales: c.actual_sales,
            pcmo_commitment: c.details?.[0]?.commitment_value || Math.round(c.commitment_value * 0.48),
            hddo_commitment: c.details?.[1]?.commitment_value || Math.round(c.commitment_value * 0.52),
            details: c.details?.map((d) => ({
              detail_id: d.detail_id,
              commitment_value: d.commitment_value,
            })),
          }))
        : INITIAL_COMMITMENTS;

    const merged = baseList.map((item) => {
      const override = localOverrides[item.id];
      return override ? { ...item, ...override } : item;
    });

    return [...extraCommitments, ...merged];
  }, [apiCommitmentsResp, localOverrides, extraCommitments]);

  const handleAddSrCommitment = (newCommitment: TargetCommitment) => {
    setExtraCommitments((prev) => [newCommitment, ...prev]);
    setFeedback({
      variant: "success",
      title: "SR Target Quota Assigned",
      message: `Successfully allocated ৳${newCommitment.target_value.toLocaleString()} monthly quota to ${newCommitment.employee_name} (${newCommitment.code}).`,
    });
    setTimeout(() => setFeedback(null), 5000);
  };

  const dashboardData = sfmDashboardResp?.data;

  // Optimistic update handler with ROLLBACK on API failure
  const handleSaveCommitment = async (data: {
    id: number;
    commitmentValue: number;
    pcmoValue: number;
    hddoValue: number;
    details: { detail_id: number; commitment_value: number }[];
  }) => {
    const previousOverrides = { ...localOverrides };

    setLocalOverrides((prev) => ({
      ...prev,
      [data.id]: {
        commitment_value: data.commitmentValue,
        pcmo_commitment: data.pcmoValue,
        hddo_commitment: data.hddoValue,
        details: data.details,
      },
    }));
    setEditingCommitment(null);

    try {
      await updateCommitmentApi({
        id: data.id,
        details: data.details,
      }).unwrap();

      setFeedback({
        variant: "success",
        title: "Commitment Updated",
        message: `Target commitment of ৳${data.commitmentValue.toLocaleString()} has been synced with the database.`,
      });
    } catch (err: unknown) {
      // ROLLBACK on failure!
      setLocalOverrides(previousOverrides);
      const errMsg =
        err && typeof err === "object" && "data" in err && (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : err instanceof Error
          ? err.message
          : "Server failed to update commitment record";

      setFeedback({
        variant: "danger",
        title: "Update Failed (Rolled Back)",
        message: `Could not save commitment: ${errMsg}. Local state has been restored.`,
      });
    }

    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Compass className="h-5 w-5" />
            </div>
            <Title className="text-xl font-bold text-gray-700">
              SFM - Sales Force Management
            </Title>
            <Badge variant="default" className="bg-indigo-600 text-white font-medium">
              Geographic Intelligence
            </Badge>
          </div>
          <Subtitle className="text-slate-700 font-medium text-xs mt-1">
            Territory setup, target commitment tracking, outlet audit logs, and field force performance
          </Subtitle>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-white border-2 border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
          >
            <option value="2026-10">October 2026</option>
            <option value="2026-09">September 2026</option>
            <option value="2026-08">August 2026</option>
          </select>

          <Button
            size="sm"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          >
            <Download className="h-4 w-4" />
            <span>Job Card Batch PDF</span>
          </Button>
        </div>
      </div>

      {feedback && (
        <Banner
          variant={feedback.variant}
          title={feedback.title}
          description={feedback.message}
          isDismissible
          onClose={() => setFeedback(null)}
        />
      )}

      {/* KPI Cards */}
      <SfmMetrics
        totalAssignedTarget={dashboardData?.total_assigned_target}
        totalCommitmentValue={dashboardData?.total_commitment_value}
        achievedValueToDate={dashboardData?.achieved_value_to_date}
        achievementRate={dashboardData?.achievement_rate}
        totalFieldForce={dashboardData?.total_field_force}
      />

      {/* Subnavigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200/80 bg-white px-3 py-1.5 rounded-xl shadow-xs overflow-x-auto">
        {[
          { id: "targets", label: "Target Commitments", icon: Target },
          { id: "shop-visits", label: "Shop Visiting Reports", icon: Compass },
          { id: "reasons", label: "Non-Order Analytics", icon: AlertCircle },
          { id: "geography", label: "Geographic Hierarchy", icon: Layers },
          { id: "attendance", label: "Field Attendance & Job Cards", icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TARGET COMMITMENTS */}
      {activeSubTab === "targets" && (
        <CardWrapper
          title="Sales Officer Monthly Commitments"
          description="Evaluate individual PCMO and HDDO monthly commitments against corporate targets"
          headerAction={
            <Button
              size="sm"
              onClick={() => setIsAddSrOpen(true)}
              leftIcon={<UserPlus className="h-4 w-4" />}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Assign / Add SR Target
            </Button>
          }
        >
          <SfmCommitmentTable
            commitments={commitments}
            onEdit={(c) => setEditingCommitment(c)}
          />
        </CardWrapper>
      )}

      {/* TAB 2: SHOP VISITING REPORTS */}
      {activeSubTab === "shop-visits" && (
        <CardWrapper
          title="Daily Shop Visiting Logs & GPS Audit"
          description="Field audit records capturing check-in times, visit durations, and order generation"
          headerAction={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-slate-600 bg-slate-50">
                Avg Duration: 24.5 mins
              </Badge>
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                Coverage: 90.1%
              </Badge>
            </div>
          }
        >
          {MOCK_SHOP_VISITS.length === 0 ? (
            <EmptyState
              title="No shop visits recorded"
              description="Field visit records will appear here as officers log GPS check-ins."
            />
          ) : (
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Date / Time</th>
                    <th className="py-3 px-4">SR Officer</th>
                    <th className="py-3 px-4">Outlet Name</th>
                    <th className="py-3 px-4">Thana</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Order Status</th>
                    <th className="py-3 px-4 text-right">Amount / Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_SHOP_VISITS.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{row.date}</div>
                        <div className="text-[11px] text-slate-400">{row.time}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">{row.sr}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.shop}</td>
                      <td className="py-3 px-4 text-slate-600">{row.thana}</td>
                      <td className="py-3 px-4 text-slate-600">{row.duration}</td>
                      <td className="py-3 px-4">
                        {row.ordered ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            Order Booked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Non-Order Visit
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">
                        {row.ordered ? row.amount : row.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardWrapper>
      )}

      {/* TAB 3: NON-ORDER ANALYTICS */}
      {activeSubTab === "reasons" && (
        <CardWrapper
          title="Non-Productive Visit Reason Analysis"
          description="Identify market blockers and reasons why shop visits did not result in confirmed sales"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[
              { reason: "Sufficient Inventory in Stock", count: 42, pct: 45 },
              { reason: "Owner / Decision Maker Not Available", count: 24, pct: 26 },
              { reason: "Outstanding Due Payment Dispute", count: 14, pct: 15 },
              { reason: "Shop Closed / Temporary Relocation", count: 8, pct: 9 },
              { reason: "Competitor Promo Scheme Active", count: 5, pct: 5 },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>{item.reason}</span>
                  <span className="font-mono text-indigo-600">{item.count} Visits ({item.pct}%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardWrapper>
      )}

      {/* TAB 4: GEOGRAPHIC HIERARCHY */}
      {activeSubTab === "geography" && (
        <CardWrapper
          title="Geographical Territory & Depot Mapping"
          description="Hierarchical distribution tree: Regions &gt; Hubs &gt; Depots &gt; Thanas"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              { region: "Dhaka Metro", hubs: 2, depots: 4, coverage: "94.2%" },
              { region: "Chittagong Industrial", hubs: 1, depots: 3, coverage: "88.6%" },
              { region: "Rajshahi & North Bengal", hubs: 1, depots: 2, coverage: "81.0%" },
            ].map((geo, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{geo.region}</span>
                  <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                    {geo.coverage}
                  </Badge>
                </div>
                <div className="text-xs text-slate-500">
                  {geo.hubs} Regional Hubs &bull; {geo.depots} Active Depots
                </div>
              </div>
            ))}
          </div>
        </CardWrapper>
      )}

      {/* TAB 5: ATTENDANCE & JOB CARDS */}
      {activeSubTab === "attendance" && (
        <CardWrapper
          title="Field Attendance & Monthly Job Cards"
          description="GPS verified in/out timings, daily distance traveled, and attendance compliance"
        >
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Sales Representative</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Today In-Time</th>
                  <th className="py-3 px-4">First Punch Geo</th>
                  <th className="py-3 px-4">Outlets Visited</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: "Abdul Halim", code: "SMT-0051", inTime: "09:02 AM", geo: "Mirpur-10", visits: 8, status: "Present" },
                  { name: "Kamrul Hasan", code: "SMT-0052", inTime: "09:14 AM", geo: "Tejgaon", visits: 6, status: "Present" },
                  { name: "Zubair Hossain", code: "SMT-0053", inTime: "09:28 AM", geo: "Agrabad", visits: 7, status: "Present" },
                ].map((att, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{att.name}</p>
                      <p className="font-mono text-slate-400 text-[11px]">{att.code}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">Senior Territory Officer</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">{att.inTime}</td>
                    <td className="py-3 px-4 text-slate-600">{att.geo}</td>
                    <td className="py-3 px-4 font-bold text-indigo-700">{att.visits} Outlets</td>
                    <td className="py-3 px-4">
                      <Badge variant="success">{att.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardWrapper>
      )}

      {/* Edit Commitment Modal */}
      <SfmUpdateModal
        commitment={editingCommitment}
        isOpen={!!editingCommitment}
        onClose={() => setEditingCommitment(null)}
        onSave={handleSaveCommitment}
        isLoading={isUpdating}
      />

      {/* Assign / Add SR Target Modal */}
      <AddSrCommitmentModal
        isOpen={isAddSrOpen}
        onClose={() => setIsAddSrOpen(false)}
        onSubmit={handleAddSrCommitment}
      />
    </div>
  );
}
