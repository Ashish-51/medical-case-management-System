import React, { useState } from 'react';
import {
  Terminal,
  Send,
  Download,
  Copy,
  Check,
  ShieldAlert,
  Play,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

interface ApiStudioViewProps {
  token: string;
}

export const ApiStudioView: React.FC<ApiStudioViewProps> = ({ token }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET_CASES');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [urlPath, setUrlPath] = useState('/api/cases?page=1&pageSize=10');
  const [authToken, setAuthToken] = useState(token);
  const [requestBody, setRequestBody] = useState('');

  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseBody, setResponseBody] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Quick Preset Selector
  const loadPreset = (presetKey: string) => {
    setSelectedEndpoint(presetKey);
    switch (presetKey) {
      case 'LOGIN_ADMIN':
        setMethod('POST');
        setUrlPath('/api/login');
        setRequestBody(
          JSON.stringify(
            { email: 'admin@jajalmedical.com', password: 'admin123' },
            null,
            2
          )
        );
        break;
      case 'LOGIN_VIEWER':
        setMethod('POST');
        setUrlPath('/api/login');
        setRequestBody(
          JSON.stringify(
            { email: 'viewer@jajalmedical.com', password: 'viewer123' },
            null,
            2
          )
        );
        break;
      case 'GET_CASES':
        setMethod('GET');
        setUrlPath('/api/cases?page=1&pageSize=10');
        setRequestBody('');
        break;
      case 'CREATE_CASE':
        setMethod('POST');
        setUrlPath('/api/cases');
        setRequestBody(
          JSON.stringify(
            {
              case_number: `CASE-API-${Math.floor(100 + Math.random() * 900)}`,
              patient_reference: 'PAT-88123',
              surgeon_name: 'Dr. Sarah Jenkins',
              implant_type: 'Knee Arthroplasty System',
              status: 'Planning',
              priority: 'High',
              surgery_date: '2026-11-15',
            },
            null,
            2
          )
        );
        break;
      case 'CREATE_DUPLICATE_FAIL':
        setMethod('POST');
        setUrlPath('/api/cases');
        setRequestBody(
          JSON.stringify(
            {
              case_number: 'CASE-0001', // duplicate!
              patient_reference: 'PAT-00000',
              surgeon_name: 'Dr. Test',
              implant_type: 'Hip Stem Matrix',
              status: 'Draft',
              priority: 'Low',
            },
            null,
            2
          )
        );
        break;
      case 'GET_SINGLE_CASE':
        setMethod('GET');
        setUrlPath('/api/cases/1');
        setRequestBody('');
        break;
      case 'UPDATE_CASE':
        setMethod('PUT');
        setUrlPath('/api/cases/1');
        setRequestBody(
          JSON.stringify(
            {
              status: 'Approved',
              priority: 'High',
            },
            null,
            2
          )
        );
        break;
      case 'DELETE_CASE_ADMIN':
        setMethod('DELETE');
        setUrlPath('/api/cases/1');
        setRequestBody('');
        break;
      default:
        break;
    }
  };

  const handleExecuteRequest = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseBody(null);
    setResponseTime(null);

    const startTime = performance.now();

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const options: RequestInit = {
        method,
        headers,
      };

      if ((method === 'POST' || method === 'PUT') && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(urlPath, options);
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(res.status);

      const resHeaders: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        resHeaders[key] = val;
      });
      setResponseHeaders(resHeaders);

      const data = await res.json();
      setResponseBody(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponseStatus(500);
      setResponseBody(
        JSON.stringify(
          { success: false, message: err.message || 'Request execution error' },
          null,
          2
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCollection = () => {
    window.open('/docs/postman_collection.json', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-teal-600" />
            Interactive REST API Studio
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Test Sanctum token authentication, role policy checks, and JSON response payloads
          </p>
        </div>

        <button
          onClick={handleDownloadCollection}
          className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-teal-600" />
          Export Postman Collection
        </button>
      </div>

      {/* Preset Request Buttons */}
      <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 space-y-2">
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Quick Request Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadPreset('LOGIN_ADMIN')}
            className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 shadow-2xs transition-colors"
          >
            POST /api/login (Admin)
          </button>
          <button
            onClick={() => loadPreset('GET_CASES')}
            className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 shadow-2xs transition-colors"
          >
            GET /api/cases (Paginated)
          </button>
          <button
            onClick={() => loadPreset('CREATE_CASE')}
            className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 shadow-2xs transition-colors"
          >
            POST /api/cases (Create)
          </button>
          <button
            onClick={() => loadPreset('CREATE_DUPLICATE_FAIL')}
            className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-800 text-xs font-medium rounded-lg border border-rose-200 shadow-2xs transition-colors"
          >
            POST /api/cases (422 Duplicate Fail)
          </button>
          <button
            onClick={() => loadPreset('UPDATE_CASE')}
            className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 shadow-2xs transition-colors"
          >
            PUT /api/cases/1 (Update)
          </button>
          <button
            onClick={() => loadPreset('DELETE_CASE_ADMIN')}
            className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 shadow-2xs transition-colors"
          >
            DELETE /api/cases/1 (Admin)
          </button>
        </div>
      </div>

      {/* Main Request / Response Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Request Builder */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Request Configuration
          </h2>

          {/* HTTP Method + Endpoint Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Method & Request Path
            </label>
            <div className="flex gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-slate-50"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>

              <input
                type="text"
                value={urlPath}
                onChange={(e) => setUrlPath(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Bearer Token */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Authorization Bearer Token (Sanctum)
            </label>
            <input
              type="text"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              placeholder="e.g. token_admin_secret_123"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-slate-50"
            />
          </div>

          {/* Request Body JSON */}
          {(method === 'POST' || method === 'PUT') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                JSON Body
              </label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={8}
                className="w-full p-3 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 bg-slate-900/95 text-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}

          <button
            onClick={handleExecuteRequest}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Request
              </>
            )}
          </button>
        </div>

        {/* Right Column: Response Inspector */}
        <div className="bg-slate-900 rounded-xl p-5 shadow-2xs text-slate-100 space-y-3 font-mono flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Response Output
              </span>

              {responseStatus !== null && (
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold ${
                      responseStatus >= 200 && responseStatus < 300
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : responseStatus === 401 || responseStatus === 403
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : responseStatus === 422
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    HTTP {responseStatus}
                  </span>

                  {responseTime !== null && (
                    <span className="text-slate-400 text-[11px]">
                      {responseTime} ms
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-3">
              {responseBody !== null ? (
                <pre className="text-xs text-emerald-400 bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto max-h-[360px] whitespace-pre-wrap leading-relaxed">
                  {responseBody}
                </pre>
              ) : (
                <div className="py-20 text-center text-slate-600 text-xs italic">
                  Click "Send Request" or select a preset above to inspect response payload
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Payload Format: JSON Standard</span>
            <span>Content-Type: application/json</span>
          </div>
        </div>
      </div>
    </div>
  );
};
