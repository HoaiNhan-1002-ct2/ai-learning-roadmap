/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: "#f8fafc",
        bgSidebar: "#ffffff",
        bgGlass: "#ffffff",
        borderGlass: "#e2e8f0",
        textPrimary: "#1e293b",
        textSecondary: "#64748b",
        textMuted: "#94a3b8",
        accentPrimary: "#3b82f6",
        accentSecondary: "#2563eb",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#3b82f6",
      }
    },
  },
  plugins: [],
}
