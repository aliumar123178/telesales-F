/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#10222E',
        surface: '#FFFFFF',
        canvas: '#F5F8FA',
        brand: {
          50: '#EAF3F6',
          100: '#CFE4EA',
          300: '#6FA9BC',
          500: '#0B4F6C',
          600: '#093F57',
          700: '#073042',
        },
        coral: {
          50: '#FFF0EB',
          200: '#FFC3B1',
          500: '#FF6B4A',
          600: '#E5502F',
        },
        success: '#1FAA59',
        warning: '#F5A623',
        danger: '#E03E3E',
        info: '#2E7DD1',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,34,46,0.06), 0 4px 12px rgba(16,34,46,0.06)',
      },
    },
  },
  plugins: [],
};
