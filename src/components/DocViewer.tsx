import React, { useState } from 'react';
import { BookOpen, Database, ShieldCheck, Server, FileCode, CheckCircle2 } from 'lucide-react';

export const DocViewer: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'readme' | 'database' | 'traceability' | 'deployment'>('readme');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Project Documentation & Architecture Specs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Technical specs, MySQL database schema, traceability matrix, and AWS deployment guide
          </p>
        </div>

        {/* Doc Switcher Buttons */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1">
          <button
            onClick={() => setActiveDoc('readme')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeDoc === 'readme'
                ? 'bg-white text-teal-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            README.md
          </button>
          <button
            onClick={() => setActiveDoc('database')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeDoc === 'database'
                ? 'bg-white text-teal-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            docs/database.md
          </button>
          <button
            onClick={() => setActiveDoc('traceability')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeDoc === 'traceability'
                ? 'bg-white text-teal-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            docs/traceability.md
          </button>
          <button
            onClick={() => setActiveDoc('deployment')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeDoc === 'deployment'
                ? 'bg-white text-teal-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            docs/deployment.md
          </button>
        </div>
      </div>

      {/* Doc Content Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        {activeDoc === 'readme' && (
          <div className="prose prose-slate max-w-none space-y-4 text-xs text-slate-700">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">
              README.md - Project Overview & Tech Stack
            </h2>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Dummy Login Credentials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white border rounded-lg">
                  <span className="font-bold text-teal-700 block">Admin Role</span>
                  <span className="font-mono text-[11px] block text-slate-800">admin@jajalmedical.com</span>
                  <span className="font-mono text-[11px] text-slate-500">Password: admin123</span>
                </div>
                <div className="p-3 bg-white border rounded-lg">
                  <span className="font-bold text-indigo-700 block">Engineer Role</span>
                  <span className="font-mono text-[11px] block text-slate-800">engineer@jajalmedical.com</span>
                  <span className="font-mono text-[11px] text-slate-500">Password: engineer123</span>
                </div>
                <div className="p-3 bg-white border rounded-lg">
                  <span className="font-bold text-amber-700 block">Viewer Role</span>
                  <span className="font-mono text-[11px] block text-slate-800">viewer@jajalmedical.com</span>
                  <span className="font-mono text-[11px] text-slate-500">Password: viewer123</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Key Endpoints</h3>
              <ul className="list-disc pl-5 space-y-1 font-mono text-[11px]">
                <li>POST /api/login - Get Sanctum Bearer Token</li>
                <li>POST /api/logout - Revoke Token</li>
                <li>GET /api/cases - List Cases (Paginated, Search, Status & Priority filters, Column sorting)</li>
                <li>POST /api/cases - Create Case (Admin & Engineer allowed)</li>
                <li>GET /api/cases/:id - Fetch Single Case</li>
                <li>PUT /api/cases/:id - Update Case (Admin & Engineer allowed)</li>
                <li>DELETE /api/cases/:id - Delete Case (Admin ONLY - 403 Forbidden for Viewer/Engineer)</li>
              </ul>
            </div>
          </div>
        )}

        {activeDoc === 'database' && (
          <div className="space-y-4 text-xs text-slate-700">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-600" />
              docs/database.md - MySQL Schema & Relationships
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                <h3 className="font-bold text-slate-900 text-sm mb-2">1. `users` Table</h3>
                <ul className="space-y-1 font-mono text-[11px] text-slate-800">
                  <li>id: BIGINT UNSIGNED (PK, AUTO_INCREMENT)</li>
                  <li>name: VARCHAR(255) NOT NULL</li>
                  <li>email: VARCHAR(255) NOT NULL, UNIQUE INDEX</li>
                  <li>password: VARCHAR(255) NOT NULL</li>
                  <li>role: ENUM('Admin', 'Engineer', 'Viewer')</li>
                  <li>created_at / updated_at: TIMESTAMP</li>
                </ul>
              </div>

              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                <h3 className="font-bold text-slate-900 text-sm mb-2">2. `cases` Table</h3>
                <ul className="space-y-1 font-mono text-[11px] text-slate-800">
                  <li>id: BIGINT UNSIGNED (PK, AUTO_INCREMENT)</li>
                  <li>case_number: VARCHAR(50) NOT NULL, UNIQUE INDEX</li>
                  <li>patient_reference: VARCHAR(50) NOT NULL</li>
                  <li>surgeon_name: VARCHAR(255) NOT NULL</li>
                  <li>implant_type: VARCHAR(255) NOT NULL</li>
                  <li>status: ENUM(...) NOT NULL, INDEX</li>
                  <li>priority: ENUM('Low', 'Medium', 'High')</li>
                  <li>surgery_date: DATE NULLABLE</li>
                  <li>created_by: BIGINT UNSIGNED (FK -&gt; users.id)</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-900 text-emerald-400 font-mono p-4 rounded-xl text-xs space-y-1 overflow-x-auto">
              <p className="text-slate-500">// ER Diagram</p>
              <p>users (id [PK], email [UNQ], name, role)</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;│</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;└─1:N───&gt; cases (id [PK], case_number [UNQ], status [IDX], created_by [FK])</p>
            </div>
          </div>
        )}

        {activeDoc === 'traceability' && (
          <div className="space-y-4 text-xs text-slate-700">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              docs/traceability.md - Medical Software Traceability Matrix
            </h2>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b font-semibold text-slate-700">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Requirement (input)</th>
                    <th className="p-3">Implementation (output)</th>
                    <th className="p-3">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr>
                    <td className="p-3 font-bold text-teal-700">REQ-001</td>
                    <td className="p-3 font-sans">Admin shall be able to create a case</td>
                    <td className="p-3">CaseController@store + CaseFormModal.tsx</td>
                    <td className="p-3 text-emerald-700 font-semibold">Feature test: Admin creates case</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-teal-700">REQ-002</td>
                    <td className="p-3 font-sans">Case Number shall be unique</td>
                    <td className="p-3">Unique DB index + StoreCaseRequest rule</td>
                    <td className="p-3 text-emerald-700 font-semibold">Feature test: duplicate rejected (422)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-teal-700">REQ-003</td>
                    <td className="p-3 font-sans">Only Admin shall delete cases</td>
                    <td className="p-3">CasePolicy@delete policy check</td>
                    <td className="p-3 text-emerald-700 font-semibold">Feature test: viewer gets 403</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-teal-700">REQ-004</td>
                    <td className="p-3 font-sans">Valid login succeeds</td>
                    <td className="p-3">AuthController@login</td>
                    <td className="p-3 text-emerald-700 font-semibold">Feature test: login returns Sanctum token</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-teal-700">REQ-005</td>
                    <td className="p-3 font-sans">Invalid login rejected</td>
                    <td className="p-3">AuthController@login validation</td>
                    <td className="p-3 text-emerald-700 font-semibold">Feature test: invalid credentials get 401</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-teal-700">REQ-006</td>
                    <td className="p-3 font-sans">Guest cannot open protected case pages</td>
                    <td className="p-3">AuthenticateToken middleware</td>
                    <td className="p-3 text-emerald-700 font-semibold">Feature test: guest gets 401</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeDoc === 'deployment' && (
          <div className="space-y-4 text-xs text-slate-700">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-teal-600" />
              docs/deployment.md - AWS Hosting Guide
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-xl bg-slate-50 space-y-2">
                <h3 className="font-bold text-slate-900">AWS Infrastructure Component Selection</h3>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>AWS EC2</strong>: t3.small Ubuntu 22.04 LTS instance with PM2 and Nginx reverse proxy.</li>
                  <li><strong>AWS RDS MySQL</strong>: Multi-AZ MySQL 8.0 instance for robust transaction storage.</li>
                  <li><strong>AWS S3</strong>: Storage for case documentation uploads and static backups.</li>
                  <li><strong>AWS Security Groups</strong>: Port 80/443 public ingress; Port 3306 restricted to EC2 SG.</li>
                </ul>
              </div>

              <div className="p-4 border rounded-xl bg-slate-50 space-y-2">
                <h3 className="font-bold text-slate-900">Nginx & Certbot SSL Setup</h3>
                <pre className="text-[10px] bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono overflow-x-auto">
{`server {
  listen 80;
  server_name medical.jajal.com;
  location / {
    proxy_pass http://localhost:3000;
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
