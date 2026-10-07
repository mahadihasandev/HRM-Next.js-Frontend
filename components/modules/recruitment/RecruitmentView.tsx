"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Users,
  UserCheck,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Filter,
  FileText,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  ExternalLink,
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

interface JobOpening {
  id: number;
  title: string;
  department: string;
  location: string;
  type: "Full-Time" | "Contractual" | "Internship";
  vacancies: number;
  experience: string;
  deadline: string;
  status: "Active" | "Closed" | "Draft";
  applicantsCount: number;
}

interface Applicant {
  id: number;
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  experienceYears: number;
  currentCompany: string;
  appliedDate: string;
  stage: "Applied" | "Screened" | "Interview" | "Selected" | "Rejected";
  rating: number;
}

const INITIAL_JOBS: JobOpening[] = [
  {
    id: 1,
    title: "Senior Territory Sales Officer (TSO)",
    department: "Sales & Distribution",
    location: "Chittagong & Comilla Zone",
    type: "Full-Time",
    vacancies: 4,
    experience: "3-5 Years in FMCG/Lubricants",
    deadline: "2026-10-31",
    status: "Active",
    applicantsCount: 28,
  },
  {
    id: 2,
    title: "Field Sales Representative (SR)",
    department: "Field Force Management",
    location: "Dhaka North & Gazipur",
    type: "Full-Time",
    vacancies: 10,
    experience: "1-2 Years Retail Sales",
    deadline: "2026-11-15",
    status: "Active",
    applicantsCount: 54,
  },
  {
    id: 3,
    title: "Full-Stack Software Engineer (Next.js & Laravel)",
    department: "Engineering & IT",
    location: "Corporate Tech HQ, Mohakhali",
    type: "Full-Time",
    vacancies: 2,
    experience: "3+ Years Enterprise Web",
    deadline: "2026-10-25",
    status: "Active",
    applicantsCount: 42,
  },
  {
    id: 4,
    title: "Executive - Statutory Accounts & Tax TDS",
    department: "Finance & Accounts",
    location: "Corporate HQ, Tejgaon",
    type: "Full-Time",
    vacancies: 1,
    experience: "2-4 Years NBR Tax & VAT",
    deadline: "2026-11-05",
    status: "Active",
    applicantsCount: 19,
  },
];

const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: 101,
    name: "Tariqul Islam",
    jobTitle: "Senior Territory Sales Officer (TSO)",
    email: "tariqul.sales@gmail.com",
    phone: "01819234567",
    experienceYears: 4,
    currentCompany: "Meghna Group of Industries",
    appliedDate: "2026-10-02",
    stage: "Interview",
    rating: 4.8,
  },
  {
    id: 102,
    name: "Mahmudur Rahman",
    jobTitle: "Senior Territory Sales Officer (TSO)",
    email: "m.rahman@yahoo.com",
    phone: "01712894561",
    experienceYears: 5,
    currentCompany: "ACI Motors Ltd.",
    appliedDate: "2026-10-01",
    stage: "Selected",
    rating: 4.9,
  },
  {
    id: 103,
    name: "Sayeed Al-Amin",
    jobTitle: "Field Sales Representative (SR)",
    email: "sayeed.alamin@outlook.com",
    phone: "01923778899",
    experienceYears: 2,
    currentCompany: "Akij Group",
    appliedDate: "2026-10-04",
    stage: "Screened",
    rating: 4.2,
  },
  {
    id: 104,
    name: "Nafisa Tabassum",
    jobTitle: "Full-Stack Software Engineer (Next.js & Laravel)",
    email: "nafisa.dev@gmail.com",
    phone: "01521443322",
    experienceYears: 3,
    currentCompany: "Brain Station 23",
    appliedDate: "2026-10-03",
    stage: "Interview",
    rating: 4.7,
  },
  {
    id: 105,
    name: "Rakibul Hasan",
    jobTitle: "Executive - Statutory Accounts & Tax TDS",
    email: "rakibul.fin@gmail.com",
    phone: "01688112233",
    experienceYears: 3,
    currentCompany: "Square Pharmaceuticals",
    appliedDate: "2026-10-02",
    stage: "Applied",
    rating: 4.0,
  },
];

export interface RecruitmentViewProps {
  initialSubTab?: string;
}

