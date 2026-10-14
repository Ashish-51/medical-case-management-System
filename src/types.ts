export type UserRole = 'Admin' | 'Engineer' | 'Viewer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
}

export type CaseStatus =
  | 'Draft'
  | 'Planning'
  | 'In Review'
  | 'Approved'
  | 'Completed'
  | 'Cancelled';

export type CasePriority = 'Low' | 'Medium' | 'High';

export interface MedicalCase {
  id: number;
  case_number: string;
  patient_reference: string;
  surgeon_name: string;
  implant_type: string;
  status: CaseStatus;
  priority: CasePriority;
  surgery_date: string | null;
  created_by: number;
  creator_name?: string;
  creator_email?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TestCaseResult {
  id: string;
  reqId: string;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'pending';
  durationMs: number;
  error?: string;
  logs: string[];
}

export interface HolidayInfo {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
}

export const STATUS_LIST: CaseStatus[] = [
  'Draft',
  'Planning',
  'In Review',
  'Approved',
  'Completed',
  'Cancelled',
];

export const PRIORITY_LIST: CasePriority[] = ['Low', 'Medium', 'High'];

export const IMPLANT_TYPES = [
  'Knee Arthroplasty System',
  'Spinal Fusion Cage',
  'Hip Stem Matrix',
  'Dental Titanium Implant',
  'Cardiac Pacemaker Lead',
  'Vascular Stent Graft',
  'Cochlear Implant Array',
  'Trauma Bone Plate',
  'Ophthalmic Intraocular Lens',
  'Shoulder Hemiarthroplasty',
];
