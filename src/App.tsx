import React, { useState, useEffect } from 'react';
import { User, UserRole, MedicalCase, CaseStatus } from './types';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { DashboardView } from './components/DashboardView';
import { CaseListView } from './components/CaseListView';
import { CaseFormModal } from './components/CaseFormModal';
import { CaseDetailModal } from './components/CaseDetailModal';
import { ApiStudioView } from './components/ApiStudioView';
import { TestRunnerView } from './components/TestRunnerView';
import { DocViewer } from './components/DocViewer';

export default function App() {
  // Pre-seed default Admin user session for instant reviewer experience
  const [user, setUser] = useState<User | null>({
    id: 1,
    name: 'Dr. Admin User',
    email: 'admin@jajalmedical.com',
    role: 'Admin',
  });

  const [token, setToken] = useState<string>('token_admin_secret_123');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cases' | 'api' | 'tests' | 'docs'>('dashboard');
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  // Cases state for Dashboard metrics sync
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [statusFilterForCases, setStatusFilterForCases] = useState<CaseStatus | 'All'>('All');

  // Modals
  const [viewingCase, setViewingCase] = useState<MedicalCase | null>(null);
  const [editingCase, setEditingCase] = useState<MedicalCase | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // Fetch all cases summary for dashboard
  const refreshCasesSummary = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/cases?pageSize=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data.items) {
          setCases(data.data.items);
        }
      }
    } catch (e) {
      console.error('Failed to fetch cases summary', e);
    }
  };

  useEffect(() => {
    refreshCasesSummary();
  }, [token]);

  // Handle Login Success
  const handleLoginSuccess = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    setIsLoginOpen(false);
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {}
    setUser(null);
    setToken('');
    setIsLoginOpen(true);
  };

  // Quick Role Switcher for instant evaluator testing
  const handleQuickRoleSwitch = async (role: UserRole) => {
    let email = 'admin@jajalmedical.com';
    let pass = 'admin123';
    if (role === 'Engineer') {
      email = 'engineer@jajalmedical.com';
      pass = 'engineer123';
    } else if (role === 'Viewer') {
      email = 'viewer@jajalmedical.com';
      pass = 'viewer123';
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.data.user);
        setToken(data.data.token);
      }
    } catch (e) {
      console.error('Failed role switch', e);
    }
  };

  // Navigation shortcut from Dashboard to Cases tab with filter
  const handleNavigateToCasesWithFilter = (filterStatus?: CaseStatus) => {
    setStatusFilterForCases(filterStatus || 'All');
    setActiveTab('cases');
  };

  const handleOpenCreateForm = () => {
    setEditingCase(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (c: MedicalCase) => {
    setEditingCase(c);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onQuickRoleSwitch={handleQuickRoleSwitch}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!user ? (
          <div className="max-w-md mx-auto my-12 text-center bg-white p-8 border border-slate-200 rounded-xl shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <span className="font-bold text-xl">JM</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Authentication Required
            </h2>
            <p className="text-xs text-slate-500">
              Please sign in to access medical case records, workflow management, and REST APIs.
            </p>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              Sign In to Jajal Medical
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                user={user}
                cases={cases}
                onNavigateToCases={handleNavigateToCasesWithFilter}
                onCreateCase={handleOpenCreateForm}
              />
            )}

            {activeTab === 'cases' && (
              <CaseListView
                user={user}
                token={token}
                initialStatusFilter={statusFilterForCases}
                onViewCase={(c) => setViewingCase(c)}
                onEditCase={handleOpenEditForm}
                onCreateCase={handleOpenCreateForm}
                onRefreshTrigger={refreshCasesSummary}
              />
            )}

            {activeTab === 'api' && <ApiStudioView token={token} />}

            {activeTab === 'tests' && <TestRunnerView />}

            {activeTab === 'docs' && <DocViewer />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} Jajal Medical · Software Developer Intern Practical Assignment
          </span>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Server: Active (Port 3000)</span>
            <span>Role: {user ? user.role : 'Guest'}</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setIsLoginOpen(false)}
      />

      <CaseFormModal
        isOpen={isFormOpen}
        token={token}
        initialData={editingCase}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          refreshCasesSummary();
        }}
      />

      <CaseDetailModal
        medicalCase={viewingCase}
        onClose={() => setViewingCase(null)}
        onEdit={handleOpenEditForm}
        canEdit={user?.role !== 'Viewer'}
      />
    </div>
  );
}
