import React from 'react';
import { User, UserRole } from '../types';
import {
  Activity,
  LayoutDashboard,
  FileSpreadsheet,
  Terminal,
  CheckCircle2,
  BookOpen,
  LogOut,
  UserCheck,
  Shield,
  Layers,
  Eye,
} from 'lucide-react';

interface HeaderProps {
  user: User | null;
  activeTab: 'dashboard' | 'cases' | 'api' | 'tests' | 'docs';
  setActiveTab: (tab: 'dashboard' | 'cases' | 'api' | 'tests' | 'docs') => void;
  onLogout: () => void;
  onQuickRoleSwitch: (role: UserRole) => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  onQuickRoleSwitch,
  onOpenLogin,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight">
                Jajal Medical
              </span>
              <span className="text-[11px] font-medium text-slate-500 block leading-none">
                Implant Case Platform
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          {user ? (
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-slate-100 text-teal-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab('cases')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'cases'
                    ? 'bg-slate-100 text-teal-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                Case Management
              </button>

              <button
                onClick={() => setActiveTab('api')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'api'
                    ? 'bg-slate-100 text-teal-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Terminal className="w-4 h-4" />
                REST API Studio
              </button>

              <button
                onClick={() => setActiveTab('tests')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'tests'
                    ? 'bg-slate-100 text-teal-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Automated Tests
              </button>

              <button
                onClick={() => setActiveTab('docs')}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'docs'
                    ? 'bg-slate-100 text-teal-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Docs & Schema
              </button>
            </nav>
          ) : null}

          {/* User Account / Preset Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Role Switcher Pills for Testing */}
                <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-2">
                    Switch Role:
                  </span>
                  <button
                    onClick={() => onQuickRoleSwitch('Admin')}
                    className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                      user.role === 'Admin'
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Switch to Admin role"
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => onQuickRoleSwitch('Engineer')}
                    className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                      user.role === 'Engineer'
                        ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Switch to Engineer role"
                  >
                    Engineer
                  </button>
                  <button
                    onClick={() => onQuickRoleSwitch('Viewer')}
                    className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                      user.role === 'Viewer'
                        ? 'bg-white text-amber-700 shadow-xs font-semibold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Switch to Viewer role"
                  >
                    Viewer
                  </button>
                </div>

                {/* User Info Badge */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-slate-900 leading-none">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {user.role} Role
                    </p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        {user ? (
          <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`p-2 text-xs flex flex-col items-center gap-1 ${
                activeTab === 'dashboard' ? 'text-teal-600 font-bold' : 'text-slate-500'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dash
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`p-2 text-xs flex flex-col items-center gap-1 ${
                activeTab === 'cases' ? 'text-teal-600 font-bold' : 'text-slate-500'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Cases
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`p-2 text-xs flex flex-col items-center gap-1 ${
                activeTab === 'api' ? 'text-teal-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Terminal className="w-4 h-4" />
              API
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`p-2 text-xs flex flex-col items-center gap-1 ${
                activeTab === 'tests' ? 'text-teal-600 font-bold' : 'text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Tests
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`p-2 text-xs flex flex-col items-center gap-1 ${
                activeTab === 'docs' ? 'text-teal-600 font-bold' : 'text-slate-500'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Docs
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};
