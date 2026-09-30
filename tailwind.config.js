/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        selfit: {
          red: '#ef0015',
          redDark: '#bd0011',
          ink: '#0f172a',
          night: '#030406',
          panel: '#111827',
          muted: '#64748b',
          line: '#dbe3ef',
        },
      },
      boxShadow: {
        panel: '0 16px 50px rgba(15, 23, 42, 0.09)',
        red: '0 12px 28px rgba(239, 0, 21, 0.24)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
