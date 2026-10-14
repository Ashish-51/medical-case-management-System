import React, { useState, useEffect } from 'react';
import {
  MedicalCase,
  CaseStatus,
  CasePriority,
  User,
  STATUS_LIST,
  PRIORITY_LIST,
} from '../types';
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  RefreshCw,
  AlertCircle,
  Calendar,
  CheckCircle,
} from 'lucide-react';

interface CaseListViewProps {
  user: User;
  token: string;
  initialStatusFilter?: CaseStatus | 'All';
  onViewCase: (medicalCase: MedicalCase) => void;
  onEditCase: (medicalCase: MedicalCase) => void;
  onCreateCase: () => void;
  onRefreshTrigger: () => void;
}

export const CaseListView: React.FC<CaseListViewProps> = ({
  user,
  token,
  initialStatusFilter = 'All',
  onViewCase,
  onEditCase,
  onCreateCase,
  onRefreshTrigger,
}) => {
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(
    initialStatusFilter || 'All'
  );
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Delete modal state
  const [deleteModalCase, setDeleteModalCase] = useState<MedicalCase | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch Cases from API
  const fetchCases = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search,
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        sortOrder,
      });

      const res = await fetch(`/api/cases?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to fetch case list.');
        setLoading(false);
        return;
      }

      setCases(data.data.items);
      setTotalPages(data.data.totalPages);
      setTotalCount(data.data.total);
    } catch (err) {
      setError('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [page, pageSize, statusFilter, priorityFilter, sortBy, sortOrder]);

  // Debounced Search Handler
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchCases();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Sort toggle handler
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  // Quick Inline Status Update handler
  const handleQuickStatusChange = async (
    medicalCase: MedicalCase,
    newStatus: CaseStatus
  ) => {
    try {
      const res = await fetch(`/api/cases/${medicalCase.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to update case status.');
        return;
      }

      setActionSuccess(`Status for ${medicalCase.case_number} updated to ${newStatus}.`);
      setTimeout(() => setActionSuccess(null), 3000);
      fetchCases();
      onRefreshTrigger();
    } catch (err) {
      setError('Failed to update status due to network error.');
    }
  };

  // Confirm Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteModalCase) return;
    setDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/cases/${deleteModalCase.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Display server-enforced role error (e.g., 403 Forbidden for non-Admin)
        setDeleteError(
          data.message || 'Server denied delete action. Only Admin users can delete cases.'
        );
        setDeleting(false);
        return;
      }

      setActionSuccess(`Case ${deleteModalCase.case_number} deleted successfully.`);
      setTimeout(() => setActionSuccess(null), 3000);
      setDeleteModalCase(null);
      fetchCases();
      onRefreshTrigger();
    } catch (err) {
      setDeleteError('Network error while attempting deletion.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 border border-slate-200 rounded-xl shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Implant Medical Cases
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {totalCount} registered cases with role-governed authorization
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => fetchCases()}
            className="p-2 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            title="Refresh Table"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {user.role !== 'Viewer' && (
            <button
              onClick={onCreateCase}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Case
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-rose-600 hover:text-rose-900 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Controls Bar: Search & Filters */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Case Number, Surgeon, or Patient Ref..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3 flex items-center gap-1">
            <span className="text-[11px] font-semibold text-slate-500 shrink-0">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Statuses</option>
              {STATUS_LIST.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter (Bonus) */}
          <div className="md:col-span-2 flex items-center gap-1">
            <span className="text-[11px] font-semibold text-slate-500 shrink-0">
              Priority:
            </span>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Priorities</option>
              {PRIORITY_LIST.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Page Size Selector */}
          <div className="md:col-span-2 flex items-center gap-1 justify-end">
            <span className="text-[11px] font-semibold text-slate-500 shrink-0">
              Rows:
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(1);
              }}
              className="px-2 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Cases Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th
                  onClick={() => handleSort('case_number')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Case No.</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Patient Ref</th>
                <th
                  onClick={() => handleSort('surgeon_name')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Surgeon</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Implant Type</th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('priority')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('surgery_date')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Surgery Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-normal text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <span className="inline-block w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mb-2"></span>
                    <p>Loading medical case records...</p>
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <p className="font-semibold text-slate-700 text-sm">
                      No medical cases found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your search criteria or filter selections.
                    </p>
                  </td>
                </tr>
              ) : (
                cases.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Case Number */}
                    <td className="py-3 px-4 font-mono font-bold text-teal-700 whitespace-nowrap">
                      {item.case_number}
                    </td>

                    {/* Patient Ref */}
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {item.patient_reference}
                    </td>

                    {/* Surgeon */}
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      {item.surgeon_name}
                    </td>

                    {/* Implant Type */}
                    <td className="py-3 px-4 text-slate-700 max-w-[180px] truncate">
                      {item.implant_type}
                    </td>

                    {/* Status dropdown/badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {user.role !== 'Viewer' ? (
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleQuickStatusChange(
                              item,
                              e.target.value as CaseStatus
                            )
                          }
                          className={`text-xs font-semibold px-2 py-1 rounded-md border text-slate-800 transition-colors focus:outline-hidden ${
                            item.status === 'Approved'
                              ? 'bg-teal-50 border-teal-200 text-teal-800'
                              : item.status === 'Completed'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : item.status === 'In Review'
                              ? 'bg-amber-50 border-amber-200 text-amber-800'
                              : item.status === 'Planning'
                              ? 'bg-blue-50 border-blue-200 text-blue-800'
                              : item.status === 'Cancelled'
                              ? 'bg-slate-100 border-slate-200 text-slate-600 line-through'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {STATUS_LIST.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                            item.status === 'Approved'
                              ? 'bg-teal-50 text-teal-800 border border-teal-200'
                              : item.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : item.status === 'In Review'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          item.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : item.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>

                    {/* Surgery Date */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                      {item.surgery_date ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{item.surgery_date}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unscheduled</span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* View Button (All Roles) */}
                        <button
                          onClick={() => onViewCase(item)}
                          className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="View Case Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Button (Admin & Engineer) */}
                        {user.role !== 'Viewer' && (
                          <button
                            onClick={() => onEditCase(item)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Edit Case"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Button (Admin Only per requirement!) */}
                        {user.role === 'Admin' ? (
                          <button
                            onClick={() => {
                              setDeleteModalCase(item);
                              setDeleteError(null);
                            }}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Case (Admin Only)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          /* Hidden or disabled for Non-Admin per policy */
                          null
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <span className="font-semibold text-slate-900">{cases.length}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalCount}</span> cases (Page{' '}
            <span className="font-mono font-bold text-slate-900">{page}</span> of{' '}
            <span className="font-mono font-bold text-slate-900">{totalPages}</span>)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-semibold flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <span className="font-mono text-xs px-2">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-semibold flex items-center gap-1 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 bg-rose-50 rounded-lg border border-rose-100">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Delete Medical Case
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete case{' '}
              <strong className="text-slate-900 font-mono">
                {deleteModalCase.case_number}
              </strong>{' '}
              for surgeon <strong className="text-slate-900">{deleteModalCase.surgeon_name}</strong>?
              This action cannot be undone.
            </p>

            {deleteError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteModalCase(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {deleting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
