/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official Master Palette
        master: {
          midnightPlum: '#1F0212',
          wineBurgundy: '#431715',
          champagneIvory: '#F7DFB3',
          softGold: '#E0B477',
          antiqueGold: '#B17D3E',
        },
        wine: {
          950: '#1F0212',
          900: '#2A0519',
          850: '#380922',
          800: '#431715',
          700: '#5A1B28',
        },
        plum: {
          950: '#1F0212',
          900: '#270417',
          850: '#33061F',
          800: '#431715',
          700: '#541A28',
        },
        burgundy: {
          950: '#1F0212',
          900: '#2F0816',
          850: '#431715',
          800: '#581C1D',
          700: '#722627',
        },
        navy: {
          950: '#1F0212',
          900: '#260417',
          850: '#32061F',
          800: '#431715',
        },
        gold: {
          100: '#FDF7EB',
          200: '#F7DFB3', // Champagne Ivory
          300: '#EBD09C',
          400: '#E0B477', // Soft Champagne Gold
          500: '#C99852',
          600: '#B17D3E', // Antique Gold
          700: '#8A5C28',
        },
        ivory: {
          50: '#FFFCF5',
          100: '#FAF2E2',
          200: '#F7DFB3', // Champagne Ivory
          300: '#E8CA97',
        },
        sage: {
          400: '#8e9f90',
          500: '#738675',
          600: '#596c5b',
          700: '#405042',
        }
      },
      fontFamily: {
        calligraphy: ['"Great Vibes"', '"Alex Brush"', 'cursive'],
        script: ['"Pinyon Script"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        cinzelDeco: ['"Cinzel Decorative"', 'serif'],
        playfair: ['"Playfair Display"', 'serif'],
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(135deg, #fef2cc 0%, #d4af37 50%, #8c6e18 100%)',
        'gold-radial': 'radial-gradient(circle, #fff3cf 0%, #d4af37 60%, #856515 100%)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'floatRev 9s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'spin-very-slow': 'spin 50s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        floatRev: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(-1deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
