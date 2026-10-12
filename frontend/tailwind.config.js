/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-indigo': '0 0 24px rgba(99, 102, 241, 0.35)',
        'glow-violet': '0 0 40px rgba(139, 92, 246, 0.25)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
    },
  },
  plugins: [],
}