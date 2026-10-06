"use client";

import React, { useState, useEffect } from "react";
import { Bell, Plus, Calendar, Building2, X } from "lucide-react";
import {
  Title,
  Subtitle,
  CardWrapper,
  Button,
  Badge,
  Input,
  PageHeader,
  Banner,
  EmptyState,
  Label,
} from "@/components/shared";
import { MOCK_NOTICES } from "@/lib/api/hrmClient";
import { NoticeItem, NoticeApiRecord, ApiResponse } from "@/types/hrm";

export function NoticesView() {
  const [notices, setNotices] = useState<NoticeItem[]>(MOCK_NOTICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Normal" | "High" | "Urgent">("Normal");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchNotices = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/hrm/notice-list");
        if (!res.ok) return;
        const json: ApiResponse<NoticeApiRecord[]> = await res.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
          const mapped: NoticeItem[] = json.data.map((item: NoticeApiRecord) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            publish_at: item.publish_at,
            expire_at: item.expire_at || "2026-12-31",
            department: item.department || "All Departments",
            company: item.company || "Smart Group of Industries",
            priority: item.priority || "Normal",
          }));
          setNotices(mapped);
        }
      } catch {
        // fallback
      }
    };
    fetchNotices();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: NoticeItem = {
      id: Math.floor(10 + Math.random() * 90),
      title: title || "New Corporate Announcement",
      description: description || "General circular for staff.",
      publish_at: new Date().toISOString().split("T")[0],
      expire_at: "2026-10-31",
      department: "All Departments",
      company: "Smart Technologies (BD) Ltd.",
      priority,
    };

    setNotices([newNotice, ...notices]);
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
    setFeedback("Notice published successfully to all employee dashboards!");
    setTimeout(() => setFeedback(null), 5000);

    try {
      await fetch("http://127.0.0.1:8000/api/hrm/notice-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newNotice.title,
          description: newNotice.description,
          priority: newNotice.priority,
          publish_at: newNotice.publish_at,
          department: newNotice.department,
          company: newNotice.company,
        }),
      });
    } catch {
      // offline handling
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Corporate Notices & Circulars"
        subtitle="Official policy updates, office schedules, and executive communications"
        badge={
          <Badge variant="default" className="gap-1 font-bold">
            <Bell className="h-3 w-3" /> {notices.length} Active Circulars
          </Badge>
        }
        action={
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            Publish Notice
          </Button>
        }
      />

      {feedback && (
        <Banner
          variant="success"
          title="Circular Broadcasted"
          description={feedback}
          isDismissible
          onClose={() => setFeedback(null)}
        />
      )}

      {/* Notices Feed */}
      {notices.length === 0 ? (
        <EmptyState
          title="No active circulars"
          description="There are currently no company announcements or notices."
          icon={<Bell className="h-6 w-6 text-slate-400" />}
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Publish Notice
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {notices.map((n) => (
            <CardWrapper key={n.id} className="relative overflow-hidden border-2 border-slate-300 bg-white hover:border-slate-900 shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase ${
                        n.priority === "Urgent"
                          ? "bg-rose-700 text-white"
                          : n.priority === "High"
                          ? "bg-amber-600 text-white"
                          : "bg-blue-700 text-white"
                      }`}
                    >
                      {n.priority}
                    </span>
                    <span className="text-[11px] text-slate-700 font-mono font-bold">
                      #{n.id} &bull; {n.department}
                    </span>
                  </div>
                  <Title level={3} className="text-base font-black text-gray-700 mt-2">
                    {n.title}
                  </Title>
                </div>
              </div>

              <p className="text-xs text-slate-800 font-medium mt-3 leading-relaxed">
                {n.description}
              </p>

              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-700 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-900" />
                  <span>Published: {n.publish_at}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-900" />
                  <span>{n.company}</span>
                </div>
              </div>
            </CardWrapper>
          ))}
        </div>
      )}

      {/* Publish Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <Title level={2} className="text-xl font-bold text-gray-700">
              Publish Corporate Notice
            </Title>
            <Subtitle className="text-xs text-slate-700 font-medium mt-1 mb-6">
              Broadcast circular to team members and staff dashboards
            </Subtitle>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <Input
                label="Circular Title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Office Timing Revision"
                required
              />

              <div>
                <Label required>Priority Classification</Label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as typeof priority)}
                  className="h-10 w-full rounded-lg border-2 border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                >
                  <option value="Normal">Normal Notice</option>
                  <option value="High">High Importance</option>
                  <option value="Urgent">Urgent / Immediate Attention</option>
                </select>
              </div>

              <div>
                <Label required>Notice Content</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the announcement..."
                  className="w-full h-24 rounded-lg border-2 border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Broadcast Circular</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
