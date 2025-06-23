// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Consolidated "True Black & Minimalist Polish" Palette ---
        'true-black': '#000000', // Pure black for backgrounds
        
        'card-dark-gray': '#1A1A1A',     // Background for main cards/panels (e.g., file cards, login/register forms)
        'card-inner-dark': '#2B2B2B',    // Background for elements inside cards (e.g., input fields, share details sections)
        
        'text-white': '#FFFFFF',    // Primary text color for high contrast
        'text-light-gray': '#BBBBBB', // Secondary/muted text color
        
        'accent-blue': '#3B82F6',    // Primary accent color for buttons, links, and highlights
        'accent-green': '#10B981', // Success messages/icons
        'accent-red': '#EF4444',    // Error messages/delete buttons
        'accent-yellow': '#FACC15', // Warning messages/expiry times
        
        'border-subtle': '#3F3F46', // Subtle border color for delineation
      },
      boxShadow: {
        'card-elevate': '0 4px 10px rgba(0, 0, 0, 0.4)', // General card shadow
        'btn-hover': '0 2px 8px rgba(59, 130, 246, 0.4)', // Button hover shadow
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pop-scale': 'popScale 0.3s ease-out forwards', // For modal pop-in
        'copied-fade': 'copiedFade 0.3s ease-out forwards', // For copy feedback
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        popScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        copiedFade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};