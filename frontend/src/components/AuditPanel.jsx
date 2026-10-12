import { useState } from "react";
import Editor from "@monaco-editor/react";
import {
  IconBug,
  IconCheck,
  IconCopy,
  IconShield,
  IconSparkles,
  IconSpinner,
  IconZap,
} from "./icons";

const TABS = [
  {
    key: "bugs",
    label: "Critical Bugs",
    field: "critical_bugs",
    icon: IconBug,
    dot: "bg-red-400",
    chip: "bg-red-500/10 border-red-500/25 text-red-400",
    item: "border-red-500/15 bg-red-500/[0.06] text-red-100",
    bullet: "bg-red-400",
  },
  {
    key: "security",
    label: "Security Risks",
    field: "security_vulnerabilities",
    icon: IconShield,
    dot: "bg-amber-400",
    chip: "bg-amber-500/10 border-amber-500/25 text-amber-400",
    item: "border-amber-500/15 bg-amber-500/[0.06] text-amber-100",
    bullet: "bg-amber-400",
  },
  {
    key: "performance",
    label: "Performance",
    field: "performance_issues",
    icon: IconZap,
    dot: "bg-sky-400",
    chip: "bg-sky-500/10 border-sky-500/25 text-sky-400",
    item: "border-sky-500/15 bg-sky-500/[0.06] text-sky-100",
    bullet: "bg-sky-400",
  },
];

const STATUS = {
  idle: { label: "Ready", className: "border-slate-600/40 bg-slate-700/20 text-slate-400" },
  loading: { label: "Analyzing", className: "border-indigo-500/40 bg-indigo-500/10 text-indigo-400" },
  done: { label: "Complete", className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" },
  error: { label: "Error", className: "border-red-500/40 bg-red-500/10 text-red-400" },
};

export default function AuditPanel({ report, error, loading, language }) {
  const [tab, setTab] = useState("bugs");
  const [copied, setCopied] = useState(false);

  const activeTab = TABS.find((t) => t.key === tab);
  const counts = TABS.reduce((acc, t) => {
    acc[t.field] = report && Array.isArray(report[t.field]) ? report[t.field].length : 0;
    return acc;
  }, {});
  const totalIssues = TABS.reduce((sum, t) => sum + counts[t.field], 0);
  const items = report && Array.isArray(report[activeTab.field]) ? report[activeTab.field] : [];

  const status = loading ? STATUS.loading : error ? STATUS.error : report ? STATUS.done : STATUS.idle;

  const copyRefactored = async () => {
    if (!report?.refactored_code) return;
    try {
      await navigator.clipboard.writeText(report.refactored_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="flex h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 shadow-2xl shadow-purple-500/5 backdrop-blur-xl lg:h-[640px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-900/40 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <IconSparkles className="h-4 w-4 text-violet-400" />
          <h2 className="text-sm font-semibold tracking-tight text-slate-200">
            AI Audit &amp; Refactored Output
          </h2>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${status.className}`}
        >
          {loading && <IconSpinner className="h-3 w-3 animate-spin" />}
          <span className="relative flex h-1.5 w-1.5">
            {!loading && (
              <span
                className={`absolute h-full w-full animate-ping rounded-full opacity-70 ${status.dot ?? "bg-slate-400"}`}
              />
            )}
            <span className={`relative h-1.5 w-1.5 rounded-full ${status.dot ?? "bg-slate-400"}`} />
          </span>
          {status.label}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {error && (
          <div className="animate-fade-up rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-300">
            <p className="font-semibold text-red-400">Audit failed</p>
            <p className="mt-1 text-xs leading-relaxed text-red-300/90">{error}</p>
          </div>
        )}

        {!report && !error && !loading && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800/30 text-slate-600">
              <IconBug className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300">No analysis generated yet</p>
              <p className="mt-1 max-w-[260px] text-xs leading-relaxed text-slate-500">
                Paste code on the left and hit "Run AI Code Audit" to receive a senior-level review.
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
              <div className="absolute inset-2 rounded-full bg-indigo-500/10" />
              <IconSparkles className="relative h-7 w-7 animate-pulse text-indigo-400" />
            </div>
            <div className="w-full max-w-[280px] space-y-2">
              <p className="text-sm font-medium text-indigo-300">
                Deep-scanning code semantics…
              </p>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              </div>
            </div>
          </div>
        )}

        {report && !loading && (
          <div className="animate-fade-up space-y-4">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
              <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-400">
                <IconSparkles className="h-3.5 w-3.5" />
                Executive Summary
              </p>
              <p className="text-[13px] leading-relaxed text-slate-200">
                {report.summary || "No summary provided."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${
                    tab === t.key
                      ? "border-slate-600/60 bg-slate-800/70 shadow-lg"
                      : "border-slate-800/80 bg-slate-900/40 hover:border-slate-700/70 hover:bg-slate-800/40"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
                    {t.label}
                  </span>
                  <span className="text-lg font-bold tabular-nums text-slate-100">
                    {counts[t.field]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all ${
                    tab === t.key
                      ? `${t.chip} ring-1 ring-white/5`
                      : "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                  <span
                    className={`rounded-full px-1.5 text-[10px] font-bold tabular-nums ${
                      tab === t.key
                        ? "bg-white/10"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {counts[t.field]}
                  </span>
                </button>
              ))}
              {totalIssues === 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-400">
                  <IconCheck className="h-3.5 w-3.5" />
                  No issues detected
                </span>
              )}
            </div>

            <div>
              {items.length > 0 ? (
                <ul className="space-y-2">
                  {items.map((item, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed ${activeTab.item}`}
                    >
                      <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${activeTab.bullet}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40 p-3 text-xs text-slate-500">
                  <IconCheck className={`h-4 w-4 shrink-0 ${activeTab.dot}`} />
                  No {activeTab.label.toLowerCase()} found in this scan.
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/40">
              <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 px-3 py-2.5">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-glow-emerald" />
                  Refactored Code
                </span>
                <button
                  type="button"
                  onClick={copyRefactored}
                  disabled={!report.refactored_code}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    copied
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-slate-700 hover:border-indigo-500/50 hover:text-indigo-300"
                  }`}
                >
                  {copied ? <IconCheck className="h-3.5 w-3.5" /> : <IconCopy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy Code"}
                </button>
              </div>
              <div className="h-[190px]">
                <Editor
                  height="100%"
                  language={language}
                  theme="vs-dark"
                  value={report.refactored_code || ""}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}