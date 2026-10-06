"use client";

import React from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { Title, Subtitle, Button, Badge } from "@/components/shared";
import { Employee } from "@/types/hrm";

interface DeleteEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onConfirm: (id: number | string) => Promise<void> | void;
  isLoading?: boolean;
}

export function DeleteEmployeeDialog({
  isOpen,
  onClose,
  employee,
  onConfirm,
  isLoading = false,
}: DeleteEmployeeDialogProps) {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-2 border-rose-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
            <Trash2 className="h-6 w-6" />
          </div>
          <div>
            <Title level={3} className="text-lg font-black text-gray-700 leading-tight">
              Delete Employee Record
            </Title>
            <p className="text-xs text-rose-600 font-bold mt-0.5">
              Permanent Deletion Confirmation
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            Are you sure you want to permanently delete the profile and records for{" "}
            <span className="font-black text-slate-950">{employee.name}</span>?
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Staff ID:</span>
              <span className="font-mono font-bold text-slate-900">{employee.employee_full_id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Designation:</span>
              <span className="font-bold text-slate-900">{employee.designation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Department:</span>
              <span className="font-semibold text-slate-800">{employee.department}</span>
            </div>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-900">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="font-medium">
              This action will remove the employee from active payroll, attendance logs, and directory. This cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-slate-300 text-slate-900 font-bold hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={() => onConfirm(employee.id)}
            className="bg-rose-600 hover:bg-rose-700 text-white font-black shadow-md shadow-rose-600/30 gap-1.5"
          >
            {isLoading ? "Deleting..." : "Yes, Delete Employee"}
          </Button>
        </div>
      </div>
    </div>
  );
}
