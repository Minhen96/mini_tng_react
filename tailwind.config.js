export default {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#ffffff',
        'accent': '#4a9eff',
        'mono-dark': '#0a0a0a',
        'mono-surface': 'rgba(255, 255, 255, 0.03)',
        'mono-border': 'rgba(255, 255, 255, 0.1)',
        'mono-muted': 'rgba(255, 255, 255, 0.5)',
      },
      boxShadow: {
        'subtle': '0 0 20px rgba(255, 255, 255, 0.03)',
        'subtle-hover': '0 0 30px rgba(255, 255, 255, 0.06)',
        'subtle-focus': '0 0 15px rgba(74, 158, 255, 0.1)',
      },
      spacing: {
        128: '32rem',
      },
    },
  },
  plugins: [],
}