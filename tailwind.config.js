/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        flexrads: {
          orange: {
            light: '#FF8C60',
            DEFAULT: '#FF6600',
            dark: '#E65A00',
          },
          red: {
            light: '#FF7043',
            DEFAULT: '#E54A2D',
            dark: '#CC3300',
          },
          gray: {
            900: '#1A100F',
            800: '#2A1E1E',
            700: '#615B5B',
            600: '#4D4949',
            100: '#F0EFEF',
            300: '#D3D3D3',
          }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(249, 115, 22, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}