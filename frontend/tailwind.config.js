export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 60px rgba(56, 189, 248, .14)',
      },
      colors: {
        midnight: '#060b1d',
        plasma: '#0f172a',
        cyan: '#22d3ee',
        rose: '#fb7185',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
