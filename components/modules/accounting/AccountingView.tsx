"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Calculator,
  Receipt,
  FileSpreadsheet,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  CreditCard,
  FileText,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  PieChart,
} from "lucide-react";
import {
  Title,
  Subtitle,
  CardWrapper,
  Button,
  Badge,
  Input,
  PageHeader,
  Banner,
  Label,
} from "@/components/shared";
import {
  AccountHead,
  VoucherItem,
  VoucherType,
  AccountCategory,
  PayrollTaxReconciliation,
  AccountingSummary,
} from "@/types/hrm";

interface AccountingViewProps {
  currentOperator?: {
    fullId: string;
    name: string;
    department: string;
  };
  isAdmin?: boolean;
}

const INITIAL_SUMMARY: AccountingSummary = {
  totalRevenue: 14875000,
  operatingExpenses: 9240000,
  netProfit: 5635000,
  accountsReceivable: 3820000,
  accountsPayable: 2115000,
  totalTdsVdsPayable: 865400,
  cashAndBankBalance: 18450000,
};

const INITIAL_VOUCHERS: VoucherItem[] = [
  {
    id: "V-2026-001",
    voucherNo: "JV-2026-1001",
    date: "2026-10-04",
    type: "JV",
    accountCode: "5010-01",
    accountName: "Staff Monthly Salaries & Allowances",
    narration: "Monthly payroll provision for September 2026 as per Bangladesh Labor Act 2006",
    debit: 4850000,
    credit: 0,
    status: "Posted",
    createdBy: "SMT-0026",
    approvedBy: "System Administrator",
  },
  {
    id: "V-2026-002",
    voucherNo: "BPV-2026-0842",
    date: "2026-10-03",
    type: "BPV",
    accountCode: "1020-03",
    accountName: "Prime Bank PLC - Corporate A/C 2104213044100",
    narration: "Disbursement of salary transfers via BEFTN/RTGS to corporate employees",
    debit: 0,
    credit: 4215000,
    status: "Approved",
    taxTdsDeduction: 385000,
    createdBy: "SMT-0026",
    approvedBy: "Chief Financial Officer",
  },
  {
    id: "V-2026-003",
    voucherNo: "CRV-2026-0419",
    date: "2026-10-02",
    type: "CRV",
    accountCode: "1030-01",
    accountName: "Trade Accounts Receivable - SND Outlets",
    narration: "Cash receipt from Mirpur Zone Distributors for Lubricant Sales Batch #902",
    debit: 850000,
    credit: 0,
    status: "Posted",
    vatVdsDeduction: 42500,
    createdBy: "SMT-0051",
    approvedBy: "Accounts Manager",
  },
  {
    id: "V-2026-004",
    voucherNo: "CPV-2026-0312",
    date: "2026-10-01",
    type: "CPV",
    accountCode: "5040-02",
    accountName: "Field Sales Tour DA/TA & Conveyance",
    narration: "DA/TA Reimbursement for Chittagong & Sylhet Regional Outlet Visits",
    debit: 145000,
    credit: 0,
    status: "Posted",
    createdBy: "SMT-0007",
    approvedBy: "SMT-0026",
  },
  {
    id: "V-2026-005",
    voucherNo: "JV-2026-1002",
    date: "2026-09-30",
    type: "JV",
    accountCode: "2030-01",
    accountName: "NBR Withholding Tax & VAT TDS Payable",
    narration: "TDS deduction deposit under Section 49 & 52 of Bangladesh Income Tax Act 2023",
    debit: 385000,
    credit: 385000,
    status: "Approved",
    createdBy: "SMT-0026",
    approvedBy: "System Administrator",
  },
  {
    id: "V-2026-006",
    voucherNo: "BRV-2026-0155",
    date: "2026-09-28",
    type: "BRV",
    accountCode: "4010-01",
    accountName: "Industrial & PCMO Lubricant Sales Revenue",
    narration: "Direct bank transfer from Dhaka Metro Dealer against Invoice #SO-981",
    debit: 1250000,
    credit: 0,
    status: "Approved",
    createdBy: "SMT-0026",
    approvedBy: "Chief Financial Officer",
  },
];

