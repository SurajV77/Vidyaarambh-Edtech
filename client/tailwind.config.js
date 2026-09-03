/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1F33', // Deep Obsidian Navy
          900: '#102A43', // Primary Navy
          800: '#1B3A5A',
          700: '#243B53',
          600: '#334E68',
          500: '#486581',
          400: '#627D98',
          300: '#9FB3C8', // Clear contrast on dark backgrounds
          200: '#D9E2EC',
          100: '#F0F4F8',
          50: '#F7F9FB',
        },
        gold: {
          800: '#78350F', // Ultra-deep gold
          700: '#92400E', // High-contrast rich bronze gold (contrast > 5.5:1 on light backgrounds)
          600: '#A16207', // Dark gold
          500: '#D99A2B', // Warm Gold for buttons & accent lines
          400: '#E6AC44',
          300: '#F4C873',
          200: '#FBE4A8',
          100: '#FDF4DC',
          50: '#FDF9EE',
        },
        saffron: {
          700: '#B45309',
          600: '#C77014',
          500: '#E58A22',
          400: '#F0A142',
          100: '#FDEFD9',
          50: '#FEF8F0',
        },
        ivory: {
          DEFAULT: '#FAF8F3', // Warm Ivory Page Base
          sand: '#F2EDE3',    // Soft Sand for panels & secondary cards
          paper: '#FFFFFF',   // Crisp white paper surface
        },
        borderWarm: '#D8D1C3', // Slightly strengthened border for distinct separation
        ink: {
          950: '#0F172A',
          900: '#17202A', // Primary Text (Deep Charcoal)
          800: '#1E293B', // High-contrast body
          700: '#334155', // High-contrast secondary
          600: '#475569', // Clear descriptive text
          500: '#475569', // Darkened from #667085 for crystal-clear readability
          400: '#52606D', // Darkened from #94A3B8 (now fully readable even at 10px/11px)
          300: '#64748B',
        },
        academic: {
          green: '#1E6346',     // Darkened for crisp contrast (was #2F7D5C)
          greenBg: '#EBF7F0',
          amber: '#A15C07',     // Darkened for crisp contrast (was #C98518)
          amberBg: '#FEF6E9',
          crimson: '#9E2A2B',   // Darkened for crisp contrast (was #B54747)
          crimsonBg: '#FDF2F2',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'paper-sm': '0 1px 2px rgba(16, 42, 67, 0.06)',
        'paper': '0 2px 8px -1px rgba(16, 42, 67, 0.08), 0 1px 3px rgba(16, 42, 67, 0.04)',
        'paper-elevated': '0 10px 25px -4px rgba(16, 42, 67, 0.1), 0 4px 6px -2px rgba(16, 42, 67, 0.05)',
      },
      borderRadius: {
        'academic': '8px',
        'academic-md': '10px',
        'academic-lg': '12px',
      }
    },
  },
  plugins: [],
}
