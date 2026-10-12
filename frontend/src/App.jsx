import { useState } from "react";
import Logo from "./components/Logo";
import CodeInputPanel from "./components/CodeInputPanel";
import AuditPanel from "./components/AuditPanel";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const DEFAULT_CODE = `// Paste your buggy code here to run the AI audit...
function add(a, b) {
    return a + b
}`;

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("javascript");
  const [explainLanguage, setExplainLanguage] = useState("en");
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [scanId, setScanId] = useState(0);

  const handleFileSelect = (name, content) => {
    setFileName(name);
    setCode(content);
  };

  const handleAnalyze = async () => {
    if (!code.trim() || loading) return;
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const formData = new FormData();
      formData.append("code", code);
      formData.append("language", language);
      formData.append("explain_language", explainLanguage);

      setScanId((id) => id + 1);

      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (response.ok) {
        setReport(result.data);
      } else {
        setError(result.detail || "Something went wrong.");
      }
    } catch {
      setError("Failed to connect to backend server. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/3 h-[420px] w-[420px] rounded-full bg-indigo-600/20 blur-[140px]" />
        <div className="absolute -right-24 top-1/3 h-[380px] w-[380px] rounded-full bg-violet-600/15 blur-[140px]" />
        <div className="absolute -bottom-40 -left-24 h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,27,75,0.25),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 sm:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              v2.0 Production
            </span>
            <p className="whitespace-nowrap text-[11px] text-slate-500">
              Crafted by{" "}
              <span className="font-semibold text-slate-300">Code.with.Sarim</span>
            </p>
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-[1600px] flex-1 px-5 py-6 sm:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Senior-level code audit,{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                in seconds
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Paste or upload source code and get bugs, vulnerabilities, performance issues, and a fixed version.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <CodeInputPanel
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            explainLanguage={explainLanguage}
            setExplainLanguage={setExplainLanguage}
            fileName={fileName}
            onFileSelect={handleFileSelect}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
          <AuditPanel
            key={scanId}
            report={report}
            error={error}
            loading={loading}
            language={language}
          />
        </div>
      </main>
    </div>
  );
}