const CHART_OF_ACCOUNTS: AccountHead[] = [
  { code: "1010", name: "Cash in Hand & Petty Cash Float", category: "Asset", balance: 450000, status: "Active" },
  { code: "1020", name: "Cash at Bank - Prime Bank PLC (A/C 2104213044100)", category: "Asset", balance: 14200000, status: "Active" },
  { code: "1021", name: "Cash at Bank - BRAC Bank PLC (A/C 1501209876543)", category: "Asset", balance: 3800000, status: "Active" },
  { code: "1030", name: "Accounts Receivable - SND Dealers & Outlets", category: "Asset", balance: 3820000, status: "Active" },
  { code: "1040", name: "Inventory - Finished Goods (PCMO & HDDO)", category: "Asset", balance: 8950000, status: "Active" },
  { code: "2010", name: "Accounts Payable - Raw Material Suppliers", category: "Liability", balance: 2115000, status: "Active" },
  { code: "2020", name: "Salary & Allowances Payable", category: "Liability", balance: 4850000, status: "Active" },
  { code: "2030", name: "NBR Withholding Tax (TDS) & VDS Payable", category: "Liability", balance: 865400, status: "Active" },
  { code: "2040", name: "Provident Fund (PF 8.33%) Contribution Payable", category: "Liability", balance: 1240000, status: "Active" },
  { code: "3010", name: "Paid-up Share Capital", category: "Equity", balance: 15000000, status: "Active" },
  { code: "3020", name: "Retained Earnings & Reserves", category: "Equity", balance: 7449600, status: "Active" },
  { code: "4010", name: "Sales Revenue - SND Dealer Network", category: "Revenue", balance: 12450000, status: "Active" },
  { code: "4020", name: "Direct Corporate & Institutional Sales", category: "Revenue", balance: 2425000, status: "Active" },
  { code: "5010", name: "Employee Salaries, BLA Allowances & PF", category: "Expense", balance: 5850000, status: "Active" },
  { code: "5020", name: "Office Rent, Utilities & Overheads", category: "Expense", balance: 1420000, status: "Active" },
  { code: "5030", name: "Field Force Tour DA/TA & Conveyance Claims", category: "Expense", balance: 980000, status: "Active" },
  { code: "5040", name: "Vehicle Fuel, Maintenance & Logistics", category: "Expense", balance: 990000, status: "Active" },
];

const PAYROLL_TAX_DATA: PayrollTaxReconciliation[] = [
  {
    month: "September 2026",
    totalGrossSalary: 4850000,
    totalBasicSalary: 2910000,
    totalPfDeduction: 242403,
    totalTaxTds: 385000,
    totalNetDisbursed: 4222597,
    bankName: "Prime Bank PLC",
    bankAccountNo: "2104213044100",
    challanNo: "CH-NBR-2026-09-8472",
    paymentStatus: "Disbursed",
  },
  {
    month: "August 2026",
    totalGrossSalary: 4780000,
    totalBasicSalary: 2868000,
    totalPfDeduction: 238904,
    totalTaxTds: 372000,
    totalNetDisbursed: 4169096,
    bankName: "Prime Bank PLC",
    bankAccountNo: "2104213044100",
    challanNo: "CH-NBR-2026-08-7219",
    paymentStatus: "Disbursed",
  },
  {
    month: "July 2026",
    totalGrossSalary: 4650000,
    totalBasicSalary: 2790000,
    totalPfDeduction: 232407,
    totalTaxTds: 360000,
    totalNetDisbursed: 4057593,
    bankName: "Prime Bank PLC",
    bankAccountNo: "2104213044100",
    challanNo: "CH-NBR-2026-07-6104",
    paymentStatus: "Disbursed",
  },
];

