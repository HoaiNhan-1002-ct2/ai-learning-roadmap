/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
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
        bgGlass: "rgba(255, 255, 255, 0.7)",
        borderGlass: "rgba(255, 255, 255, 0.5)",
        textPrimary: "#0f172a",
        textSecondary: "#475569",
        textMuted: "#94a3b8",
        accentPrimary: "#8b5cf6",    // Violet 500
        accentSecondary: "#ec4899",  // Pink 500
        accentTertiary: "#3b82f6",   // Blue 500
        success: "#059669",
        warning: "#d97706",
        danger: "#dc2626",
        info: "#0284c7",
      },
      animation: {
        'blob': 'blob 10s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [
    typography,
  ],
}
