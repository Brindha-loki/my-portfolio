export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  plugins: [],
  theme: {
    extend: {
      colors: {
        cherry: {
          DEFAULT: '#9B1C31',
          dark: '#701426',
          light: '#C4506B',
        },
        burnt: {
          DEFAULT: '#D9A441',
          dark: '#B9852F',
          light: '#E8C37A',
        },
        cream: '#FFF8ED',
        charcoal: '#252321',
        ink: '#3A3633',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
