/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#ffffff',
        'paper-dark': '#f8fafc',
        ink: '#0f172a',
        accent: '#4f46e5',         // Switched from boring blue to vibrant modern Indigo
        'accent-hover': '#4338ca',   // Rich deeper Indigo hover state
        muted: '#64748b',
        brand: {
          light: '#f0f3ff',
          subtle: '#e0e7ff'
        }
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
