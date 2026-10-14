import React, { useState } from 'react';
import { TestCaseResult } from '../types';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Clock,
  Terminal,
  ShieldAlert,
  Layers,
  FileCheck2,
} from 'lucide-react';

export const TestRunnerView: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [passedCount, setPassedCount] = useState<number | null>(null);
  const [failedCount, setFailedCount] = useState<number | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const runTestSuite = async () => {
    setRunning(true);
    const start = performance.now();

    try {
      const res = await fetch('/api/test-runner/execute', {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTestResults(data.data.results);
        setPassedCount(data.data.passedCount);
        setFailedCount(data.data.failedCount);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExecutionTime(Math.round(performance.now() - start));
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Suite Header */}
      <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
            Automated Feature Test Suite (Pest / PHPUnit)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Executes mandatory feature tests against API controllers, policy gates, and database indices
          </p>
        </div>

        <button
          onClick={runTestSuite}
          disabled={running}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
        >
          {running ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Executing Test Suite...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Run Automated Feature Tests
            </>
          )}
        </button>
      </div>

      {/* Summary Scorecard */}
      {passedCount !== null && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-800">
                Tests Passed
              </span>
              <p className="text-2xl font-bold font-mono text-emerald-950 mt-0.5">
                {passedCount} / {testResults.length}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>

          <div
            className={`${
              failedCount === 0
                ? 'bg-slate-50 border-slate-200 text-slate-600'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            } border rounded-xl p-4 flex items-center justify-between`}
          >
            <div>
              <span className="text-xs font-semibold">Tests Failed</span>
              <p className="text-2xl font-bold font-mono mt-0.5">{failedCount}</p>
            </div>
            <XCircle
              className={`w-8 h-8 ${
                failedCount === 0 ? 'text-slate-300' : 'text-rose-600'
              }`}
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">
                Total Execution Time
              </span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                {executionTime} ms
              </p>
            </div>
            <Clock className="w-8 h-8 text-teal-500" />
          </div>
        </div>
      )}

      {/* Test List Table / Cards */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Required Feature Tests (6 Spec Verifications)
          </span>
          <span className="text-xs text-slate-500">
            Pest / PHPUnit Feature Specs
          </span>
        </div>

        {testResults.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 text-sm">
              Ready to execute automated test runner
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Click "Run Automated Feature Tests" above to execute all 6 mandatory tests and verify role permissions.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {testResults.map((test) => (
              <div key={test.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    {test.status === 'passed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {test.id}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {test.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                          {test.reqId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {test.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center font-mono text-xs">
                    <span className="text-slate-400 text-[11px]">
                      {test.durationMs} ms
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-md font-bold uppercase text-[10px] ${
                        test.status === 'passed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>
                </div>

                {/* Test Logs */}
                {test.logs && test.logs.length > 0 && (
                  <div className="mt-3 bg-slate-900 text-emerald-400 p-3 rounded-lg text-xs font-mono space-y-1 overflow-x-auto">
                    {test.logs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-slate-500 select-none">›</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
