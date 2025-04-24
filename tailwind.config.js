** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Blue for buttons and accents
        secondary: '#10B981', // Green for success actions
        danger: '#EF4444', // Red for errors or logout
      },
    },
  },
  plugins: [],
};