export function RecruitmentView({ initialSubTab }: RecruitmentViewProps = {}) {
  const [openSections, setOpenSections] = useState<string[]>(
    initialSubTab ? [initialSubTab] : ["jobs", "applications"]
  );


  const [jobs, setJobs] = useState<JobOpening[]>(INITIAL_JOBS);
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);

  // New Job Form State
  const [jobTitle, setJobTitle] = useState("");
  const [jobDept, setJobDept] = useState("Sales & Distribution");
  const [jobLocation, setJobLocation] = useState("");
  const [jobVacancies, setJobVacancies] = useState(2);
  const [jobExp, setJobExp] = useState("");
  const [jobDeadline, setJobDeadline] = useState("");

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobLocation.trim() || !jobDeadline) {
      toast.error("Please fill in required job fields");
      return;
    }

    const newJob: JobOpening = {
      id: Date.now(),
      title: jobTitle.trim(),
      department: jobDept,
      location: jobLocation.trim(),
      type: "Full-Time",
      vacancies: Number(jobVacancies) || 1,
      experience: jobExp.trim() || "1-3 Years",
      deadline: jobDeadline,
      status: "Active",
      applicantsCount: 0,
    };

    setJobs([newJob, ...jobs]);
    setIsAddJobOpen(false);
    setJobTitle("");
    setJobLocation("");
    setJobExp("");
    setJobDeadline("");
    toast.success(`Job circular "${newJob.title}" posted successfully`);
  };

  const handleUpdateApplicantStage = (
    applicantId: number,
    newStage: Applicant["stage"]
  ) => {
    setApplicants(
      applicants.map((a) => (a.id === applicantId ? { ...a, stage: newStage } : a))
    );
    toast.success(`Applicant moved to ${newStage}`);
  };

  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search);
    const matchesStage = filterStage === "all" || a.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Acquisition & Recruitment Hub"
        subtitle="Manage job circulars, track applicant pipelines (ATS), interview schedules, and candidate selections."
        badge={<Badge variant="success">ATS Active</Badge>}
      />

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Active Openings</span>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{jobs.length}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
            17 Open Vacancies
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Total Applicants</span>
            <Users className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {jobs.reduce((acc, j) => acc + j.applicantsCount, 0)}
          </p>
          <span className="text-[10px] text-blue-600 font-bold mt-1 inline-block">
            Across All Circulars
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">In Interview Pipeline</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {applicants.filter((a) => a.stage === "Interview").length}
          </p>
          <span className="text-[10px] text-amber-600 font-bold mt-1 inline-block">
            Stage 2 Shortlist
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Selected / Offer Sent</span>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {applicants.filter((a) => a.stage === "Selected").length}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
            Joining Confirmed
          </span>
        </div>
      </div>

      {/* Subcategory Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setOpenSections(["jobs", "applications"])}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0",
            openSections.length > 1
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          )}
        >
          All Modules ({jobs.length} Jobs, {applicants.length} Candidates)
        </button>
        <button
          type="button"
          onClick={() => setOpenSections(["jobs"])}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0",
            openSections.length === 1 && openSections.includes("jobs")
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          )}
        >
          <Briefcase className="h-3.5 w-3.5" />
          Active Job Circulars ({jobs.length})
        </button>
        <button
          type="button"
          onClick={() => setOpenSections(["applications"])}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0",
            openSections.length === 1 && openSections.includes("applications")
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          )}
        >
          <Users className="h-3.5 w-3.5" />
          Candidate ATS Pipeline ({applicants.length})
        </button>
      </div>

      {/* Accordions for Recruitment Sections */}
      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={(val) => setOpenSections(Array.isArray(val) ? val : [val])}
      >
        {/* 1. Job Circulars & Openings */}
        <AccordionItem value="jobs">
          <AccordionTrigger
            icon={<Briefcase className="h-5 w-5" />}
            subtitle="Publish new job vacancies, requirements, deadlines & review candidate counts"
            badge={<Badge variant="default">{jobs.length} Positions</Badge>}
          >
            Active Job Openings & Circulars
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-700">
                  Manage active vacancy postings and recruitment criteria
                </p>
                <Button
                  size="sm"
                  onClick={() => setIsAddJobOpen(!isAddJobOpen)}
                  leftIcon={<Plus className="h-4 w-4" />}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  {isAddJobOpen ? "Close Form" : "Post New Job Circular"}
                </Button>
              </div>

              {/* Add Job Form */}
              {isAddJobOpen && (
                <form
                  onSubmit={handleCreateJob}
                  className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 space-y-3 animate-in fade-in duration-200"
                >
                  <p className="text-xs font-extrabold text-blue-900 uppercase tracking-wide">
                    New Vacancy Circular
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Job Position Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Area Sales Manager"
                        className="w-full bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Department
                      </label>
                      <select
                        value={jobDept}
                        onChange={(e) => setJobDept(e.target.value)}
                        className="w-full bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
                      >
                        <option value="Sales & Distribution">Sales & Distribution</option>
                        <option value="Field Force Management">Field Force Management</option>
                        <option value="Engineering & IT">Engineering & IT</option>
                        <option value="Finance & Accounts">Finance & Accounts</option>
                        <option value="Administration & HR">Administration & HR</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Location / Territory *
                      </label>
                      <input
                        type="text"
                        required
                        value={jobLocation}
                        onChange={(e) => setJobLocation(e.target.value)}
                        placeholder="e.g. Bogura & Rangpur"
                        className="w-full bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Vacancies
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={jobVacancies}
                        onChange={(e) => setJobVacancies(Number(e.target.value))}
                        className="w-full bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Experience Required
                      </label>
                      <input
                        type="text"
                        value={jobExp}
                        onChange={(e) => setJobExp(e.target.value)}
                        placeholder="e.g. 2-4 Years Lubricant Sales"
                        className="w-full bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Application Deadline *
                      </label>
                      <input
                        type="date"
                        required
                        value={jobDeadline}
                        onChange={(e) => setJobDeadline(e.target.value)}
                        className="w-full bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddJobOpen(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                    >
                      Save & Publish Circular
                    </Button>
                  </div>
                </form>
              )}

              {/* Jobs Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-3">SL</th>
                      <th className="py-3 px-3">Job Title</th>
                      <th className="py-3 px-3">Department</th>
                      <th className="py-3 px-3">Location</th>
                      <th className="py-3 px-3 text-center">Vacancies</th>
                      <th className="py-3 px-3 text-center">Applicants</th>
                      <th className="py-3 px-3">Deadline</th>
                      <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {jobs.map((j, idx) => (
                      <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{j.title}</td>
                        <td className="py-2.5 px-3 text-slate-700">{j.department}</td>
                        <td className="py-2.5 px-3 text-slate-600">{j.location}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-800 font-mono">
                          {j.vacancies}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800 text-[11px]">
                            {j.applicantsCount}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">{j.deadline}</td>
                        <td className="py-2.5 px-3 text-center">
                          <Badge variant="success">Active</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Applicant Tracking System (ATS Pipeline) */}
        <AccordionItem value="applications">
          <AccordionTrigger
            icon={<Users className="h-5 w-5" />}
            subtitle="Screen resumes, update applicant hiring stages & manage interviews"
            badge={<Badge variant="default">{applicants.length} Candidates Tracked</Badge>}
          >
            Candidate Pipeline & ATS Applications
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search candidate name, position, phone..."
                    className="w-full bg-white text-slate-900 border-2 border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-700">Stage:</span>
                  <select
                    value={filterStage}
                    onChange={(e) => setFilterStage(e.target.value)}
                    className="bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none"
                  >
                    <option value="all">All Stages</option>
                    <option value="Applied">Applied</option>
                    <option value="Screened">Screened</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Applicants Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-3">Candidate</th>
                      <th className="py-3 px-3">Applied Position</th>
                      <th className="py-3 px-3">Contact</th>
                      <th className="py-3 px-3">Current Employer</th>
                      <th className="py-3 px-3 text-center">Experience</th>
                      <th className="py-3 px-3">Hiring Stage</th>
                      <th className="py-3 px-3 text-center">Stage Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredApplicants.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900">{app.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">ID: #{app.id}</p>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{app.jobTitle}</td>
                        <td className="py-2.5 px-3">
                          <p className="font-mono text-slate-700">{app.phone}</p>
                          <p className="text-[10px] text-slate-500">{app.email}</p>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{app.currentCompany}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-800 font-mono">
                          {app.experienceYears} Yrs
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge
                            variant={
                              app.stage === "Selected"
                                ? "success"
                                : app.stage === "Interview"
                                ? "warning"
                                : app.stage === "Rejected"
                                ? "destructive"
                                : "default"
                            }
                          >
                            {app.stage}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <select
                            value={app.stage}
                            onChange={(e) =>
                              handleUpdateApplicantStage(
                                app.id,
                                e.target.value as Applicant["stage"]
                              )
                            }
                            className="bg-white text-slate-900 border-2 border-slate-300 rounded px-2 py-1 text-[11px] font-bold focus:outline-none"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Screened">Screened</option>
                            <option value="Interview">Interview</option>
                            <option value="Selected">Select / Hire</option>
                            <option value="Rejected">Reject</option>
                          </select>
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
