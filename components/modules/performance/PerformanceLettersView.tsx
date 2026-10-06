"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Award,
  AlertTriangle,
  GraduationCap,
  Target,
  FileText,
  Printer,
  CheckCircle2,
  Calendar,
  Building,
  User,
  ArrowRight,
  TrendingUp,
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

interface AwardItem {
  id: number;
  recipientName: string;
  employeeFullId: string;
  type: "Excellence Award" | "Show Cause Notice" | "Official Warning" | "Star of the Month";
  issueDate: string;
  reason: string;
  status: "Issued" | "Resolved" | "Acknowledged";
}

interface TrainingCourse {
  id: number;
  title: string;
  trainer: string;
  department: string;
  startDate: string;
  duration: string;
  enrolledStaff: number;
  status: "Upcoming" | "In Progress" | "Completed";
}

interface LetterTemplate {
  id: string;
  name: string;
  description: string;
  category: "Recruitment" | "Career Progression" | "Separation" | "Discipline";
}

const INITIAL_AWARDS: AwardItem[] = [
  {
    id: 1,
    recipientName: "Mahbubur Rahman",
    employeeFullId: "SR-0101",
    type: "Star of the Month",
    issueDate: "2026-10-01",
    reason: "Surpassed monthly sales target by 117% with 0 default credit",
    status: "Issued",
  },
  {
    id: 2,
    recipientName: "Kamal Hossain",
    employeeFullId: "SMT-0089",
    type: "Official Warning",
    issueDate: "2026-09-24",
    reason: "Consecutive unauthorized delay in shift punch beyond grace threshold",
    status: "Acknowledged",
  },
  {
    id: 3,
    recipientName: "Sayed Mahfuzur Rahman",
    employeeFullId: "SMT-0052",
    type: "Excellence Award",
    issueDate: "2026-09-15",
    reason: "Architecture design of high-throughput biometric synchronization gateway",
    status: "Issued",
  },
];

const INITIAL_TRAININGS: TrainingCourse[] = [
  {
    id: 1,
    title: "Advanced B2B Lubricants Consultative Sales",
    trainer: "Kazi Farhan Ahmed (GM Sales)",
    department: "Sales & Distribution",
    startDate: "2026-10-18",
    duration: "2 Days (16 Hours)",
    enrolledStaff: 24,
    status: "Upcoming",
  },
  {
    id: 2,
    title: "ISO 9001:2015 Workplace Quality & Safety Standard",
    trainer: "Bureau Veritas Certified Lead Auditor",
    department: "All Operations",
    startDate: "2026-09-20",
    duration: "1 Day (8 Hours)",
    enrolledStaff: 48,
    status: "Completed",
  },
];

const LETTER_TEMPLATES: LetterTemplate[] = [
  { id: "appointment", name: "Official Appointment Letter", description: "Formal job offer & terms of employment with statutory salary breakdown", category: "Recruitment" },
  { id: "confirmation", name: "Probation Confirmation Letter", description: "Confirmation of permanent status following successful probation period", category: "Career Progression" },
  { id: "increment", name: "Annual Salary Increment Letter", description: "Revision of grade, basic pay, and enhanced performance allowances", category: "Career Progression" },
  { id: "transfer", name: "Inter-Depot / Territory Transfer Order", description: "Official transfer to regional zone, depot, or sister company unit", category: "Career Progression" },
  { id: "experience", name: "Service & Experience Certificate", description: "Service tenure verification, conduct endorsement & technical role summary", category: "Separation" },
  { id: "clearance", name: "Final Settlement & Clearance Certificate", description: "Handover checklist, gratuity payout calculation & release voucher", category: "Separation" },
];

export interface PerformanceLettersViewProps {
  initialSubTab?: string;
}

