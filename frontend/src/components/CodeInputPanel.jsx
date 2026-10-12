import { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { IconFileCheck, IconGlobe, IconRocket, IconSpinner, IconUpload } from "./icons";

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "php", label: "PHP" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "java", label: "Java" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
];

const PRIMARY_EXPLAIN_LANGUAGES = [
  { value: "ur-hi", label: "Roman Urdu / Hindi" },
  { value: "hi", label: "Hindi" },
  { value: "en", label: "English" },
];

const GLOBAL_EXPLAIN_LANGUAGES = [
  { value: "ar", label: "Arabic" },
  { value: "bn", label: "Bengali" },
  { value: "zh", label: "Chinese (Simplified)" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "pt", label: "Portuguese" },
  { value: "es", label: "Spanish" },
  { value: "tr", label: "Turkish" },
  { value: "ur", label: "Urdu" },
];

const EXT_TO_LANG = {
  ".js": "javascript",
  ".jsx": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".ts": "typescript",
  ".tsx": "typescript",
  ".py": "python",
  ".php": "php",
  ".cpp": "cpp",
  ".cc": "cpp",
  ".cxx": "cpp",
  ".hpp": "cpp",
  ".c": "c",
  ".java": "java",
  ".rs": "rust",
  ".go": "go",
};

function detectLanguage(fileName) {
  const dot = fileName.lastIndexOf(".");
  if (dot < 0) return null;
  return EXT_TO_LANG[fileName.slice(dot).toLowerCase()] || null;
}

export default function CodeInputPanel({
  code,
  setCode,
  language,
  setLanguage,
  explainLanguage,
  setExplainLanguage,
  fileName,
  onFileSelect,
  onAnalyze,
  loading,
}) {
  const fileInputRef = useRef(null);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const content = await file.text();
      onFileSelect(file.name, content);
      const detected = detectLanguage(file.name);
      if (detected) setLanguage(detected);
    } catch {
      onFileSelect(file.name, "");
    }
    event.target.value = "";
  };

  return (
    <section className="flex h-[560px] flex-col rounded-2xl border border-slate-800/80 bg-slate-900/50 shadow-2xl shadow-purple-500/5 backdrop-blur-xl lg:h-[640px]">
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-900/40 px-4 py-3 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
          </span>
          <h2 className="text-sm font-semibold tracking-tight text-slate-200">
            Source Code Input
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {fileName && (
            <span className="hidden max-w-[140px] items-center gap-1.5 truncate rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-300 sm:inline-flex">
              <IconFileCheck className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{fileName}</span>
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".js,.jsx,.mjs,.cjs,.ts,.tsx,.py,.php,.cpp,.cc,.cxx,.hpp,.c,.java,.rs,.go,.txt"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 transition-colors hover:border-indigo-500/50 hover:text-indigo-300"
          >
            <IconUpload className="h-3.5 w-3.5" />
            Import
          </button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="cursor-pointer rounded-lg border border-slate-700/80 bg-slate-800/60 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                {opt.label}
              </option>
            ))}
          </select>
          <span className="hidden h-5 w-px bg-slate-700/70 sm:block" />
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 px-2 py-1.5">
            <IconGlobe className="h-3.5 w-3.5 shrink-0 text-violet-400" />
            <select
              value={explainLanguage}
              onChange={(e) => setExplainLanguage(e.target.value)}
              aria-label="Analysis response language"
              className="max-w-[150px] cursor-pointer appearance-none bg-transparent text-[11px] font-semibold text-slate-200 focus:outline-none"
            >
              <optgroup label="Primary languages" className="bg-slate-900 text-slate-400">
                {PRIMARY_EXPLAIN_LANGUAGES.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                    {opt.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Global languages" className="bg-slate-900 text-slate-400">
                {GLOBAL_EXPLAIN_LANGUAGES.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden border-b border-slate-800/60">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            padding: { top: 14 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-3 bg-slate-900/40 px-4 py-3 rounded-b-2xl">
        <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
          {code.length.toLocaleString()} chars
          <span className="mx-1.5 text-slate-700">•</span>
          {language}
        </p>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={loading}
          className="group relative inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:shadow-glow-indigo hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
        >
          {loading ? (
            <IconSpinner className="h-4 w-4 animate-spin" />
          ) : (
            <IconRocket className="h-4 w-4 opacity-90 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          )}
          {loading ? "Auditing code…" : "Run AI Code Audit"}
        </button>
      </div>
    </section>
  );
}