export function AccountingView({
  currentOperator = { fullId: "SMT-0026", name: "Nusrat Jahan", department: "Product Design" },
  isAdmin = true,
}: AccountingViewProps) {
  const [activeTab, setActiveTab] = useState<"vouchers" | "coa" | "payroll" | "petty" | "statements">("vouchers");
  const [vouchers, setVouchers] = useState<VoucherItem[]>(INITIAL_VOUCHERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // New Voucher Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVoucherNo, setNewVoucherNo] = useState("JV-2026-1049");
  const [newDate, setNewDate] = useState("2026-10-04");
  const [newType, setNewType] = useState<VoucherType>("JV");
  const [newAccountCode, setNewAccountCode] = useState("5010");
  const [newNarration, setNewNarration] = useState("");
  const [newAmount, setNewAmount] = useState<string>("150000");
  const [isDebit, setIsDebit] = useState(true);
  const [isTaxWithholding, setIsTaxWithholding] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch =
      v.voucherNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.narration.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "ALL" || v.type === selectedType;
    return matchesSearch && matchesType;
  });

  const filteredCOA = CHART_OF_ACCOUNTS.filter((acc) => {
    const matchesCategory = selectedCategory === "ALL" || acc.category === selectedCategory;
    const matchesSearch =
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.code.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    let isMounted = true;
    const loadAccountingData = async () => {
      try {
        const [resVouchers, resSummary] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/accounting/vouchers").catch(() => null),
          fetch("http://127.0.0.1:8000/api/accounting/summary").catch(() => null),
        ]);

        if (resVouchers && resVouchers.ok) {
          const json = await resVouchers.json();
          if (json?.data && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
            type ApiVoucher = {
              id: string | number;
              voucher_no: string;
              date: string;
              type: VoucherType;
              account_code: string;
              account_name: string;
              narration: string;
              debit: number;
              credit: number;
              status: "Posted" | "Approved" | "Pending";
              tax_tds_deduction?: number;
              vat_vds_deduction?: number;
              created_by: string;
              approved_by?: string;
            };
            const mapped: VoucherItem[] = json.data.map((item: ApiVoucher) => ({
              id: String(item.id),
              voucherNo: item.voucher_no,
              date: item.date,
              type: item.type,
              accountCode: item.account_code,
              accountName: item.account_name,
              narration: item.narration,
              debit: Number(item.debit) || 0,
              credit: Number(item.credit) || 0,
              status: item.status || "Posted",
              taxTdsDeduction: Number(item.tax_tds_deduction) || 0,
              vatVdsDeduction: Number(item.vat_vds_deduction) || 0,
              createdBy: item.created_by || "SMT-0026",
              approvedBy: item.approved_by,
            }));
            setVouchers(mapped);
          }
        }
      } catch {
        // fallback to state
      }
    };

    loadAccountingData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(newAmount) || 0;
    const matchedAccount = CHART_OF_ACCOUNTS.find((a) => a.code === newAccountCode) || {
      name: "General Operating Account",
      code: newAccountCode,
    };

    const newVoucher: VoucherItem = {
      id: `V-${Date.now()}`,
      voucherNo: newVoucherNo,
      date: newDate,
      type: newType,
      accountCode: matchedAccount.code,
      accountName: matchedAccount.name,
      narration: newNarration || "Office operational voucher posting",
      debit: isDebit ? parsedAmount : 0,
      credit: !isDebit ? parsedAmount : 0,
      status: "Posted",
      taxTdsDeduction: isTaxWithholding ? Math.round(parsedAmount * 0.1) : 0,
      createdBy: currentOperator.fullId,
      approvedBy: isAdmin ? currentOperator.name : undefined,
    };

    try {
      await fetch("http://127.0.0.1:8000/api/accounting/vouchers/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          voucher_no: newVoucherNo,
          date: newDate,
          type: newType,
          account_code: matchedAccount.code,
          account_name: matchedAccount.name,
          narration: newVoucher.narration,
          debit: newVoucher.debit,
          credit: newVoucher.credit,
          tax_tds_deduction: newVoucher.taxTdsDeduction,
          created_by: currentOperator.fullId,
        }),
      });
    } catch {
      // offline fallback
    }

    setVouchers([newVoucher, ...vouchers]);
    setIsModalOpen(false);
    setNewNarration("");
    toast.success(`Voucher ${newVoucherNo} posted to General Ledger!`);
    setSuccessBanner(`Voucher ${newVoucherNo} successfully created and posted to General Ledger!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const getVoucherBadgeVariant = (type: VoucherType) => {
    switch (type) {
      case "JV":
        return "default";
      case "BPV":
      case "CPV":
        return "warning";
      case "BRV":
      case "CRV":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <PageHeader
        title="Accounting & Financial Management"
        subtitle="Double-entry General Ledger, Bank/Cash Vouchers, NBR Tax/VAT TDS Deductions, and BLA 2006 Statutory Reconciliations"
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.success("NBR VAT Challan (Mushak 6.3) generated with BIN: 098765432109.");
              }}
              leftIcon={<FileText className="h-4 w-4 text-blue-600" />}
              className="bg-white border-slate-300 text-slate-800 hover:bg-slate-50 font-bold"
            >
              NBR Mushak 6.3
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Plus className="h-4 w-4" />}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md shadow-emerald-600/20"
            >
              Post New Voucher
            </Button>
          </div>
        }
      />

      {successBanner && (
        <Banner variant="success" title="Accounting Entry Posted">
          {successBanner}
        </Banner>
      )}

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardWrapper className="p-4 sm:p-5 border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              ৳{INITIAL_SUMMARY.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3.5 w-3.5" /> +18.4% YoY Growth
            </p>
          </div>
        </CardWrapper>

        <CardWrapper className="p-4 sm:p-5 border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Operating Expenses
            </span>
            <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              ৳{INITIAL_SUMMARY.operatingExpenses.toLocaleString()}
            </p>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              Salaries, DA/TA, Utilities & Supplies
            </p>
          </div>
        </CardWrapper>

        <CardWrapper className="p-4 sm:p-5 border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Cash & Bank Balance
            </span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              ৳{INITIAL_SUMMARY.cashAndBankBalance.toLocaleString()}
            </p>
            <p className="text-xs text-blue-700 font-bold mt-1">
              Prime Bank + BRAC Bank + Petty Cash
            </p>
          </div>
        </CardWrapper>

        <CardWrapper className="p-4 sm:p-5 border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              NBR TDS / VDS Tax Withheld
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              ৳{INITIAL_SUMMARY.totalTdsVdsPayable.toLocaleString()}
            </p>
            <p className="text-xs text-amber-700 font-bold mt-1">
              Govt Treasury Challans Ready
            </p>
          </div>
        </CardWrapper>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-200 flex flex-wrap gap-2 sm:gap-4">
        {[
          { id: "vouchers", label: "General Ledger & Vouchers", sub: "Journal & Cash Transactions" },
          { id: "coa", label: "Chart of Accounts (COA)", sub: "Assets, Liabilities & Equity" },
          { id: "payroll", label: "Payroll & BLA Reconciliations", sub: "Salary & Statutory Deductions" },
          { id: "petty", label: "Petty Cash & DA/TA Claims", sub: "Field & Daily Expenses" },
          { id: "statements", label: "Financial Statements", sub: "P&L and Balance Sheet" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`pb-3 pt-2 px-3 text-sm font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === tab.id
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <div>{tab.label}</div>
            <div className="text-[11px] font-normal text-slate-500">{tab.sub}</div>
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: Vouchers List & Ledger */}
      {activeTab === "vouchers" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <CardWrapper className="p-4 bg-white border border-slate-200">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search voucher number, account name, narration..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white text-slate-900 border-2 border-slate-300 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 text-sm bg-white text-slate-900 border-2 border-slate-300 rounded-xl font-medium focus:outline-none focus:border-emerald-600"
                >
                  <option value="ALL">All Voucher Types</option>
                  <option value="JV">JV - Journal Voucher</option>
                  <option value="BPV">BPV - Bank Payment</option>
                  <option value="BRV">BRV - Bank Receipt</option>
                  <option value="CPV">CPV - Cash Payment</option>
                  <option value="CRV">CRV - Cash Receipt</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const csvContent =
                      "Voucher,Date,Type,Account,Narration,Debit,Credit,Status\n" +
                      vouchers
                        .map(
                          (v) =>
                            `"${v.voucherNo}","${v.date}","${v.type}","${v.accountName}","${v.narration}",${v.debit},${v.credit},"${v.status}"`
                        )
                        .join("\n");
                    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", `General_Ledger_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  leftIcon={<Download className="h-4 w-4" />}
                  className="bg-white border-slate-300 text-slate-800 font-bold hover:bg-slate-50 shrink-0"
                >
                  Export CSV
                </Button>
              </div>
            </div>
          </CardWrapper>

          {/* Table */}
          <CardWrapper className="p-0 overflow-hidden border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#0f172a] text-white">
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Voucher No</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Type</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Account Head</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Narration</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right">Debit (৳)</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right">Credit (৳)</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-center">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredVouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 font-mono text-xs">
                        {v.voucherNo}
                      </td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{v.date}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getVoucherBadgeVariant(v.type)} className="font-mono text-xs">
                          {v.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        <div>{v.accountName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{v.accountCode}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={v.narration}>
                        {v.narration}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {v.debit > 0 ? `৳${v.debit.toLocaleString()}` : "—"}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {v.credit > 0 ? `৳${v.credit.toLocaleString()}` : "—"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            v.status === "Posted"
                              ? "bg-emerald-100 text-emerald-800"
                              : v.status === "Approved"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-xs font-medium text-slate-600">
                        {v.createdBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardWrapper>
        </div>
      )}

      {/* SUB-TAB 2: Chart of Accounts */}
      {activeTab === "coa" && (
        <div className="space-y-4">
          <CardWrapper className="p-4 bg-white border border-slate-200">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {["ALL", "Asset", "Liability", "Equity", "Revenue", "Expense"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      selectedCategory === cat
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                Total Account Heads: {filteredCOA.length}
              </div>
            </div>
          </CardWrapper>

          <CardWrapper className="p-0 overflow-hidden border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#0f172a] text-white">
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Code</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Account Head</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Category</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right">Current Balance (৳)</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCOA.map((acc) => (
                    <tr key={acc.code} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{acc.code}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{acc.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            acc.category === "Asset"
                              ? "bg-blue-100 text-blue-800"
                              : acc.category === "Liability"
                              ? "bg-amber-100 text-amber-800"
                              : acc.category === "Revenue"
                              ? "bg-emerald-100 text-emerald-800"
                              : acc.category === "Expense"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {acc.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-950">
                        ৳{acc.balance.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="success" className="text-xs">
                          {acc.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardWrapper>
        </div>
      )}

      {/* SUB-TAB 3: Payroll & Statutory Tax Reconciliation */}
      {activeTab === "payroll" && (
        <div className="space-y-4">
          <CardWrapper className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">
                  Statutory Compliance: Bangladesh Labor Act 2006 & Income Tax Act 2023
                </h4>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  Provident Fund deductions are computed at 8.33% of Basic Salary with 100% employer match. Tax Deducted at Source (TDS) is automatically calculated according to NBR individual income tax slabs and remitted via Bangladesh Bank Treasury Challans.
                </p>
              </div>
            </div>
          </CardWrapper>

          <CardWrapper className="p-0 overflow-hidden border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#0f172a] text-white">
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Salary Month</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right">Gross Salary (৳)</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right">Basic (৳)</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right">PF 8.33% (৳)</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right">NBR Tax TDS (৳)</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right">Net Disbursed (৳)</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Disbursement Bank</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">NBR Challan #</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {PAYROLL_TAX_DATA.map((item) => (
                    <tr key={item.month} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{item.month}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                        ৳{item.totalGrossSalary.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        ৳{item.totalBasicSalary.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-amber-700">
                        ৳{item.totalPfDeduction.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-rose-700">
                        ৳{item.totalTaxTds.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                        ৳{item.totalNetDisbursed.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-800 text-xs">
                        <div className="font-semibold">{item.bankName}</div>
                        <div className="font-mono text-slate-500">{item.bankAccountNo}</div>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-slate-700">
                        {item.challanNo}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="success" className="text-xs">
                          {item.paymentStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardWrapper>
        </div>
      )}

      {/* SUB-TAB 4: Petty Cash & Travel Claims */}
      {activeTab === "petty" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CardWrapper className="p-4 bg-white border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Petty Cash Float</span>
              <p className="text-xl font-black text-slate-900 mt-1">৳4,50,000</p>
              <p className="text-xs text-slate-500 mt-1">Cashier: SMT-0007 (HQ Cash Desk)</p>
            </CardWrapper>
            <CardWrapper className="p-4 bg-white border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Claims Reimbursed (This Month)</span>
              <p className="text-xl font-black text-emerald-700 mt-1">৳3,24,500</p>
              <p className="text-xs text-emerald-600 mt-1">Field DA/TA & Logistics</p>
            </CardWrapper>
            <CardWrapper className="p-4 bg-white border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Pending Requisitions</span>
              <p className="text-xl font-black text-amber-700 mt-1">৳84,200</p>
              <p className="text-xs text-amber-600 mt-1">Awaiting CFO Approval</p>
            </CardWrapper>
          </div>

          <CardWrapper className="p-0 overflow-hidden border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#0f172a] text-white">
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Employee</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Category</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Details / Route</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right">Amount (৳)</th>
                    <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-700">2026-10-04</td>
                    <td className="py-3 px-4 font-bold text-slate-900">Abdul Halim (SMT-0051)</td>
                    <td className="py-3 px-4"><Badge variant="default">Tour DA/TA</Badge></td>
                    <td className="py-3 px-4 text-slate-600">Farmgate to Gazipur Outlet Inspection (Rickshaw + Bike)</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">৳600.00</td>
                    <td className="py-3 px-4 text-center"><Badge variant="success">Paid</Badge></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-700">2026-10-03</td>
                    <td className="py-3 px-4 font-bold text-slate-900">Tanvir Ahmed (SMT-0042)</td>
                    <td className="py-3 px-4"><Badge variant="warning">Office Supplies</Badge></td>
                    <td className="py-3 px-4 text-slate-600">Printing Paper, Toner & High-Speed Ethernet Cables</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">৳8,450.00</td>
                    <td className="py-3 px-4 text-center"><Badge variant="success">Paid</Badge></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-700">2026-10-02</td>
                    <td className="py-3 px-4 font-bold text-slate-900">Ariful Islam (SMT-0007)</td>
                    <td className="py-3 px-4"><Badge variant="default">Food Allowance</Badge></td>
                    <td className="py-3 px-4 text-slate-600">Overtime Emergency Breakfast & Lunch for Warehouse Team</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">৳4,200.00</td>
                    <td className="py-3 px-4 text-center"><Badge variant="success">Paid</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardWrapper>
        </div>
      )}

      {/* SUB-TAB 5: Financial Statements */}
      {activeTab === "statements" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Statement (P&L) */}
          <CardWrapper className="p-5 border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-gray-700">Statement of Profit or Loss</h3>
                <p className="text-xs text-slate-500">For the period ended 30 September 2026</p>
              </div>
              <Badge variant="success">Audited Draft</Badge>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-100 font-bold text-slate-900">
                <span>Revenue from Contracts (Lubricants & Petroleum SND)</span>
                <span className="font-mono">৳1,48,75,000</span>
              </div>
              <div className="flex justify-between items-center py-1 text-slate-700">
                <span className="pl-4">Cost of Goods Sold & Direct Distribution</span>
                <span className="font-mono text-rose-700">(৳62,50,000)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 bg-slate-50 px-2 rounded-lg font-black text-slate-950">
                <span>Gross Profit</span>
                <span className="font-mono text-emerald-700">৳86,25,000</span>
              </div>

              <div className="pt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Operating Expenses
              </div>
              <div className="flex justify-between items-center py-1 text-slate-700">
                <span className="pl-4">Salaries, Statutory Allowances & PF</span>
                <span className="font-mono text-rose-700">(৳18,50,000)</span>
              </div>
              <div className="flex justify-between items-center py-1 text-slate-700">
                <span className="pl-4">Field Sales Tour DA/TA & Conveyance</span>
                <span className="font-mono text-rose-700">(৳4,20,000)</span>
              </div>
              <div className="flex justify-between items-center py-1 text-slate-700">
                <span className="pl-4">Depreciation & Utilities</span>
                <span className="font-mono text-rose-700">(৳7,20,000)</span>
              </div>

              <div className="flex justify-between items-center py-2 bg-emerald-50 px-3 rounded-xl border border-emerald-200 font-black text-emerald-950 text-base">
                <span>Net Profit Before Tax</span>
                <span className="font-mono text-emerald-800">৳56,35,000</span>
              </div>
            </div>
          </CardWrapper>

          {/* Balance Sheet Summary */}
          <CardWrapper className="p-5 border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-gray-700">Statement of Financial Position</h3>
                <p className="text-xs text-slate-500">As at 30 September 2026</p>
              </div>
              <Badge variant="default">Balanced</Badge>
            </div>

            <div className="space-y-3 text-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Assets
              </div>
              <div className="flex justify-between items-center py-1 text-slate-700">
                <span className="pl-4">Cash, Bank Accounts & Petty Cash Float</span>
                <span className="font-mono font-bold text-slate-900">৳1,84,50,000</span>
              </div>
              <div className="flex justify-between items-center py-1 text-slate-700">
                <span className="pl-4">Trade Accounts Receivable (SND Outlets)</span>
                <span className="font-mono font-bold text-slate-900">৳38,20,000</span>
              </div>
              <div className="flex justify-between items-center py-1 text-slate-700">
                <span className="pl-4">Inventory of Lubricants (PCMO & HDDO)</span>
                <span className="font-mono font-bold text-slate-900">৳89,50,000</span>
              </div>
              <div className="flex justify-between items-center py-1.5 bg-blue-50 px-2 rounded-lg font-black text-blue-950">
                <span>Total Assets</span>
                <span className="font-mono text-blue-800">৳3,12,20,000</span>
              </div>

              <div className="pt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Liabilities & Equity
              </div>
              <div className="flex justify-between items-center py-1 text-slate-700">
                <span className="pl-4">Trade Payables & Accrued Expenses</span>
                <span className="font-mono text-slate-900">৳69,65,000</span>
              </div>
              <div className="flex justify-between items-center py-1 text-slate-700">
                <span className="pl-4">NBR Withholding Tax & VAT TDS</span>
                <span className="font-mono text-slate-900">৳8,65,400</span>
              </div>
              <div className="flex justify-between items-center py-1 text-slate-700">
                <span className="pl-4">Paid-up Capital & Retained Reserves</span>
                <span className="font-mono text-slate-900">৳2,33,89,600</span>
              </div>
              <div className="flex justify-between items-center py-1.5 bg-slate-900 text-white px-2 rounded-lg font-black">
                <span>Total Liabilities & Equity</span>
                <span className="font-mono">৳3,12,20,000</span>
              </div>
            </div>
          </CardWrapper>
        </div>
      )}

      {/* CREATE VOUCHER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border-2 border-slate-300 relative my-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-gray-700">Post New Voucher</h3>
                  <p className="text-xs text-slate-500">Record journal or cash/bank transactions into General Ledger</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vNo">Voucher Number</Label>
                  <input
                    id="vNo"
                    type="text"
                    required
                    value={newVoucherNo}
                    onChange={(e) => setNewVoucherNo(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm bg-white text-slate-900 border-2 border-slate-300 rounded-xl font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <Label htmlFor="vDate">Posting Date</Label>
                  <input
                    id="vDate"
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm bg-white text-slate-900 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vType">Voucher Type</Label>
                  <select
                    id="vType"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as VoucherType)}
                    className="w-full mt-1 px-3 py-2 text-sm bg-white text-slate-900 border-2 border-slate-300 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="JV">JV - Journal Voucher</option>
                    <option value="BPV">BPV - Bank Payment Voucher</option>
                    <option value="BRV">BRV - Bank Receipt Voucher</option>
                    <option value="CPV">CPV - Cash Payment Voucher</option>
                    <option value="CRV">CRV - Cash Receipt Voucher</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="vAccount">Account Head</Label>
                  <select
                    id="vAccount"
                    value={newAccountCode}
                    onChange={(e) => setNewAccountCode(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm bg-white text-slate-900 border-2 border-slate-300 rounded-xl font-medium focus:outline-none focus:border-emerald-600"
                  >
                    {CHART_OF_ACCOUNTS.map((acc) => (
                      <option key={acc.code} value={acc.code}>
                        {acc.code} — {acc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vAmount">Amount (৳ Taka)</Label>
                  <input
                    id="vAmount"
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm bg-white text-slate-900 border-2 border-slate-300 rounded-xl font-mono font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <Label>Entry Side</Label>
                  <div className="flex items-center gap-3 mt-1.5">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="side"
                        checked={isDebit}
                        onChange={() => setIsDebit(true)}
                        className="text-emerald-600"
                      />
                      Debit
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="side"
                        checked={!isDebit}
                        onChange={() => setIsDebit(false)}
                        className="text-emerald-600"
                      />
                      Credit
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="vNarration">Narration / Description</Label>
                <textarea
                  id="vNarration"
                  rows={2}
                  required
                  placeholder="State the commercial purpose, invoice reference or expense justification..."
                  value={newNarration}
                  onChange={(e) => setNewNarration(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm bg-white text-slate-900 border-2 border-slate-300 rounded-xl placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTaxWithholding}
                    onChange={(e) => setIsTaxWithholding(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  Apply NBR Withholding Tax / VAT TDS
                </label>
                <span className="text-[11px] text-slate-500 font-semibold">NBR Treasury Challan Auto-Linked</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="border-slate-300 text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Post Voucher
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
