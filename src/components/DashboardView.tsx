import React from 'react';
import { MedicalCase, CaseStatus, User } from '../types';
import {
  FileText,
  Clock,
  SearchCheck,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';

interface DashboardViewProps {
  user: User;
  cases: MedicalCase[];
  onNavigateToCases: (filterStatus?: CaseStatus) => void;
  onCreateCase: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  cases,
  onNavigateToCases,
  onCreateCase,
}) => {
  const totalCases = cases.length;
  const draftCount = cases.filter((c) => c.status === 'Draft').length;
  const planningCount = cases.filter((c) => c.status === 'Planning').length;
  const inReviewCount = cases.filter((c) => c.status === 'In Review').length;
  const approvedCount = cases.filter((c) => c.status === 'Approved').length;
  const completedCount = cases.filter((c) => c.status === 'Completed').length;
  const cancelledCount = cases.filter((c) => c.status === 'Cancelled').length;

  const highPriorityCount = cases.filter((c) => c.priority === 'High').length;
  const mediumPriorityCount = cases.filter((c) => c.priority === 'Medium').length;
  const lowPriorityCount = cases.filter((c) => c.priority === 'Low').length;

  // Recent 5 activity items
  const recentCases = [...cases]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Welcome back, {user.name}
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {user.role} Role
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time medical implant case telemetry and approval pipeline
          </p>
        </div>

        {user.role !== 'Viewer' && (
          <button
            onClick={onCreateCase}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create New Case
          </button>
        )}
      </div>

      {/* Main Metric Cards Grid (Assignment Specified Counts) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Cases */}
        <div
          onClick={() => onNavigateToCases()}
          className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Cases</span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-200 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalCases}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>All active & archived</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Planning */}
        <div
          onClick={() => onNavigateToCases('Planning')}
          className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-4 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-700">Planning</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-900 font-mono tabular-nums">
            {planningCount}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Surgical schedule</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* In Review */}
        <div
          onClick={() => onNavigateToCases('In Review')}
          className="bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-4 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-amber-700">In Review</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <SearchCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-900 font-mono tabular-nums">
            {inReviewCount}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Clinical verification</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Approved */}
        <div
          onClick={() => onNavigateToCases('Approved')}
          className="bg-white border border-slate-200 hover:border-teal-300 rounded-xl p-4 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-teal-700">Approved</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-teal-900 font-mono tabular-nums">
            {approvedCount}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Ready for surgery</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Completed */}
        <div
          onClick={() => onNavigateToCases('Completed')}
          className="bg-white border border-slate-200 hover:border-emerald-300 rounded-xl p-4 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-700">Completed</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-900 font-mono tabular-nums">
            {completedCount}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Implant finalized</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>
      </div>

      {/* Secondary Row: Priority Distribution & Recent Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Breakdown Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            Priority Distribution
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>High Priority</span>
                <span className="font-mono tabular-nums">{highPriorityCount} cases</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalCases ? (highPriorityCount / totalCases) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Medium Priority</span>
                <span className="font-mono tabular-nums">{mediumPriorityCount} cases</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalCases ? (mediumPriorityCount / totalCases) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Low Priority</span>
                <span className="font-mono tabular-nums">{lowPriorityCount} cases</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-slate-400 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalCases ? (lowPriorityCount / totalCases) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
            <div>
              <span className="block text-[11px] text-slate-400">Draft Cases:</span>
              <span className="font-mono font-semibold text-slate-800">{draftCount}</span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-400">Cancelled:</span>
              <span className="font-mono font-semibold text-slate-800">{cancelledCount}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Table (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                Recent Implant Cases
              </h2>
              <button
                onClick={() => onNavigateToCases()}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onNavigateToCases()}
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-teal-700 shrink-0">
                      {c.case_number}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-900 truncate">
                        {c.surgeon_name} · {c.implant_type}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        Ref: {c.patient_reference} · Updated {new Date(c.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        c.status === 'Approved'
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : c.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : c.status === 'In Review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Displaying 5 most recently modified cases</span>
            <span className="font-mono text-[11px]">Server Time: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
