import { IconCode } from "./icons";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-inset ring-white/20">
        <IconCode className="h-5 w-5" />
        <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-indigo-400/40 to-violet-600/0 blur-[6px]" />
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight text-slate-100">
          AI Code Auditor{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Pro
          </span>
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
          Static Analysis Studio
        </span>
      </div>
    </div>
  );
}