export function PerformanceLettersView({ initialSubTab }: PerformanceLettersViewProps = {}) {
  const [openSections, setOpenSections] = useState<string[]>(
    initialSubTab ? [initialSubTab] : ["letters", "awards", "training"]
  );

  useEffect(() => {
    if (initialSubTab) {
      setOpenSections([initialSubTab]);
    }
  }, [initialSubTab]);

  const [awards] = useState<AwardItem[]>(INITIAL_AWARDS);
  const [trainings] = useState<TrainingCourse[]>(INITIAL_TRAININGS);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const handlePrintLetter = (templateName: string) => {
    setSelectedLetter(templateName);
    toast.success(`Generated official print preview for "${templateName}"`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance, Discipline & Official Letters"
        subtitle="Manage employee awards, disciplinary notices, training programs, and generate print-ready corporate letters."
        badge={<Badge variant="default">Corporate HR Governance</Badge>}
      />

      {/* Subcategory Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setOpenSections(["letters", "awards", "training"])}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0",
            openSections.length > 1
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          )}
        >
          All Modules (3 Sections)
        </button>
        <button
          type="button"
          onClick={() => setOpenSections(["letters"])}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0",
            openSections.length === 1 && openSections.includes("letters")
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          )}
        >
          <FileText className="h-3.5 w-3.5" />
          Official Letters Generator
        </button>
        <button
          type="button"
          onClick={() => setOpenSections(["awards"])}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0",
            openSections.length === 1 && openSections.includes("awards")
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          )}
        >
          <Award className="h-3.5 w-3.5" />
          Awards & Disciplinary ({awards.length})
        </button>
        <button
          type="button"
          onClick={() => setOpenSections(["training"])}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0",
            openSections.length === 1 && openSections.includes("training")
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          )}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          Training & Development ({trainings.length})
        </button>
      </div>

      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={(val) => setOpenSections(Array.isArray(val) ? val : [val])}
      >
        {/* 1. Official Corporate Letters Generator */}
        <AccordionItem value="letters">
          <AccordionTrigger
            icon={<FileText className="h-5 w-5" />}
            subtitle="Generate instant appointment letters, confirmation orders, increment letters & clearance documents"
            badge={<Badge variant="success">6 Templates Ready</Badge>}
          >
            Official Letters & Certificate Generator
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {LETTER_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-[10px]">
                          {tmpl.category}
                        </Badge>
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{tmpl.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <Button
                        size="sm"
                        onClick={() => handlePrintLetter(tmpl.name)}
                        leftIcon={<Printer className="h-3.5 w-3.5" />}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs w-full"
                      >
                        Generate & Preview
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedLetter && (
                <div className="p-5 rounded-2xl bg-white border-2 border-blue-400 shadow-md animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase text-blue-600">
                        Corporate Template Preview
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900">{selectedLetter}</h3>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => window.print()}
                      leftIcon={<Printer className="h-4 w-4" />}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                    >
                      Print Document
                    </Button>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-xl font-serif text-slate-800 text-xs sm:text-sm leading-relaxed border border-slate-200 space-y-3">
                    <div className="text-center border-b border-slate-300 pb-3 mb-3">
                      <h2 className="text-lg font-bold text-gray-700 font-sans">
                        SMART TECHNOLOGIES (BD) LTD.
                      </h2>
                      <p className="text-xs text-slate-600 font-sans">
                        Corporate Headquarters: Tejgaon Commercial Area, Dhaka-1208, Bangladesh
                      </p>
                    </div>
                    <p className="text-right font-mono text-xs">
                      Ref: SMT/HR/2026/0491 &bull; Date: October 05, 2026
                    </p>
                    <p className="font-bold">To: Abdul Halim (Staff ID: SMT-0051)</p>
                    <p>
                      We have the pleasure in confirming your record and statutory documentation under the official governance policies of Smart Group of Industries.
                    </p>
                    <p>
                      This certificate is issued under the authenticated authority of the Human Resources & Legal Compliance Directorate.
                    </p>
                    <div className="pt-8 flex justify-between items-end">
                      <div>
                        <div className="h-0.5 w-36 bg-slate-400 mb-1" />
                        <p className="text-xs font-bold font-sans">Head of Human Resources</p>
                        <p className="text-[10px] text-slate-500 font-sans">Smart Group of Industries</p>
                      </div>
                      <div className="text-right">
                        <div className="h-10 w-24 border border-dashed border-blue-400 rounded flex items-center justify-center text-[10px] font-mono text-blue-600">
                          Digital Seal
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Award & Discipline */}
        <AccordionItem value="awards">
          <AccordionTrigger
            icon={<Award className="h-5 w-5" />}
            subtitle="Recognitions, best performance awards, show-cause notices & formal warnings"
            badge={<Badge variant="default">{awards.length} Records</Badge>}
          >
            Awards, Commendations & Disciplinary Notices
          </AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3">SL</th>
                    <th className="py-3 px-3">Employee</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Particulars / Reason</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {awards.map((a, idx) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-900">{a.recipientName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{a.employeeFullId}</p>
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={
                            a.type === "Star of the Month" || a.type === "Excellence Award"
                              ? "success"
                              : "destructive"
                          }
                        >
                          {a.type}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{a.issueDate}</td>
                      <td className="py-2.5 px-3 text-slate-800">{a.reason}</td>
                      <td className="py-2.5 px-3 text-center">
                        <Badge variant="outline">{a.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 3. Training & Professional Development */}
        <AccordionItem value="training">
          <AccordionTrigger
            icon={<GraduationCap className="h-5 w-5" />}
            subtitle="Internal and external skill enhancement programs, certifications & attendance"
            badge={<Badge variant="default">{trainings.length} Courses</Badge>}
          >
            Employee Training & Capability Programs
          </AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Course Title</th>
                    <th className="py-3 px-3">Instructor / Trainer</th>
                    <th className="py-3 px-3">Target Department</th>
                    <th className="py-3 px-3">Start Date</th>
                    <th className="py-3 px-3">Duration</th>
                    <th className="py-3 px-3 text-center">Enrolled</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {trainings.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{t.title}</td>
                      <td className="py-2.5 px-3 text-slate-700">{t.trainer}</td>
                      <td className="py-2.5 px-3 font-semibold text-blue-700">{t.department}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{t.startDate}</td>
                      <td className="py-2.5 px-3 text-slate-600">{t.duration}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800 font-mono">
                        {t.enrolledStaff} Staff
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Badge variant={t.status === "Completed" ? "success" : "default"}>
                          {t.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
