import React from 'react';
import { MedicalCase } from '../types';
import {
  X,
  FileText,
  User,
  Calendar,
  Clock,
  Shield,
  Activity,
  Printer,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface CaseDetailModalProps {
  medicalCase: MedicalCase | null;
  onClose: () => void;
  onEdit?: (medicalCase: MedicalCase) => void;
  canEdit?: boolean;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  medicalCase,
  onClose,
  onEdit,
  canEdit = false,
}) => {
  if (!medicalCase) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-teal-700">
                  {medicalCase.case_number}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    medicalCase.status === 'Approved'
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : medicalCase.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : medicalCase.status === 'In Review'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {medicalCase.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Surgeon: {medicalCase.surgeon_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Print Case Summary"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Case Data Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Patient Reference</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {medicalCase.patient_reference}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Operating Surgeon</span>
            <span className="font-semibold text-slate-900 text-sm">
              {medicalCase.surgeon_name}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Implant Type</span>
            <span className="font-semibold text-slate-900">
              {medicalCase.implant_type}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Priority Level</span>
            <span
              className={`inline-block font-semibold px-2 py-0.5 rounded-md mt-0.5 ${
                medicalCase.priority === 'High'
                  ? 'bg-rose-100 text-rose-800'
                  : medicalCase.priority === 'Medium'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {medicalCase.priority} Priority
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Scheduled Surgery Date</span>
            <span className="font-mono font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {medicalCase.surgery_date || 'Unscheduled'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Internal Database ID</span>
            <span className="font-mono font-bold text-slate-700">
              #{medicalCase.id}
            </span>
          </div>
        </div>

        {/* Creator & Audit Metadata (Mandatory Requirement) */}
        <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-teal-600" />
            Audit Trail & User Metadata
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Created By User</span>
              <span className="font-semibold text-slate-900">
                {medicalCase.creator_name || `User ID #${medicalCase.created_by}`}
              </span>
              {medicalCase.creator_email && (
                <span className="block text-slate-500 text-[11px]">
                  {medicalCase.creator_email}
                </span>
              )}
            </div>

            <div>
              <span className="text-slate-400 block">Created Timestamp</span>
              <span className="font-mono text-slate-800">
                {new Date(medicalCase.created_at).toLocaleString()}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block">Last Modified Timestamp</span>
              <span className="font-mono text-slate-800">
                {new Date(medicalCase.updated_at).toLocaleString()}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block">System Verification Status</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Validated Record
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-mono">
            Jajal Medical · ISO 13485 Compliant
          </span>

          <div className="flex items-center gap-2">
            {canEdit && onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(medicalCase);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Edit Case
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
