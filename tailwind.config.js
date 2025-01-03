/** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            'dark-navy': '#0f172a',
            'light-navy': '#1e293b',
          },
        },
      },
      plugins: [],
    }
