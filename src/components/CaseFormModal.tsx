import React, { useState, useEffect } from 'react';
import {
  MedicalCase,
  CaseStatus,
  CasePriority,
  STATUS_LIST,
  PRIORITY_LIST,
  IMPLANT_TYPES,
  HolidayInfo,
} from '../types';
import {
  X,
  Save,
  AlertCircle,
  Calendar,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface CaseFormModalProps {
  isOpen: boolean;
  token: string;
  initialData?: MedicalCase | null; // Null for Create mode, object for Edit mode
  onClose: () => void;
  onSuccess: (savedCase: MedicalCase) => void;
}

export const CaseFormModal: React.FC<CaseFormModalProps> = ({
  isOpen,
  token,
  initialData,
  onClose,
  onSuccess,
}) => {
  const isEditMode = Boolean(initialData);

  const [caseNumber, setCaseNumber] = useState('');
  const [patientRef, setPatientRef] = useState('');
  const [surgeonName, setSurgeonName] = useState('');
  const [implantType, setImplantType] = useState(IMPLANT_TYPES[0]);
  const [status, setStatus] = useState<CaseStatus>('Draft');
  const [priority, setPriority] = useState<CasePriority>('Medium');
  const [surgeryDate, setSurgeryDate] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Public Holiday API lookup state
  const [holidayCheckLoading, setHolidayCheckLoading] = useState(false);
  const [holidayInfo, setHolidayInfo] = useState<HolidayInfo | null>(null);

  useEffect(() => {
    if (initialData) {
      setCaseNumber(initialData.case_number);
      setPatientRef(initialData.patient_reference);
      setSurgeonName(initialData.surgeon_name);
      setImplantType(initialData.implant_type);
      setStatus(initialData.status);
      setPriority(initialData.priority);
      setSurgeryDate(initialData.surgery_date || '');
    } else {
      // Auto-generate fresh CASE number draft
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setCaseNumber(`CASE-${randomNum}`);
      setPatientRef(`PAT-${Math.floor(10000 + Math.random() * 90000)}`);
      setSurgeonName('');
      setImplantType(IMPLANT_TYPES[0]);
      setStatus('Draft');
      setPriority('Medium');
      setSurgeryDate('');
    }
    setErrors({});
    setGeneralError(null);
    setHolidayInfo(null);
  }, [initialData, isOpen]);

  // Check Public Holiday when surgery date changes
  useEffect(() => {
    if (!surgeryDate) {
      setHolidayInfo(null);
      return;
    }

    const checkHoliday = async () => {
      setHolidayCheckLoading(true);
      try {
        const res = await fetch(`/api/holidays?date=${surgeryDate}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data.isHoliday) {
            setHolidayInfo(data.data.holiday);
          } else {
            setHolidayInfo(null);
          }
        }
      } catch (e) {
        setHolidayInfo(null);
      } finally {
        setHolidayCheckLoading(false);
      }
    };

    checkHoliday();
  }, [surgeryDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setGeneralError(null);

    const payload = {
      case_number: caseNumber,
      patient_reference: patientRef,
      surgeon_name: surgeonName,
      implant_type: implantType,
      status,
      priority,
      surgery_date: surgeryDate || null,
    };

    try {
      const url = isEditMode
        ? `/api/cases/${initialData!.id}`
        : '/api/cases';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setGeneralError(data.message || 'Validation or authorization error.');
        }
        setSubmitting(false);
        return;
      }

      onSuccess(data.data);
      onClose();
    } catch (err) {
      setGeneralError('Network error trying to submit case details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {isEditMode ? `Edit Case (${caseNumber})` : 'Create Medical Case'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditMode
                ? 'Update implant case parameters and status'
                : 'Register a new implant case in the system'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* General Error Banner */}
        {generalError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Case Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Case Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                required
                className={`w-full px-3 py-2 border rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 ${
                  errors.case_number
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/50'
                    : 'border-slate-300 focus:ring-teal-500'
                }`}
                placeholder="e.g. CASE-0001"
              />
              {errors.case_number && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  {errors.case_number[0]}
                </p>
              )}
            </div>

            {/* Patient Reference */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Patient Reference Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={patientRef}
                onChange={(e) => setPatientRef(e.target.value)}
                required
                className={`w-full px-3 py-2 border rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 ${
                  errors.patient_reference
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/50'
                    : 'border-slate-300 focus:ring-teal-500'
                }`}
                placeholder="e.g. PAT-98123"
              />
              {errors.patient_reference && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  {errors.patient_reference[0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Surgeon Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Surgeon Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={surgeonName}
                onChange={(e) => setSurgeonName(e.target.value)}
                required
                className={`w-full px-3 py-2 border rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 ${
                  errors.surgeon_name
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/50'
                    : 'border-slate-300 focus:ring-teal-500'
                }`}
                placeholder="e.g. Dr. Sarah Jenkins"
              />
              {errors.surgeon_name && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  {errors.surgeon_name[0]}
                </p>
              )}
            </div>

            {/* Implant Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Implant Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={implantType}
                onChange={(e) => setImplantType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                {IMPLANT_TYPES.map((imp) => (
                  <option key={imp} value={imp}>
                    {imp}
                  </option>
                ))}
              </select>
              {errors.implant_type && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  {errors.implant_type[0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Workflow Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CaseStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-semibold"
              >
                {STATUS_LIST.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  {errors.status[0]}
                </p>
              )}
            </div>

            {/* Case Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority <span className="text-rose-500">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CasePriority)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-semibold"
              >
                {PRIORITY_LIST.map((pr) => (
                  <option key={pr} value={pr}>
                    {pr} Priority
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">
                  {errors.priority[0]}
                </p>
              )}
            </div>
          </div>

          {/* Surgery Date & Public Holiday Integration */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Surgery Date (Optional)
            </label>
            <div className="relative">
              <input
                type="date"
                value={surgeryDate}
                onChange={(e) => setSurgeryDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
            {errors.surgery_date && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                {errors.surgery_date[0]}
              </p>
            )}

            {/* Public Holiday Banner Alert */}
            {holidayCheckLoading && (
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span className="inline-block w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                Checking Nager.Date Public Holiday API...
              </p>
            )}

            {holidayInfo && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Public Holiday Alert!</p>
                  <p className="text-[11px] text-amber-800">
                    {surgeryDate} coincides with{' '}
                    <strong>{holidayInfo.name || holidayInfo.localName}</strong>.
                    Ensure operating room & surgical staff availability.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditMode ? 'Save Changes' : 'Create Case'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
